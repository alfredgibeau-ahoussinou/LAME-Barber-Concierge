// src/screens/shared/NotificationsScreen.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING } from '../../theme';
import { SectionLabel } from '../../components/UI';

const NOTIFS = [
  { group: "Aujourd'hui", items: [
    { title: 'Jean-Marc est en route', body: 'Votre barbier arrive dans 28 min. Tracking activé.', time: 'Il y a 5 min', read: false },
    { title: 'Paiement confirmé', body: '85€ débités — Coupe + Barbe · Lundi 16 mars.', time: 'Il y a 2h', read: false },
    { title: 'Réservation acceptée', body: 'Jean-Marc V. a validé votre mission du 16 mars.', time: 'Il y a 3h', read: false },
  ]},
  { group: 'Cette semaine', items: [
    { title: 'Rappel RDV demain', body: "N'oubliez pas votre RDV lundi 16 mars à 11h30.", time: 'Hier', read: true },
    { title: 'Nouveau barbier disponible', body: 'Kévin D. est disponible dans votre zone.', time: 'Lun. 10 mars', read: true },
    { title: 'Laissez votre avis', body: 'Comment s\'est passée votre prestation du 8 mars ?', time: 'Sam. 8 mars', read: true },
  ]},
];

interface Props { navigation: any; }

const NotificationsScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16, paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hdr}>
          <View style={{ flex: 1 }}><Text style={styles.logo}>BLADE</Text><Text style={styles.sub}>Notifications</Text></View>
          <TouchableOpacity><Text style={{ fontSize: 11, color: COLORS.gold, fontFamily: FONTS.sansMedium }}>Tout lire</Text></TouchableOpacity>
        </View>
        {NOTIFS.map(group => (
          <View key={group.group}>
            <SectionLabel label={group.group} />
            {group.items.map((notif, i) => (
              <View key={i} style={[styles.notifItem, notif.read && { opacity: 0.45 }]}>
                <View style={[styles.notifDot, notif.read ? styles.notifDotRead : styles.notifDotUnread]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.notifTitle}>{notif.title}</Text>
                  <Text style={styles.notifBody}>{notif.body}</Text>
                  <Text style={styles.notifTime}>{notif.time}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// ═══════════════════════════════════════════════════════
// PROFILE SCREEN
// ═══════════════════════════════════════════════════════
export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const STATS = [['12', 'Prestations'], ['4.9', 'Note moy.'], ['980€', 'Dépenses'], ['8', 'Avis laissés']];
  const MENU = [
    { icon: '⚙', label: 'Paramètres', screen: 'Settings' },
    { icon: '◈', label: 'Notifications', screen: 'Notifications' },
    { icon: '☰', label: 'Historique', screen: 'History' },
    { icon: '?', label: 'Support & Aide', screen: 'Support' },
  ];
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16, paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.profileHdr}>
          <View style={styles.avatarCircle}><Text style={styles.avatarText}>A</Text></View>
          <View>
            <Text style={styles.profileName}>Alexandre Martin</Text>
            <Text style={styles.profileSub}>Membre Gold</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          {STATS.map(([val, lbl]) => (
            <View key={lbl} style={styles.statCard}>
              <Text style={styles.statVal}>{val}</Text>
              <Text style={styles.statLbl}>{lbl}</Text>
            </View>
          ))}
        </View>

        {/* Loyalty */}
        <SectionLabel label="Fidélité Gold" />
        <View style={styles.loyaltyCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.loyaltyPts}>980 pts</Text>
            <Text style={styles.loyaltyTarget}>Platinum à 1300 pts</Text>
          </View>
          <View style={styles.progBar}><View style={[styles.progFill, { width: '75%' }]} /></View>
        </View>

        {/* Menu */}
        <SectionLabel label="Compte" />
        {MENU.map(item => (
          <TouchableOpacity
            key={item.label}
            style={styles.menuRow}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.75}
          >
            <View style={styles.menuIcon}><Text style={styles.menuIconText}>{item.icon}</Text></View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// ═══════════════════════════════════════════════════════
// SETTINGS SCREEN
// ═══════════════════════════════════════════════════════
export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [pushEnabled, setPush] = React.useState(true);
  const [trackEnabled, setTrack] = React.useState(true);
  const [smsEnabled, setSms] = React.useState(true);
  const [emailEnabled, setEmail] = React.useState(false);

  const ACCOUNT_ROWS = [
    { icon: '◎', label: 'Modifier le profil', sub: 'Nom, email, téléphone' },
    { icon: '🔒', label: 'Mot de passe', sub: 'Modifier le mot de passe' },
    { icon: '💳', label: 'Paiement', sub: 'Visa •••• 4242' },
    { icon: '📍', label: 'Adresses', sub: 'Gérer mes adresses' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16, paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hdr}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
            <Text style={{ fontSize: 18, color: COLORS.gold }}>←</Text>
          </TouchableOpacity>
          <View><Text style={styles.logo}>BLADE</Text><Text style={styles.sub}>Paramètres</Text></View>
        </View>

        <SectionLabel label="Compte" />
        {ACCOUNT_ROWS.map(row => (
          <TouchableOpacity key={row.label} style={styles.settingRow} activeOpacity={0.75}>
            <View style={styles.settingIcon}><Text style={styles.settingIconText}>{row.icon}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>{row.label}</Text>
              <Text style={styles.settingSub}>{row.sub}</Text>
            </View>
            <Text style={styles.settingArr}>›</Text>
          </TouchableOpacity>
        ))}

        <SectionLabel label="Notifications" />
        {[
          { label: 'Notifications push', val: pushEnabled, set: setPush },
          { label: 'Tracking activé', val: trackEnabled, set: setTrack },
          { label: 'SMS de rappel', val: smsEnabled, set: setSms },
          { label: 'Emails promotionnels', val: emailEnabled, set: setEmail },
        ].map(({ label, val, set }) => (
          <TouchableOpacity
            key={label}
            style={[styles.tglRow, !val && { opacity: 0.45 }]}
            onPress={() => set(!val)}
            activeOpacity={0.85}
          >
            <Text style={styles.tglLabel}>{label}</Text>
            <View style={[styles.tglTrack, val && styles.tglTrackOn]}>
              <View style={[styles.tglThumb, val && styles.tglThumbOn]} />
            </View>
          </TouchableOpacity>
        ))}

        <SectionLabel label="Application" />
        <TouchableOpacity style={styles.settingRow} activeOpacity={0.75}>
          <View style={styles.settingIcon}><Text style={styles.settingIconText}>🌐</Text></View>
          <Text style={[styles.settingLabel, { flex: 1 }]}>Langue</Text>
          <Text style={{ fontSize: 11, color: COLORS.gold }}>Français ›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingRow} activeOpacity={0.75}>
          <View style={styles.settingIcon}><Text style={styles.settingIconText}>🌙</Text></View>
          <Text style={[styles.settingLabel, { flex: 1 }]}>Thème</Text>
          <Text style={{ fontSize: 11, color: COLORS.gold }}>Sombre ›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.settingRow, { opacity: 0.4 }]} activeOpacity={0.75}>
          <View style={styles.settingIcon}><Text style={styles.settingIconText}>🚪</Text></View>
          <Text style={[styles.settingLabel, { color: COLORS.danger }]}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// ═══════════════════════════════════════════════════════
// SUPPORT SCREEN
// ═══════════════════════════════════════════════════════
export const SupportScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  const CHANNELS = [
    { icon: '✉', label: 'Email', sub: 'Réponse 2h' },
    { icon: '◎', label: 'Chat live', sub: 'Disponible' },
    { icon: '☎', label: 'Téléphone', sub: '9h–19h' },
  ];

  const FAQS = [
    { q: 'Comment fonctionne le tracking ?', a: 'Le barbier partage sa position uniquement 30 min avant le RDV, pour protéger sa vie privée.' },
    { q: 'Puis-je annuler ma réservation ?', a: 'Oui, vous pouvez annuler jusqu\'à 2h avant le RDV pour un remboursement intégral.' },
    { q: 'Comment devenir barbier BLADE ?', a: 'Remplissez le formulaire d\'inscription Barbier Pro et notre équipe vous contactera sous 24h.' },
    { q: 'Quelles zones sont couvertes ?', a: 'Actuellement Paris et l\'Île-de-France. D\'autres villes arrivent bientôt.' },
    { q: 'Remboursement et litiges', a: 'Contactez notre support. Toute réclamation est traitée sous 48h.' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16, paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hdr}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
            <Text style={{ fontSize: 18, color: COLORS.gold }}>←</Text>
          </TouchableOpacity>
          <View><Text style={styles.logo}>BLADE</Text><Text style={styles.sub}>Support & Aide</Text></View>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Text style={{ fontSize: 13, color: COLORS.textSecondary, opacity: 0.5, marginRight: 8 }}>◎</Text>
          <Text style={{ fontSize: 12, fontFamily: FONTS.sansLight, color: COLORS.textSecondary }}>Chercher une aide…</Text>
        </View>

        {/* Channels */}
        <SectionLabel label="Contacter l'équipe" />
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
          {CHANNELS.map(ch => (
            <TouchableOpacity key={ch.label} style={styles.channelCard} activeOpacity={0.85}>
              <Text style={styles.channelIcon}>{ch.icon}</Text>
              <Text style={styles.channelLabel}>{ch.label}</Text>
              <Text style={styles.channelSub}>{ch.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQ */}
        <SectionLabel label="Questions fréquentes" />
        {FAQS.map((faq, i) => (
          <TouchableOpacity
            key={i}
            style={styles.faqItem}
            onPress={() => setOpenFaq(openFaq === i ? null : i)}
            activeOpacity={0.85}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.faqQ}>{faq.q}</Text>
              <Text style={[styles.faqArrow, openFaq === i && { color: COLORS.gold }]}>
                {openFaq === i ? '∧' : '∨'}
              </Text>
            </View>
            {openFaq === i && <Text style={styles.faqA}>{faq.a}</Text>}
          </TouchableOpacity>
        ))}

        <Text style={{ fontSize: 10, color: COLORS.textSecondary, opacity: 0.22, textAlign: 'center', marginTop: 24 }}>
          BLADE v1.0.0 — Barber Concierge
        </Text>
      </ScrollView>
    </View>
  );
};

// ─── Shared styles ──────────────────────────────────────
const styles = StyleSheet.create({
  scroll: { paddingHorizontal: SPACING.xl },
  hdr: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 },
  logo: { fontFamily: FONTS.serif, fontSize: 26, fontWeight: '300', letterSpacing: 2.5, color: COLORS.gold },
  sub: { fontSize: 9, fontFamily: FONTS.sansMedium, letterSpacing: 2, textTransform: 'uppercase', color: COLORS.textSecondary, opacity: 0.5, marginTop: 2 },
  notifItem: { flexDirection: 'row', gap: 10, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  notifDot: { width: 7, height: 7, borderRadius: 4, marginTop: 5, flexShrink: 0 },
  notifDotUnread: { backgroundColor: COLORS.gold },
  notifDotRead: { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  notifTitle: { fontSize: 12, fontFamily: FONTS.sans, color: COLORS.textPrimary, marginBottom: 3 },
  notifBody: { fontSize: 11, fontFamily: FONTS.sansLight, color: COLORS.textPrimary, opacity: 0.35, lineHeight: 17 },
  notifTime: { fontSize: 9, color: COLORS.textSecondary, marginTop: 4, opacity: 0.5 },
  profileHdr: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  avatarCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.bg5, borderWidth: 1, borderColor: 'rgba(184,150,62,0.25)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: FONTS.serif, fontSize: 20, color: COLORS.gold },
  profileName: { fontSize: 15, fontFamily: FONTS.sans, color: COLORS.textPrimary },
  profileSub: { fontSize: 10, color: COLORS.textSecondary, opacity: 0.5, marginTop: 2 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  statCard: { width: '48%', backgroundColor: COLORS.bg3, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, padding: 12 },
  statVal: { fontFamily: FONTS.serif, fontSize: 24, fontWeight: '300', color: COLORS.gold },
  statLbl: { fontSize: 9, fontFamily: FONTS.sansMedium, letterSpacing: 1, textTransform: 'uppercase', color: COLORS.textSecondary, opacity: 0.5, marginTop: 3 },
  loyaltyCard: { backgroundColor: COLORS.bg3, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 14, marginBottom: 4 },
  loyaltyPts: { fontSize: 12, fontFamily: FONTS.sans, color: COLORS.textPrimary },
  loyaltyTarget: { fontSize: 10, color: COLORS.textSecondary, opacity: 0.45 },
  progBar: { height: 2, borderRadius: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginTop: 8, overflow: 'hidden' },
  progFill: { height: '100%', backgroundColor: COLORS.gold, borderRadius: 1 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  menuIcon: { width: 34, height: 34, borderRadius: 9, backgroundColor: COLORS.bg4, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  menuIconText: { fontSize: 15 },
  menuLabel: { flex: 1, fontSize: 12, fontFamily: FONTS.sans, color: COLORS.textPrimary },
  menuArrow: { fontSize: 16, color: COLORS.textSecondary, opacity: 0.22 },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  settingIcon: { width: 34, height: 34, borderRadius: 9, backgroundColor: COLORS.bg4, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  settingIconText: { fontSize: 15 },
  settingLabel: { fontSize: 12, fontFamily: FONTS.sans, color: COLORS.textPrimary },
  settingSub: { fontSize: 10, color: COLORS.textSecondary, opacity: 0.5, marginTop: 2 },
  settingArr: { fontSize: 16, color: COLORS.textSecondary, opacity: 0.22, marginLeft: 'auto' },
  tglRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.bg3, marginBottom: 7 },
  tglLabel: { fontSize: 12, fontFamily: FONTS.sans, color: COLORS.textPrimary },
  tglTrack: { width: 32, height: 17, borderRadius: 9, backgroundColor: '#2a2a2a', justifyContent: 'center', paddingHorizontal: 2 },
  tglTrackOn: { backgroundColor: COLORS.gold },
  tglThumb: { width: 13, height: 13, borderRadius: 7, backgroundColor: COLORS.white, alignSelf: 'flex-start' },
  tglThumbOn: { alignSelf: 'flex-end' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bg3, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 14, paddingVertical: 11, marginBottom: 12 },
  channelCard: { flex: 1, backgroundColor: COLORS.bg3, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', paddingVertical: 12 },
  channelIcon: { fontSize: 20, color: COLORS.textPrimary, marginBottom: 5 },
  channelLabel: { fontSize: 11, fontFamily: FONTS.sans, color: COLORS.textPrimary },
  channelSub: { fontSize: 9, color: COLORS.textSecondary, opacity: 0.5, marginTop: 3 },
  faqItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  faqQ: { fontSize: 12, fontFamily: FONTS.sans, color: COLORS.textPrimary, flex: 1, lineHeight: 18 },
  faqArrow: { fontSize: 14, color: COLORS.textSecondary, opacity: 0.4, marginLeft: 10 },
  faqA: { fontSize: 11, fontFamily: FONTS.sansLight, color: COLORS.textPrimary, opacity: 0.38, lineHeight: 18, marginTop: 8 },
});

export default NotificationsScreen;
