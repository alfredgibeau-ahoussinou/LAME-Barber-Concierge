// src/components/UI.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';

// ── Button ──────────────────────────────────────────
interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  small?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label, onPress, variant = 'primary', loading, disabled, style, small,
}) => {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.btn,
        small && styles.btnSm,
        isPrimary && styles.btnPrimary,
        isOutline && styles.btnOutline,
        variant === 'ghost' && styles.btnGhost,
        (disabled || loading) && styles.btnDisabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? COLORS.bg : COLORS.gold} size="small" />
      ) : (
        <Text style={[
          styles.btnText,
          small && styles.btnTextSm,
          isOutline && styles.btnTextOutline,
          variant === 'ghost' && styles.btnTextGhost,
        ]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

// ── Card ─────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  gold?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, style, onPress, gold }) => {
  const Component = onPress ? TouchableOpacity : View;
  return (
    <Component
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.card, gold && styles.cardGold, style]}
    >
      {children}
    </Component>
  );
};

// ── Badge ─────────────────────────────────────────────
interface BadgeProps {
  label: string;
  variant?: 'gold' | 'green' | 'red' | 'default';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'gold', style }) => (
  <View style={[styles.badge, styles[`badge_${variant}`], style]}>
    <Text style={[styles.badgeText, styles[`badgeText_${variant}`]]}>{label}</Text>
  </View>
);

// ── Avatar ────────────────────────────────────────────
interface AvatarProps {
  initials: string;
  size?: number;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({ initials, size = 40, style }) => (
  <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }, style]}>
    <Text style={[styles.avatarText, { fontSize: size * 0.42 }]}>{initials}</Text>
  </View>
);

// ── Divider ───────────────────────────────────────────
export const Divider: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <View style={[styles.divider, style]} />
);

// ── Section Label ─────────────────────────────────────
export const SectionLabel: React.FC<{ label: string; style?: ViewStyle }> = ({ label, style }) => (
  <Text style={[styles.sectionLabel, style]}>{label}</Text>
);

// ── Tag ───────────────────────────────────────────────
interface TagProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  small?: boolean;
}

export const Tag: React.FC<TagProps> = ({ label, active, onPress, small }) => {
  const Component = onPress ? TouchableOpacity : View;
  return (
    <Component
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.tag, active && styles.tagActive, small && styles.tagSm]}
    >
      <Text style={[styles.tagText, active && styles.tagTextActive, small && styles.tagTextSm]}>
        {label}
      </Text>
    </Component>
  );
};

