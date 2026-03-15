// src/screens/client/SearchScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING } from '../../theme';
import { Card, Badge, Avatar, StarRating, Price, SectionLabel, Tag } from '../../components/UI';

const BARBIERS = [
  { id: '1', name: 'Jean-Marc V.', zone: 'Paris 8e', dist: '3.2 km', rating: 5, reviews: 128, price: '85€', available: true, initials: 'J', tags: ['Hôtel', 'Mariage', 'EVG'] },
  { id: '2', name: 'Rachid B.', zone: 'Paris 16e', dist: '5.1 km', rating: 5, reviews: 94, price: '90€', available: true, initials: 'R', tags: ['Bureau', 'Palace'] },
  { id: '3', name: 'Kévin D.', zone: 'Paris 17e', dist: '7.4 km', rating: 4, reviews: 67, price: '75€', available: false, initials: 'K', tags: ['Particulier'] },
];

const FILTERS = ['Tous', 'Hôtel 5*', 'Mariage', 'Aéroport', 'Bureau', 'Dispo'];

interface Props { navigation: any; }

const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tous');

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16, paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hdr}>
          <Text style={styles.logo}>BLADE</Text>
          <Text style={styles.sub}>Recherche</Text>
        </View>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>◎</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Barbier, zone, prestation…"
            placeholderTextColor={COLORS.textSecondary}
            value={query}
            onChangeText={setQuery}
            keyboardAppearance="dark"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Text style={{ color: COLORS.textSecondary, fontSize: 14 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              onPress={() => setActiveFilter(f)}
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.resultsMeta}>
          <Text style={styles.resultsCount}>{BARBIERS.length} barbiers trouvés</Text>
          <TouchableOpacity><Text style={styles.sortBtn}>Trier ↕</Text></TouchableOpacity>
        </View>

        {BARBIERS.map(barber => (
          <Card key={barber.id} onPress={() => navigation.navigate('BarberProfile', { barber })}>
            <View style={styles.barberRow}>
              <Avatar initials={barber.initials} size={42} />
              <View style={{ flex: 1 }}>
                <Text style={styles.barberName}>{barber.name}</Text>
                <Text style={styles.barberMeta}>{barber.zone} · {barber.dist}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <StarRating rating={barber.rating} size={11} />
                  <Text style={styles.reviewCount}>({barber.reviews})</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 5 }}>
                <Price value={barber.price} size={18} />
                <Badge label={barber.available ? 'Dispo' : 'Occupé'} variant={barber.available ? 'green' : 'default'} />
              </View>
            </View>
            {barber.tags && (
              <View style={styles.tagRow}>
                {barber.tags.map(t => <Tag key={t} label={t} active small />)}
              </View>
            )}
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

// ═══════════════════════════════════════════════════════
// BARBER PROFILE SCREEN
// ═══════════════════════════════════════════════════════
export const BarberProfileScreen: React.FC<Props> = ({ navigation, route }: any) => {
  const insets = useSafeAreaInsets();
  const barber = route?.params?.barber || { name: 'Jean-Marc Villeneuve', initials: 'J' };

  const SERVICES = [
    { name: 'Coupe + Barbe', duration: '45 min', price: '85€' },
    { name: 'Coupe seule', duration: '30 min', price: '55€' },
    { name: 'Barbe seule', duration: '30 min', price: '40€' },
    { name: 'Rasage traditionnel', duration: '30 min', price: '45€' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover */}
        <View style={[bpStyles.cover, { paddingTop: insets.top }]}>
          <TouchableOpacity style={bpStyles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={bpStyles.backText}>←</Text>
          </TouchableOpacity>
          <Badge label="★ 4.9" variant="gold" style={{ alignSelf: 'flex-end' }} />
        </View>

        <View style={{ paddingHorizontal: SPACING.xl }}>
          {/* Profile info */}
          <View style={bpStyles.profileRow}>
            <Avatar initials={barber.initials || 'J'} size={60} style={{ marginTop: -22, borderWidth: 2, borderColor: COLORS.bg }} />
            <View style={{ marginTop: 8, flex: 1, marginLeft: 12 }}>
              <Text style={bpStyles.name}>{barber.name || 'Jean-Marc Villeneuve'}</Text>
              <Text style={bpStyles.meta}>Barbier certifié · 8 ans · Paris</Text>
              <Badge label="Disponible" variant="green" style={{ alignSelf: 'flex-start', marginTop: 4 }} />
            </View>
          </View>

          {/* Stats */}
          <View style={bpStyles.statsRow}>
            {[['128', 'Clients'], ['4.9', 'Note'], ['8', 'Ans exp.']].map(([val, lbl]) => (
              <View key={lbl} style={bpStyles.statCard}>
                <Text style={bpStyles.statVal}>{val}</Text>
                <Text style={bpStyles.statLbl}>{lbl}</Text>
              </View>
            ))}
          </View>

          {/* Specialities */}
          <SectionLabel label="Spécialités" />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {['Coupe', 'Barbe', 'Mariage', 'Afro', 'Dégradé'].map(s => (
              <Tag key={s} label={s} active />
            ))}
          </View>

          {/* Services */}
          <SectionLabel label="Prestations" />
          {SERVICES.map((svc, i) => (
            <View key={i} style={bpStyles.svcRow}>
              <View>
                <Text style={bpStyles.svcName}>{svc.name}</Text>
                <Text style={bpStyles.svcDur}>{svc.duration}</Text>
              </View>
              <Price value={svc.price} size={17} />
            </View>
          ))}

          {/* CTA */}
          <TouchableOpacity
            style={bpStyles.ctaBtn}
            onPress={() => navigation.navigate('Booking', { barber })}
            activeOpacity={0.85}
          >
            <Text style={bpStyles.ctaBtnText}>Réserver ce barbier</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const bpStyles = StyleSheet.create({
  cover: {
    height: 110,
    backgroundColor: '#1a1508',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.xl,
    paddingBottom: 12,
    justifyContent: 'space-between',
  },
  backBtn: { padding: 4 },
  backText: { fontSize: 20, color: COLORS.gold },
  profileRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: SPACING.lg },
  name: { fontSize: 15, fontFamily: FONTS.sans, color: COLORS.textPrimary },
  meta: { fontSize: 10, color: COLORS.textSecondary, opacity: 0.7, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  statCard: { flex: 1, backgroundColor: COLORS.bg3, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, padding: 12, alignItems: 'center' },
  statVal: { fontFamily: FONTS.serif, fontSize: 22, fontWeight: '300', color: COLORS.gold },
  statLbl: { fontSize: 9, fontFamily: FONTS.sansMedium, letterSpacing: 1, textTransform: 'uppercase', color: COLORS.textSecondary, opacity: 0.5, marginTop: 3 },
  svcRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  svcName: { fontSize: 12, fontFamily: FONTS.sans, color: COLORS.textPrimary },
  svcDur: { fontSize: 10, color: COLORS.textSecondary, marginTop: 2 },
  ctaBtn: { backgroundColor: COLORS.gold, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: SPACING.xl },
  ctaBtnText: { fontSize: 11, fontFamily: FONTS.sansMedium, letterSpacing: 1.2, textTransform: 'uppercase', color: COLORS.bg },
});

// ─── Shared styles ───────────────────────────────────────
const styles = StyleSheet.create({
  scroll: { paddingHorizontal: SPACING.xl },
  hdr: { marginBottom: 16 },
  logo: { fontFamily: FONTS.serif, fontSize: 26, fontWeight: '300', letterSpacing: 2.5, color: COLORS.gold },
  sub: { fontSize: 9, fontFamily: FONTS.sansMedium, letterSpacing: 2, textTransform: 'uppercase', color: COLORS.textSecondary, opacity: 0.5, marginTop: 2 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.bg3, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 14, paddingVertical: 11, marginBottom: 12 },
  searchIcon: { fontSize: 14, color: COLORS.textSecondary, opacity: 0.5 },
  searchInput: { flex: 1, fontSize: 12, fontFamily: FONTS.sansLight, color: COLORS.textPrimary, letterSpacing: 0.2 },
  filterRow: { marginBottom: 14 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginRight: 7 },
  filterChipActive: { borderColor: 'rgba(184,150,62,0.55)', backgroundColor: 'rgba(184,150,62,0.06)' },
  filterText: { fontSize: 10, fontFamily: FONTS.sans, color: COLORS.textSecondary, letterSpacing: 0.3 },
  filterTextActive: { color: COLORS.gold },
  resultsMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  resultsCount: { fontSize: 10, color: COLORS.textSecondary, opacity: 0.5 },
  sortBtn: { fontSize: 10, fontFamily: FONTS.sansMedium, color: COLORS.gold },
  barberRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  barberName: { fontSize: 13, fontFamily: FONTS.sans, color: COLORS.textPrimary, marginBottom: 2 },
  barberMeta: { fontSize: 10, color: COLORS.textSecondary, opacity: 0.6, marginBottom: 3 },
  reviewCount: { fontSize: 9, color: COLORS.textSecondary, opacity: 0.5 },
  tagRow: { flexDirection: 'row', gap: 5, marginTop: 9, flexWrap: 'wrap' },
});

export default SearchScreen;
