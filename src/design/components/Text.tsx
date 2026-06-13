/* Frencia · Text — typed wrapper that applies a semantic text role.
   <FrenciaText role="title">Sesión de hoy</FrenciaText>
   Defaults to body + primary color. */

import React from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { colors, textRole } from '../theme';

type Role = keyof typeof textRole;

export interface FrenciaTextProps extends Omit<RNTextProps, 'role'> {
  role?: Role;
  color?: string;
}

export function FrenciaText({ role = 'body', color = colors.textPrimary, style, ...rest }: FrenciaTextProps) {
  return <RNText style={[textRole[role], { color }, style]} {...rest} />;
}
