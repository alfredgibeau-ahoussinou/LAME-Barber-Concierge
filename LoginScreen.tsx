// src/screens/auth/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS } from '../../theme';
import { Button, Divider, Card } from '../../components/UI';

interface Props { navigation: any; }

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    navigation.replace('ClientTabs');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>BLADE</Text>
          <Text style={styles.sub}>Connexion</Text>
        </View>

        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Bon retour</Text>
          <Text style={styles.titleItalic}>parmi nous</Text>
        </View>

        {/* Form */}
        <Text style={styles.fieldLabel}>EMAIL</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="alexandre@hotel.com"
          placeholderTextColor={COLORS.textSecondary}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardAppearance="dark"
        />

        <Text style={styles.fieldLabel}>MOT DE PASSE</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          placeholderTextColor={COLORS.textSecondary}
          secureTextEntry
          keyboardAppearance="dark"
        />

        <View style={styles.rememberRow}>
          <Text style={styles.rememberText}>Se souvenir de moi</Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>
        </View>

        <Button label="Se connecter" onPress={handleLogin} loading={loading} />

        <Divider style={{ marginVertical: 20 }} />

        {/* Social Login */}
        <Text style={styles.socialTitle}>Connexion rapide</Text>
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8}>
            <Text style={styles.socialIcon}>G</Text>
            <Text style={styles.socialText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8}>
            <Text style={styles.socialIcon}></Text>
            <Text style={styles.socialText}>Apple</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Pas de compte ? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup1')}>
            <Text style={styles.signupLink}>S'inscrire →</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={{ alignSelf: 'center', marginTop: 10 }} onPress={() => navigation.navigate('BarberTabs')}>
          <Text style={styles.proLink}>Espace Barbier Pro →</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.xl,
    backgroundColor: COLORS.bg,
    flexGrow: 1,
  },
  header: { marginBottom: 28 },
  logo: {
    fontFamily: FONTS.serif,
    fontSize: 26, fontWeight: '300',
    letterSpacing: 2.5, color: COLORS.gold,
  },
  sub: {
    fontSize: 9, fontFamily: FONTS.sansMedium,
    letterSpacing: 2, textTransform: 'uppercase',
    color: COLORS.textSecondary, opacity: 0.5, marginTop: 3,
  },
  titleBlock: { marginBottom: 28 },
  title: {
    fontFamily: FONTS.serif,
    fontSize: 34, fontWeight: '300',
    color: COLORS.textPrimary, lineHeight: 42,
  },
  titleItalic: {
    fontFamily: FONTS.serifItalic,
    fontSize: 34, fontWeight: '300',
    color: COLORS.textPrimary, opacity: 0.35, lineHeight: 42,
  },
  fieldLabel: {
    fontSize: 9, fontFamily: FONTS.sansMedium,
    letterSpacing: 1.6, color: COLORS.textPrimary,
    opacity: 0.32, marginBottom: 6, marginTop: 14,
  },
  input: {
    backgroundColor: COLORS.bg3,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    fontFamily: FONTS.sansLight,
    color: COLORS.textPrimary,
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  rememberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 14,
  },
  rememberText: { fontSize: 11, fontFamily: FONTS.sans, color: COLORS.textSecondary },
  forgotText: { fontSize: 11, fontFamily: FONTS.sansMedium, color: COLORS.gold },
  socialTitle: {
    fontSize: 11, fontFamily: FONTS.sans, color: COLORS.textSecondary,
    textAlign: 'center', marginBottom: 12, opacity: 0.7,
  },
  socialRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  socialBtn: {
    flex: 1,
    backgroundColor: COLORS.bg3,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    paddingVertical: 12,
    gap: 5,
  },
  socialIcon: { fontSize: 18, color: COLORS.textPrimary },
  socialText: { fontSize: 10, fontFamily: FONTS.sans, color: COLORS.textSecondary },
  signupRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  signupText: { fontSize: 12, fontFamily: FONTS.sans, color: COLORS.textSecondary },
  signupLink: { fontSize: 12, fontFamily: FONTS.sansMedium, color: COLORS.gold },
  proLink: { fontSize: 11, fontFamily: FONTS.sansMedium, color: COLORS.gold, opacity: 0.6 },
});

export default LoginScreen;
