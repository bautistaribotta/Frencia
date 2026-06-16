/* Frencia · Contexto de sesion.
   Fuente unica de la sesion de Supabase para toda la app. Escucha los
   cambios de auth (login, logout, refresh de token) y los expone a las
   rutas para decidir el flujo (autenticado vs no autenticado). */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';

interface SessionContextValue {
  session: Session | null;
  user: User | null;
  // Mientras resolvemos la sesion inicial no decidimos rutas todavia.
  initializing: boolean;
}

const SessionContext = createContext<SessionContextValue>({
  session: null,
  user: null,
  initializing: true,
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let activo = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!activo) return;
      setSession(data.session);
      setInitializing(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!activo) return;
      setSession(nextSession);
    });

    return () => {
      activo = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SessionContext.Provider
      value={{ session, user: session?.user ?? null, initializing }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  return useContext(SessionContext);
}
