// src/screens/auth/SignupScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS } from '../../theme';
import { Button, StepIndicator, Tag, ToggleRow, Divider } from '../../components/UI';

const CONTEXTS = ['Hôtel', 'Palace', 'Particulier', 'Mariage', 'EVG', 'Aéroport', 'Bureau'];

interface StepProps { navigation: any; }

// ═══════════════════════════════════════════════════════
// STEP 1 — Identité
// ═══════════════════════════════════════════════════════
export const Signup1Screen: React.FC<StepProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.hdr}>
          <View><Text style={styles.logo}>BLADE</Text><Text style={styles.sub}>Inscription</Text></View>
          <Text style={styles.stepNum}>1/4</Text>
        </View>
        <StepIndicator total={4} current={1} />
        <Text style={styles.title}>Votre identité</Text>
        <Text style={styles.stepSubtitle}>Étape 1 — Informations personnelles</Text>

        <Text style={styles.lbl}>PRÉNOM &amp; NOM</Text>
        <View style={styles.rowInputs}>
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="Alexandre" placeholderTextColor={COLORS.textSecondary} value={firstName} onChangeText={setFirstName} keyboardAppearance="dark" />
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="Martin" placeholderTextColor={COLORS.textSecondary} value={lastName} onChangeText={setLastName} keyboardAppearance="dark" />
        </View>
        <Text style={styles.lbl}>EMAIL</Text>
        <TextInput style={styles.input} placeholder="alex@email.com" placeholderTextColor={COLORS.textSecondary} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" keyboardAppearance="dark" />
        <Text style={styles.lbl}>TÉLÉPHONE</Text>
        <TextInput style={styles.input} placeholder="+33 6 12 34 56 78" placeholderTextColor={COLORS.textSecondary} value={phone} onChangeText={setPhone} keyboardType="phone-pad" keyboardAppearance="dark" />
        <Text style={styles.lbl}>DATE DE NAISSANCE</Text>
        <TextInput style={styles.input} placeholder="JJ / MM / AAAA" placeholderTextColor={COLORS.textSecondary} value={dob} onChangeText={setDob} keyboardAppearance="dark" />

        <Button label="Continuer" onPress={() => navigation.navigate('Signup2')} style={{ marginTop: 16 }} />
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Déjà un compte ? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ═══════════════════════════════════════════════════════
// STEP 2 — Profil & Contextes
// ═══════════════════════════════════════════════════════
export const Signup2Screen: React.FC<StepProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [isClient, setIsClient] = useState(true);
  const [selectedContexts, setSelectedContexts] = useState<string[]>(['Hôtel', 'Bureau']);

  const toggleContext = (ctx: string) => {
    setSelectedContexts(prev =>
      prev.includes(ctx) ? prev.filter(c => c !== ctx) : [...prev, ctx]
    );
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hdr}>
        <View><Text style={styles.logo}>BLADE</Text><Text style={styles.sub}>Inscription</Text></View>
        <Text style={styles.stepNum}>2/4</Text>
      </View>
      <StepIndicator total={4} current={2} />
      <Text style={styles.title}>Votre profil</Text>
      <Text style={styles.stepSubtitle}>Étape 2 — Vous êtes</Text>

      {/* Account type */}
      <TouchableOpacity
        style={[styles.choiceCard, isClient && styles.choiceCardActive]}
        onPress={() => setIsClient(true)}
        activeOpacity={0.85}
      >
        <View style={[styles.choiceChk, isClient && styles.choiceChkActive]}>
          {isClient && <Text style={styles.choiceChkTick}>✓</Text>}
        </View>
        <View>
          <Text style={[styles.choiceTitle, isClient && { color: COLORS.textPrimary }]}>Client</Text>
          <Text style={styles.choiceSub}>Je cherche un barbier à domicile</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.choiceCard, !isClient && styles.choiceCardActive, { opacity: 0.4 }]}
        onPress={() => { setIsClient(false); navigation.navigate('BarberTabs'); }}
        activeOpacity={0.85}
      >
        <View style={[styles.choiceChk, !isClient && styles.choiceChkActive]}>
          {!isClient && <Text style={styles.choiceChkTick}>✓</Text>}
        </View>
        <View>
          <Text style={styles.choiceTitle}>Barbier Pro</Text>
          <Text style={styles.choiceSub}>Je propose mes services à domicile</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.lbl}>CONTEXTE HABITUEL</Text>
      <View style={styles.tagsWrap}>
        {CONTEXTS.map(ctx => (
          <Tag
            key={ctx}
            label={ctx}
            active={selectedContexts.includes(ctx)}
            onPress={() => toggleContext(ctx)}
          />
        ))}
      </View>

      <Button label="Continuer" onPress={() => navigation.navigate('Signup3')} style={{ marginTop: 16 }} />
    </ScrollView>
  );
};

