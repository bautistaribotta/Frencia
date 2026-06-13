/* Frencia · Avatar — RN port of components/core/Avatar.jsx
   Image or initials fallback. */

import React from 'react';
import { Image, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { colors, palette, sans } from '../theme';

type Size = 'xs' | 'sm' | 'md' | 'lg';

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: Size;
  ring?: boolean;
  style?: ViewStyle;
}

const DIM: Record<Size, number> = { xs: 28, sm: 36, md: 44, lg: 64 };
const FONT: Record<Size, number> = { xs: 11, sm: 13, md: 16, lg: 22 };

function initials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] || '')
    .join('')
    .toUpperCase();
}

export function Avatar({ src, name = '', size = 'md', ring = false, style }: AvatarProps) {
  const dim = DIM[size];
  return (
    <View
      style={[
        styles.base,
        { width: dim, height: dim, borderRadius: dim / 2 },
        ring && { borderWidth: 2, borderColor: colors.accent },
        style,
      ]}
    >
      {src ? (
        <Image source={{ uri: src }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
      ) : (
        <Text style={[styles.initials, { fontSize: FONT[size] }]}>{initials(name)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: palette.greenDeep,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  initials: { color: palette.green300, fontFamily: sans.bold },
});
