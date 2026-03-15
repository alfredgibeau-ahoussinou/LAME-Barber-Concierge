// src/screens/barber/BarberDashboardScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS } from '../../theme';
import { Card, Badge, SectionLabel, ToggleRow } from '../../components/UI';

interface Props { navigation: any; }

const BarberDashboardScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [available, setAvailable] = useState(true);
  const [sharing, setSharing] = useState(false);

  const STATS = [['7', 'RDV / mois'], ['4.9', 'Note'], ['595€', 'Revenus'], ['128', 'Clients']];

  const ZONES = [
    { label: 'Paris 1er – 8e', active: true },
    { label: 'Hôtels 5* Île-de-France', active: true },
    { label: 'Aéroport CDG', active: false },
  ];

  const MISSIONS = [
    { client: 'Alexandre M.', price: '85€', date: 'Lun. 16 mars', time: '11h30', place: 'Hôtel George V', pending: true },
    { client: 'Sophie L.', price: '90€', date: 'Mar. 17 mars', time: '14:00', place: 'Particulier', pending: false },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16, paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hdr, { justifyContent: 'space-between' }]}>
          <View><Text style={styles.logo}>BLADE</Text><Text style={styles.sub}>Espace Barbier Pro</Text></View>
          <Badge label="PRO" variant="gold" />
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

        {/* Zones */}
        <SectionLabel label="Zones d'intervention" />
        {ZONES.map((zone, i) => (
          <View key={i} style={[styles.zoneRow, !zone.active && { opacity: 0.35 }]}>
            <View style={[styles.zoneDot, zone.active && styles.zoneDotActive]} />
            <Text style={[styles.zoneLabel, !zone.active && { color: COLORS.textSecondary }]}>{zone.label}</Text>
            <Text style={zone.active ? styles.zoneStatus : styles.zoneStatusOff}>
              {zone.active ? 'Actif' : 'Inactif'}
            </Text>
          </View>
        ))}
        <TouchableOpacity style={styles.addZone}>
          <Text style={styles.addZoneText}>+ Ajouter une zone</Text>
        </TouchableOpacity>

        {/* Missions */}
        <SectionLabel label="Missions à venir" />
        {MISSIONS.map((mission, i) => (
          <Card key={i}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={styles.missionClient}>{mission.client}</Text>
              <Text style={styles.missionPrice}>{mission.price}</Text>
            </View>
            <Text style={styles.missionMeta}>{mission.date} · {mission.time} · {mission.place}</Text>
            {mission.pending && (
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                <TouchableOpacity style={styles.validateBtn}>
                  <Text style={styles.validateBtnText}>Valider</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.refuseBtn}>
                  <Text style={styles.refuseBtnText}>Refuser</Text>
                </TouchableOpacity>
              </View>
            )}
          </Card>
        ))}

        {/* Availability */}
        <SectionLabel label="Disponibilité" />
        <ToggleRow label="Je suis disponible" value={available} onToggle={() => setAvailable(!available)} />
        <View style={{ opacity: 0.35 }}>
          <ToggleRow label="Partager ma position" subtitle="Uniquement activé 30 min avant le RDV" value={sharing} onToggle={() => setSharing(!sharing)} />
        </View>
      </ScrollView>
    </View>
  );
};

