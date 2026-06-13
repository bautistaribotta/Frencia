/* Frencia · Login — pantalla de acceso.
   Campo negro, verde esmeralda, Anton en el hero. "Cada serie cuenta." */

import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Button,
  FrenciaText,
  Icon,
  colors,
  radius,
  sans,
  shadow,
  sizing,
  space,
  spacing,
  tracking,
} from '@/design';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit = email.trim().length > 3 && password.length >= 6;

  function handleLogin() {
    if (!canSubmit || loading) return;
    setLoading(true);
    // TODO: conectar auth real. Placeholder.
    setTimeout(() => setLoading(false), 1200);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View style={styles.hero}>
            <View style={styles.mark}>
              <Icon name="dumbbell" size={26} color={colors.textOnAccent} />
            </View>
            <FrenciaText role="hero" style={styles.wordmark}>
              FRENCIA
            </FrenciaText>
            <FrenciaText
              role="dataLabel"
              color={colors.accentText}
              style={styles.tagline}
            >
              Cada serie cuenta
            </FrenciaText>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <FrenciaText role="title" style={styles.heading}>
              Entrá a tu cuenta
            </FrenciaText>
            <FrenciaText role="bodySm" color={colors.textSecondary}>
              Seguí registrando cada serie donde la dejaste.
            </FrenciaText>

            <View style={styles.fields}>
              <Field
                icon="mail"
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                inputMode="email"
              />
              <Field
                icon="lock"
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
                autoCapitalize="none"
                autoComplete="password"
                trailing={
                  <Pressable
                    hitSlop={10}
                    onPress={() => setShowPass((s) => !s)}
                    accessibilityRole="button"
                    accessibilityLabel={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    <Icon
                      name={showPass ? 'eye-off' : 'eye'}
                      size={20}
                      color={colors.textTertiary}
                    />
                  </Pressable>
                }
              />
            </View>

            <Pressable style={styles.forgot} hitSlop={8}>
              <FrenciaText role="bodySm" color={colors.accentText}>
                ¿Olvidaste tu contraseña?
              </FrenciaText>
            </Pressable>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              iconRight="arrow-right"
              disabled={!canSubmit}
              loading={loading}
              onPress={handleLogin}
            >
              Entrar
            </Button>

            {/* Divisor */}
            <View style={styles.divider}>
              <View style={styles.line} />
              <FrenciaText role="dataLabel" color={colors.textTertiary}>
                o continuá con
              </FrenciaText>
              <View style={styles.line} />
            </View>

            <View style={styles.social}>
              <Button variant="secondary" size="lg" icon="apple" style={styles.socialBtn}>
                Apple
              </Button>
              <Button variant="secondary" size="lg" icon="zap" style={styles.socialBtn}>
                Google
              </Button>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <FrenciaText role="bodySm" color={colors.textSecondary}>
              ¿No tenés cuenta?{' '}
            </FrenciaText>
            <Pressable hitSlop={8}>
              <FrenciaText role="bodySm" color={colors.accentText} style={styles.footerLink}>
                Creá una
              </FrenciaText>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ── Campo de texto con icono, focus verde ───────────────────── */
interface FieldProps extends TextInputProps {
  icon: string;
  trailing?: React.ReactNode;
}

function Field({ icon, trailing, ...rest }: FieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View
      style={[
        styles.field,
        focused && styles.fieldFocused,
      ]}
    >
      <Icon name={icon} size={20} color={focused ? colors.accent : colors.textTertiary} />
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.textTertiary}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...rest}
      />
      {trailing}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgApp },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.padScreen,
    paddingBottom: space[8],
    justifyContent: 'center',
    gap: space[10],
  },

  // Hero
  hero: { alignItems: 'center', gap: space[4] },
  mark: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.glowGreenSoft,
  },
  wordmark: { color: colors.textPrimary },
  tagline: { marginTop: -space[2] },

  // Form
  form: { gap: space[5] },
  heading: { marginBottom: -space[3] },
  fields: { gap: space[4], marginTop: space[2] },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[4],
    height: sizing.controlHLg,
    paddingHorizontal: spacing.padControl,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  fieldFocused: {
    borderColor: colors.surfaceGreenLine,
    backgroundColor: colors.surfaceCardElevated,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontFamily: sans.regular,
    fontSize: 16,
    padding: 0,
  },
  forgot: { alignSelf: 'flex-end', marginTop: -space[2] },

  // Divisor
  divider: { flexDirection: 'row', alignItems: 'center', gap: space[4] },
  line: { flex: 1, height: 1, backgroundColor: colors.divider },

  // Social
  social: { flexDirection: 'row', gap: space[4] },
  socialBtn: { flex: 1 },

  // Footer
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerLink: { fontFamily: sans.semibold, letterSpacing: tracking.normal },
});