// ── Star Rating ───────────────────────────────────────
export const StarRating: React.FC<{ rating: number; size?: number }> = ({ rating, size = 13 }) => (
  <Text style={{ fontSize: size, color: COLORS.gold, letterSpacing: 2 }}>
    {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
  </Text>
);

// ── Price ─────────────────────────────────────────────
export const Price: React.FC<{ value: string; size?: number; style?: TextStyle }> = ({
  value, size = 22, style,
}) => (
  <Text style={[styles.price, { fontSize: size }, style]}>{value}</Text>
);

// ── Live Indicator ────────────────────────────────────
export const LiveIndicator: React.FC<{ label?: string }> = ({ label = 'LIVE' }) => (
  <View style={styles.liveRow}>
    <View style={styles.liveDot} />
    <Text style={styles.liveText}>{label}</Text>
  </View>
);

// ── Toggle ────────────────────────────────────────────
interface ToggleRowProps {
  label: string;
  subtitle?: string;
  value: boolean;
  onToggle: () => void;
}

export const ToggleRow: React.FC<ToggleRowProps> = ({ label, subtitle, value, onToggle }) => (
  <TouchableOpacity onPress={onToggle} activeOpacity={0.8} style={styles.toggleRow}>
    <View style={{ flex: 1 }}>
      <Text style={styles.toggleLabel}>{label}</Text>
      {subtitle && <Text style={styles.toggleSub}>{subtitle}</Text>}
    </View>
    <View style={[styles.toggleTrack, value && styles.toggleTrackOn]}>
      <View style={[styles.toggleThumb, value && styles.toggleThumbOn]} />
    </View>
  </TouchableOpacity>
);

// ── Step Indicator ────────────────────────────────────
export const StepIndicator: React.FC<{ total: number; current: number }> = ({ total, current }) => (
  <View style={styles.stepRow}>
    {Array.from({ length: total }).map((_, i) => (
      <View key={i} style={[styles.stepDot, i < current && styles.stepDotOn]} />
    ))}
  </View>
);

// ── Onboarding Dots ───────────────────────────────────
export const OnboardingDots: React.FC<{ total: number; current: number }> = ({ total, current }) => (
  <View style={styles.onbDots}>
    {Array.from({ length: total }).map((_, i) => (
      <View key={i} style={[styles.onbDot, i === current && styles.onbDotActive]} />
    ))}
  </View>
);

// ── Input Mock (display only) ─────────────────────────
export const InputField: React.FC<{
  value: string;
  placeholder?: string;
  style?: ViewStyle;
  multiline?: boolean;
}> = ({ value, placeholder, style, multiline }) => (
  <View style={[styles.inputField, multiline && styles.inputMulti, style]}>
    <Text style={value ? styles.inputText : styles.inputPlaceholder} numberOfLines={multiline ? 4 : 1}>
      {value || placeholder}
    </Text>
  </View>
);

// ── Styles ────────────────────────────────────────────
const styles = StyleSheet.create({
  btn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  btnSm: { paddingVertical: 9, paddingHorizontal: 14, width: 'auto' },
  btnPrimary: { backgroundColor: COLORS.gold },
  btnOutline: {
    backgroundColor: COLORS.transparent,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginTop: 6,
  },
  btnGhost: { backgroundColor: COLORS.transparent },
  btnDisabled: { opacity: 0.4 },
  btnText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: COLORS.bg,
  },
  btnTextSm: { fontSize: 10 },
  btnTextOutline: { color: COLORS.textSecondary },
  btnTextGhost: { color: COLORS.gold, letterSpacing: 0.4, textTransform: 'none', fontSize: 11 },

  card: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: 10,
    backgroundColor: COLORS.bg3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardGold: { backgroundColor: COLORS.bg5, borderColor: 'rgba(184,150,62,0.2)' },

  badge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  badge_gold: { backgroundColor: COLORS.bg5, borderColor: COLORS.goldBorder },
  badge_green: { backgroundColor: COLORS.successBg, borderColor: 'rgba(90,154,90,0.3)' },
  badge_red: { backgroundColor: COLORS.dangerBg, borderColor: 'rgba(192,80,80,0.25)' },
  badge_default: { backgroundColor: COLORS.bg4, borderColor: COLORS.border },
  badgeText: { fontSize: 9, fontFamily: FONTS.sansMedium, letterSpacing: 0.6 },
  badgeText_gold: { color: COLORS.gold },
  badgeText_green: { color: COLORS.success },
  badgeText_red: { color: COLORS.danger },
  badgeText_default: { color: COLORS.textSecondary },

  avatar: {
    backgroundColor: COLORS.bg5,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: FONTS.serif, color: COLORS.gold, fontWeight: '400' },

  divider: { height: 1, backgroundColor: COLORS.white, opacity: 0.07, marginVertical: 12 },

  sectionLabel: {
    fontSize: 9,
    fontFamily: FONTS.sansMedium,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: COLORS.textPrimary,
    opacity: 0.32,
    marginTop: 14,
    marginBottom: 6,
  },

  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(184,150,62,0.22)',
    marginRight: 4,
    marginBottom: 4,
  },
  tagActive: { borderColor: 'rgba(184,150,62,0.6)' },
  tagSm: { paddingHorizontal: 7, paddingVertical: 2 },
  tagText: { fontSize: 10, fontFamily: FONTS.sans, color: COLORS.gold, opacity: 0.5 },
  tagTextActive: { opacity: 1 },
  tagTextSm: { fontSize: 9 },

  price: {
    fontFamily: FONTS.serif,
    color: COLORS.gold,
    fontWeight: '300',
  },

  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  liveDot: {
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: COLORS.gold,
  },
  liveText: {
    fontSize: 9, fontFamily: FONTS.sansMedium,
    letterSpacing: 1, color: COLORS.gold,
  },

  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 7,
    backgroundColor: COLORS.bg3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  toggleLabel: { fontSize: 12, fontFamily: FONTS.sans, color: COLORS.textPrimary },
  toggleSub: { fontSize: 10, color: COLORS.textSecondary, marginTop: 2 },
  toggleTrack: {
    width: 32, height: 17, borderRadius: 9,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleTrackOn: { backgroundColor: COLORS.gold },
  toggleThumb: {
    width: 13, height: 13, borderRadius: 7,
    backgroundColor: COLORS.white,
    alignSelf: 'flex-start',
  },
  toggleThumbOn: { alignSelf: 'flex-end' },

  stepRow: { flexDirection: 'row', justifyContent: 'center', gap: 5, marginBottom: 16 },
  stepDot: { width: 22, height: 2, borderRadius: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  stepDotOn: { backgroundColor: COLORS.gold },

  onbDots: { flexDirection: 'row', gap: 6, justifyContent: 'center', marginTop: 18, marginBottom: 8 },
  onbDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.15)' },
  onbDotActive: { width: 18, borderRadius: 3, backgroundColor: COLORS.gold },

  inputField: {
    width: '100%',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bg3,
    marginBottom: 8,
  },
  inputMulti: { minHeight: 68 },
  inputText: { fontSize: 12, fontFamily: FONTS.sansLight, color: COLORS.textPrimary, letterSpacing: 0.2 },
  inputPlaceholder: { fontSize: 12, fontFamily: FONTS.sansLight, color: COLORS.textSecondary },
});
