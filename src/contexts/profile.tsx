/* Frencia · Contexto de perfil.
   Trae una sola vez los datos del perfil del usuario logueado y los
   comparte con todas las rutas (saludo, avatar, completitud para el
   flujo de setup). Reemplaza el prop-drilling que antes bajaba desde
   el layout raiz. Expone `refresh` para releer tras editar y
   `applyAvatar` para reflejar cambios de foto al instante. */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { supabase } from '@/lib/supabase';
import { useSession } from './session';

export interface ProfileData {
  name: string | null;
  username: string | null;
  edad: number | null;
  sexo: string | null;
  altura: number | null;
  peso: number | null;
  avatarUrl: string | null;
  avatarSeed: string | null;
}

interface ProfileContextValue {
  profile: ProfileData | null;
  loading: boolean;
  // Nombre listo para mostrar, con fallback si el perfil aun no cargo.
  displayName: string;
  // Falta algun dato base del perfil (primer ingreso).
  isIncomplete: boolean;
  refresh: () => Promise<void>;
  applyAvatar: (next: { url?: string | null; seed?: string | null }) => void;
}

const ProfileContext = createContext<ProfileContextValue>({
  profile: null,
  loading: true,
  displayName: 'Atleta',
  isIncomplete: true,
  refresh: async () => {},
  applyAvatar: () => {},
});

function computeIncomplete(profile: ProfileData | null): boolean {
  return (
    !profile ||
    profile.edad == null ||
    profile.sexo == null ||
    profile.altura == null ||
    profile.peso == null
  );
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const {
      data: { user: current },
    } = await supabase.auth.getUser();

    if (!current) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('profiles')
      .select('name, username, edad, sexo, altura, peso, avatar_url, avatar_seed')
      .eq('id', current.id)
      .maybeSingle();

    setProfile(
      data
        ? {
            name: data.name,
            username: data.username,
            edad: data.edad,
            sexo: data.sexo,
            altura: data.altura,
            peso: data.peso,
            avatarUrl: data.avatar_url,
            avatarSeed: data.avatar_seed,
          }
        : null,
    );
    setLoading(false);
  }, []);

  // Recarga el perfil cada vez que cambia el usuario (login/logout).
  const userId = user?.id;
  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    refresh();
  }, [userId, refresh]);

  const applyAvatar = useCallback(
    (next: { url?: string | null; seed?: string | null }) => {
      setProfile((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          avatarUrl: next.url !== undefined ? next.url : prev.avatarUrl,
          avatarSeed: next.seed !== undefined ? next.seed : prev.avatarSeed,
        };
      });
    },
    [],
  );

  const displayName = profile?.name?.trim() || 'Atleta';

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        displayName,
        isIncomplete: computeIncomplete(profile),
        refresh,
        applyAvatar,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextValue {
  return useContext(ProfileContext);
}
