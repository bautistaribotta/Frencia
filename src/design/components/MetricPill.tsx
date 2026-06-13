/* Frencia · MetricPill — RN port of components/data/MetricPill.jsx
   Inline metric chip — icon + label + value (rest timer, RIR, pace). */

import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { colors, mono, radius, tracking } from '../theme';
import { Icon } from '../Icon';

type Tone = 'neutral' | 'green' | 'orange';
type Layout = 'stack' | 'inline';

export interface MetricPillProps {
  icon?: string;
  label?: string;
  value: React.ReactNode;
  tone?: Tone;
  layout?: Layout;
  style?: ViewStyle;
}

const FILL: Record<Tone, ViewStyle> = {
  neutral: { backgroundColor: colors.surfaceChip },
  green: { backgroundColor: colors.surfaceGreenSoft, borderColor: colors.surfaceGreenLine, borderWidth: 1 },
  orange: { backgroundColor: colors.surfaceOrangeSoft, borderColor: colors.surfaceOrangeLine, borderWidth: 1 },
};
const VALUE_COLOR: Record<Tone, string> = {
  neutral: colors.textPrimary,
  green: colors.accentText,
  orange: colors.intensityText,
};
const ICON_COLOR: Record<Tone, string> = {
  neutral: colors.textTertiary,
  green: colors.accentText,
  orange: colors.intensityText,
};

export function MetricPill({ icon, label, value, tone = 'neutral', layout = 'stack', style }: MetricPillProps) {
  const inline = layout === 'inline';
  return (
    <View style={[styles.base, inline && styles.baseInline, FILL[tone], style]}>
      {icon ? <Icon name={icon} size={16} color={ICON_COLOR[tone]} /> : null}
      <View style={inline ? styles.bodyInline : styles.body}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <Text style={[styles.value, { color: VALUE_COLOR[tone] }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'transparent',
    alignSelf: 'flex-start',
  },
  baseInline: { paddingVertical: 6, paddingHorizontal: 12 },
  body: { flexDirection: 'column' },
  bodyInline: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  label: {
    fontFamily: mono.medium,
    fontSize: 9,
    letterSpacing: tracking.wider,
    textTransform: 'uppercase',
    color: colors.textTertiary,
  },
  value: { fontFamily: mono.bold, fontSize: 15 },
});