// ═══════════════════════════════════════════════════════
// STEP 3 — Adresse
// ═══════════════════════════════════════════════════════
export const Signup3Screen: React.FC<StepProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [secondary, setSecondary] = useState('');
  const [geoEnabled, setGeoEnabled] = useState(true);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.hdr}>
          <View><Text style={styles.logo}>BLADE</Text><Text style={styles.sub}>Inscription</Text></View>
          <Text style={styles.stepNum}>3/4</Text>
        </View>
        <StepIndicator total={4} current={3} />
        <Text style={styles.title}>Votre adresse</Text>
        <Text style={styles.stepSubtitle}>Étape 3 — Localisation</Text>

        <Text style={styles.lbl}>ADRESSE PRINCIPALE</Text>
        <TextInput style={styles.input} placeholder="12 avenue Montaigne" placeholderTextColor={COLORS.textSecondary} value={address} onChangeText={setAddress} keyboardAppearance="dark" />
        <Text style={styles.lbl}>VILLE &amp; CODE POSTAL</Text>
        <View style={styles.rowInputs}>
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="Paris" placeholderTextColor={COLORS.textSecondary} value={city} onChangeText={setCity} keyboardAppearance="dark" />
          <TextInput style={[styles.input, { width: 90 }]} placeholder="75008" placeholderTextColor={COLORS.textSecondary} value={zip} onChangeText={setZip} keyboardType="numeric" keyboardAppearance="dark" />
        </View>
        <Text style={styles.lbl}>ADRESSE SECONDAIRE (FACULTATIF)</Text>
        <TextInput style={styles.input} placeholder="Hôtel, bureau…" placeholderTextColor={COLORS.textSecondary} value={secondary} onChangeText={setSecondary} keyboardAppearance="dark" />

        <ToggleRow
          label="Utiliser ma géolocalisation"
          subtitle="Pour les réservations rapides"
          value={geoEnabled}
          onToggle={() => setGeoEnabled(!geoEnabled)}
        />

        <Button label="Continuer" onPress={() => navigation.navigate('Signup4')} style={{ marginTop: 10 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ═══════════════════════════════════════════════════════
// STEP 4 — Sécurité
// ═══════════════════════════════════════════════════════
export const Signup4Screen: React.FC<StepProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptNews, setAcceptNews] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValid = password.length >= 8 && password === confirm && acceptTerms;

  const handleCreate = async () => {
    if (!isValid) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    navigation.replace('ClientTabs');
  };

  const passwordRules = [
    { label: '8 caractères minimum', met: password.length >= 8 },
    { label: 'Une majuscule', met: /[A-Z]/.test(password) },
    { label: 'Un chiffre', met: /\d/.test(password) },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.hdr}>
          <View><Text style={styles.logo}>BLADE</Text><Text style={styles.sub}>Inscription</Text></View>
          <Text style={styles.stepNum}>4/4</Text>
        </View>
        <StepIndicator total={4} current={4} />
        <Text style={styles.title}>Sécurité</Text>
        <Text style={styles.stepSubtitle}>Étape 4 — Mot de passe</Text>

        <Text style={styles.lbl}>MOT DE PASSE</Text>
        <TextInput style={styles.input} placeholder="••••••••••" placeholderTextColor={COLORS.textSecondary} value={password} onChangeText={setPassword} secureTextEntry keyboardAppearance="dark" />
        <Text style={styles.lbl}>CONFIRMER</Text>
        <TextInput style={styles.input} placeholder="••••••••••" placeholderTextColor={COLORS.textSecondary} value={confirm} onChangeText={setConfirm} secureTextEntry keyboardAppearance="dark" />

        {/* Password rules */}
        <View style={styles.rulesBox}>
          {passwordRules.map(rule => (
            <Text key={rule.label} style={[styles.rule, rule.met && styles.ruleMet]}>
              {rule.met ? '✓' : '·'}  {rule.label}
            </Text>
          ))}
        </View>

        {/* Terms */}
        <TouchableOpacity style={[styles.choiceCard, acceptTerms && styles.choiceCardActive]} onPress={() => setAcceptTerms(!acceptTerms)} activeOpacity={0.85}>
          <View style={[styles.choiceChk, acceptTerms && styles.choiceChkActive]}>{acceptTerms && <Text style={styles.choiceChkTick}>✓</Text>}</View>
          <Text style={styles.termText}>J'accepte les <Text style={styles.termLink}>CGU</Text> et la <Text style={styles.termLink}>politique de confidentialité</Text></Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.choiceCard, acceptNews && styles.choiceCardActive, { opacity: 0.45 }]} onPress={() => setAcceptNews(!acceptNews)} activeOpacity={0.85}>
          <View style={[styles.choiceChk, acceptNews && styles.choiceChkActive]}>{acceptNews && <Text style={styles.choiceChkTick}>✓</Text>}</View>
          <Text style={styles.termText}>Recevoir les offres et nouveautés</Text>
        </TouchableOpacity>

        <Button label="Créer mon compte  ✦" onPress={handleCreate} loading={loading} disabled={!isValid} style={{ marginTop: 14 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ── Shared Styles ──────────────────────────────────────
const styles = StyleSheet.create({
  container: { paddingHorizontal: SPACING.xl, backgroundColor: COLORS.bg, flexGrow: 1 },
  hdr: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 },
  logo: { fontFamily: FONTS.serif, fontSize: 24, fontWeight: '300', letterSpacing: 2.5, color: COLORS.gold },
  sub: { fontSize: 9, fontFamily: FONTS.sansMedium, letterSpacing: 2, textTransform: 'uppercase', color: COLORS.textSecondary, opacity: 0.5, marginTop: 2 },
  stepNum: { fontSize: 11, fontFamily: FONTS.sansMedium, color: COLORS.textSecondary, opacity: 0.4 },
  title: { fontFamily: FONTS.serif, fontSize: 26, fontWeight: '300', color: COLORS.textPrimary, marginBottom: 4 },
  stepSubtitle: { fontSize: 11, fontFamily: FONTS.sans, color: COLORS.textSecondary, marginBottom: 6 },
  lbl: { fontSize: 9, fontFamily: FONTS.sansMedium, letterSpacing: 1.6, color: COLORS.textPrimary, opacity: 0.32, marginTop: 14, marginBottom: 6 },
  input: { backgroundColor: COLORS.bg3, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 13, fontFamily: FONTS.sansLight, color: COLORS.textPrimary, marginBottom: 2 },
  rowInputs: { flexDirection: 'row', gap: 8 },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 },
  choiceCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.bg3, marginBottom: 8 },
  choiceCardActive: { backgroundColor: COLORS.bg5, borderColor: 'rgba(184,150,62,0.4)' },
  choiceChk: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  choiceChkActive: { backgroundColor: COLORS.bg5, borderColor: 'rgba(184,150,62,0.5)' },
  choiceChkTick: { fontSize: 10, color: COLORS.gold },
  choiceTitle: { fontSize: 13, fontFamily: FONTS.sans, color: COLORS.textSecondary },
  choiceSub: { fontSize: 10, fontFamily: FONTS.sans, color: COLORS.textSecondary, opacity: 0.6, marginTop: 2 },
  rulesBox: { padding: 14, borderRadius: 10, backgroundColor: 'rgba(184,150,62,0.05)', borderWidth: 1, borderColor: 'rgba(184,150,62,0.12)', marginBottom: 14 },
  rule: { fontSize: 11, fontFamily: FONTS.sans, color: COLORS.textSecondary, lineHeight: 20, opacity: 0.45 },
  ruleMet: { color: COLORS.gold, opacity: 0.7 },
  termText: { fontSize: 11, fontFamily: FONTS.sansLight, color: COLORS.textSecondary, flex: 1, lineHeight: 17 },
  termLink: { color: COLORS.gold, fontFamily: FONTS.sansMedium },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 14 },
  loginText: { fontSize: 12, fontFamily: FONTS.sans, color: COLORS.textSecondary },
  loginLink: { fontSize: 12, fontFamily: FONTS.sansMedium, color: COLORS.gold },
});