// ═══════════════════════════════════════════════════════
// ADMIN DASHBOARD SCREEN
// ═══════════════════════════════════════════════════════
export const AdminDashboardScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState(0);

  const STATS = [['247', 'Clients'], ['18', 'Barbiers'], ['12.4k€', 'CA / mois'], ['4.8', 'Note moy.']];
  const BAR_DATA = [35, 55, 42, 70, 88, 60, 78];
  const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const ACTIVITIES = [
    { label: 'Nouvelle réservation', meta: 'Alexandre M. → Jean-Marc V. · Il y a 5 min', badge: '+85€', badgeType: 'green' as const },
    { label: 'Nouveau barbier inscrit', meta: 'Thomas R. · Paris 18e · Il y a 1h', badge: 'PRO', badgeType: 'gold' as const },
    { label: 'Litige signalé', meta: 'Client #1042 · À traiter', badge: '!', badgeType: 'red' as const },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16, paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hdr, { justifyContent: 'space-between' }]}>
          <View><Text style={styles.logo}>BLADE</Text><Text style={styles.sub}>Tableau de bord Admin</Text></View>
          <Badge label="ADMIN" variant="red" />
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

        {/* Tabs */}
        <View style={styles.adminTabs}>
          {['Vue générale', 'Utilisateurs', 'Finances'].map((tab, i) => (
            <TouchableOpacity
              key={tab}
              style={[styles.adminTab, activeTab === i && styles.adminTabActive]}
              onPress={() => setActiveTab(i)}
            >
              <Text style={[styles.adminTabText, activeTab === i && styles.adminTabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chart */}
        <SectionLabel label="Réservations — 7 derniers jours" />
        <View style={styles.chartContainer}>
          <View style={styles.chartBars}>
            {BAR_DATA.map((h, i) => (
              <View key={i} style={styles.barWrap}>
                <View style={[styles.bar, { height: `${h}%` }, i === 4 && styles.barHighlight]} />
              </View>
            ))}
          </View>
          <View style={styles.chartLabels}>
            {DAYS.map(d => <Text key={d} style={styles.chartLabel}>{d}</Text>)}
          </View>
        </View>

        {/* Recent activity */}
        <SectionLabel label="Dernières activités" />
        {ACTIVITIES.map((act, i) => (
          <Card key={i} style={{ marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={styles.actLabel}>{act.label}</Text>
              <Badge label={act.badge} variant={act.badgeType} />
            </View>
            <Text style={styles.actMeta}>{act.meta}</Text>
          </Card>
        ))}

        {/* Quick actions */}
        <SectionLabel label="Gestion rapide" />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {['Barbiers', 'Clients', 'Litiges'].map((action, i) => (
            <TouchableOpacity
              key={action}
              style={[styles.quickBtn, i === 0 && styles.quickBtnPrimary]}
            >
              <Text style={[styles.quickBtnText, i === 0 && styles.quickBtnTextPrimary]}>{action}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: SPACING.xl },
  hdr: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 16 },
  logo: { fontFamily: FONTS.serif, fontSize: 26, fontWeight: '300', letterSpacing: 2.5, color: COLORS.gold },
  sub: { fontSize: 9, fontFamily: FONTS.sansMedium, letterSpacing: 2, textTransform: 'uppercase', color: COLORS.textSecondary, opacity: 0.5, marginTop: 2 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  statCard: { width: '48%', backgroundColor: COLORS.bg3, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, padding: 12 },
  statVal: { fontFamily: FONTS.serif, fontSize: 24, fontWeight: '300', color: COLORS.gold },
  statLbl: { fontSize: 9, fontFamily: FONTS.sansMedium, letterSpacing: 1, textTransform: 'uppercase', color: COLORS.textSecondary, opacity: 0.5, marginTop: 3 },
  zoneRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9, paddingHorizontal: 13, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.bg3, marginBottom: 6 },
  zoneDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#555' },
  zoneDotActive: { backgroundColor: COLORS.gold },
  zoneLabel: { flex: 1, fontSize: 12, fontFamily: FONTS.sans, color: COLORS.textPrimary },
  zoneStatus: { fontSize: 9, color: COLORS.success, fontFamily: FONTS.sansMedium },
  zoneStatusOff: { fontSize: 9, color: COLORS.textSecondary },
  addZone: { marginBottom: 4, marginTop: 2 },
  addZoneText: { fontSize: 10, color: COLORS.gold, opacity: 0.5, fontFamily: FONTS.sansMedium },
  missionClient: { fontSize: 12, fontFamily: FONTS.sans, color: COLORS.textPrimary },
  missionPrice: { fontFamily: FONTS.serif, fontSize: 16, fontWeight: '300', color: COLORS.gold },
  missionMeta: { fontSize: 10, color: COLORS.textSecondary, opacity: 0.6 },
  validateBtn: { flex: 1, backgroundColor: COLORS.gold, borderRadius: 10, paddingVertical: 8, alignItems: 'center' },
  validateBtnText: { fontSize: 10, fontFamily: FONTS.sansMedium, letterSpacing: 0.8, color: COLORS.bg },
  refuseBtn: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingVertical: 8, alignItems: 'center' },
  refuseBtnText: { fontSize: 10, fontFamily: FONTS.sans, color: COLORS.textSecondary },
  adminTabs: { flexDirection: 'row', borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border, marginBottom: 4 },
  adminTab: { flex: 1, paddingVertical: 8, alignItems: 'center', backgroundColor: COLORS.bg3 },
  adminTabActive: { backgroundColor: COLORS.bg5 },
  adminTabText: { fontSize: 10, fontFamily: FONTS.sansMedium, letterSpacing: 0.5, color: COLORS.textSecondary },
  adminTabTextActive: { color: COLORS.gold },
  chartContainer: { backgroundColor: COLORS.bg3, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 14, marginBottom: 4 },
  chartBars: { flexDirection: 'row', alignItems: 'flex-end', height: 60, gap: 5, marginBottom: 8 },
  barWrap: { flex: 1, height: '100%', justifyContent: 'flex-end' },
  bar: { borderRadius: 2, backgroundColor: 'rgba(184,150,62,0.2)', width: '100%' },
  barHighlight: { backgroundColor: COLORS.gold },
  chartLabels: { flexDirection: 'row', gap: 5 },
  chartLabel: { flex: 1, textAlign: 'center', fontSize: 8, color: COLORS.textSecondary, opacity: 0.4 },
  actLabel: { fontSize: 12, fontFamily: FONTS.sans, color: COLORS.textPrimary },
  actMeta: { fontSize: 10, color: COLORS.textSecondary, opacity: 0.5 },
  quickBtn: { flex: 1, borderWidth: 1, borderColor: 'rgba(184,150,62,0.3)', borderRadius: 10, paddingVertical: 9, alignItems: 'center' },
  quickBtnPrimary: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  quickBtnText: { fontSize: 10, fontFamily: FONTS.sansMedium, color: COLORS.gold },
  quickBtnTextPrimary: { color: COLORS.bg },
});

export default BarberDashboardScreen;
