// Seleccion y subida de la foto de perfil al Storage de Supabase.
// La imagen se guarda en avatars/{userId}/avatar.jpg (un solo archivo,
// se sobrescribe) y la URL publica versionada queda en profiles.avatar_url.
import * as ImagePicker from 'expo-image-picker';

import { supabase } from './supabase';

interface UploadResult {
  url?: string;
  error?: string;
  canceled?: boolean;
}

const BASE64_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

// Decodifica base64 a bytes sin depender de atob/Buffer: confiable en iOS,
// Android y web. Supabase Storage acepta el Uint8Array para la subida.
function decodeBase64(input: string): Uint8Array {
  const clean = input.replace(/[^A-Za-z0-9+/]/g, '');
  const len = clean.length;
  const padding = clean.endsWith('==') ? 2 : clean.endsWith('=') ? 1 : 0;
  const byteLength = Math.floor((len * 3) / 4) - padding;
  const bytes = new Uint8Array(byteLength);

  let p = 0;
  for (let i = 0; i < len; i += 4) {
    const c0 = BASE64_CHARS.indexOf(clean[i]);
    const c1 = BASE64_CHARS.indexOf(clean[i + 1]);
    const c2 = BASE64_CHARS.indexOf(clean[i + 2]);
    const c3 = BASE64_CHARS.indexOf(clean[i + 3]);

    const n = (c0 << 18) | (c1 << 12) | ((c2 & 63) << 6) | (c3 & 63);

    if (p < byteLength) bytes[p++] = (n >> 16) & 0xff;
    if (p < byteLength) bytes[p++] = (n >> 8) & 0xff;
    if (p < byteLength) bytes[p++] = n & 0xff;
  }

  return bytes;
}

export async function pickAndUploadAvatar(userId: string): Promise<UploadResult> {
  // En nativo pide permiso de galeria; en web se resuelve como concedido.
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) {
    return { error: 'Necesitamos permiso para acceder a tus fotos.' };
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
    // Pedimos el base64 directo: en iOS leer el file:// con fetch().arrayBuffer()
    // es poco fiable y puede colgar la subida indefinidamente.
    base64: true,
  });

  if (result.canceled || !result.assets?.length) {
    return { canceled: true };
  }

  const asset = result.assets[0];

  if (!asset.base64) {
    return { error: 'No pudimos leer la imagen. Proba de nuevo.' };
  }

  try {
    const bytes = decodeBase64(asset.base64);
    const contentType = asset.mimeType ?? 'image/jpeg';
    const path = `${userId}/avatar.jpg`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, bytes, { contentType, upsert: true });

    if (uploadError) {
      return { error: 'No pudimos subir la imagen. Proba de nuevo.' };
    }

    // Cache-bust: al sobrescribir el mismo path, el CDN podria servir la vieja.
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    const url = `${data.publicUrl}?v=${Date.now()}`;

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ avatar_url: url })
      .eq('id', userId);

    if (profileError) {
      return { error: 'Subimos la imagen pero no pudimos guardarla en tu perfil.' };
    }

    return { url };
  } catch {
    return { error: 'No pudimos procesar la imagen.' };
  }
}
