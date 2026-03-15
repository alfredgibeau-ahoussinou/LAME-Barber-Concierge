// src/screens/client/HomeScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS } from '../../theme';
import { Card, Badge, Avatar, Tag, StarRating, Price, LiveIndicator, Divider, SectionLabel } from '../../components/UI';

const BARBIERS = [
  { id: '1', name: 'Jean-Marc V.', zone: 'Paris 8e', dist: '3.2 km', rating: 5, reviews: 128, price: '85€', available: true, initials: 'J' },
  { id: '2', name: 'Rachid B.', zone: 'Paris 16e', dist: '5.1 km', rating: 5, reviews: 94, price: '90€', available: true, initials: 'R' },
  { id: '3', name: 'Kévin D.', zone: 'Paris 17e', dist: '7.4 km', rating: 4, reviews: 67, price: '75€', available: false, initials: 'K' },
];

const CONTEXTS = ['Hôtel', 'Palace', 'Mariage', 'EVG', 'Aéroport', 'Bureau'];

interface Props { navigation: any; }

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [activeContext, setActiveContext] = useState('Hôtel');

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16, paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
        bounces
      >
        {/* Header */}
        <View style={styles.hdr}>
          <View>
            <Text style={styles.logo}>BLADE</Text>
            <Text style={styles.sub}>Bonjour, Alexandre</Text>
          </View>
          <View style={styles.hdrRight}>
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.notifBtn}>
              <Text style={styles.notifIcon}>◎</Text>
              <View style={styles.notifBadge} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Avatar initials="A" size={38} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Next RDV */}
        <SectionLabel label="Prochain rendez-vous" />
        <Card gold onPress={() => navigation.navigate('Tracking')}>
          <View style={styles.rdvRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rdvService}>Coupe + Barbe</Text>
              <Text style={styles.rdvMeta}>Jean-Marc V. · Lun. 16 mars · 11h30</Text>
              <Text style={styles.rdvLoc}>Hôtel George V, Suite 412</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Price value="85€" size={22} />
              <LiveIndicator label="Confirmé" />
            </View>
          </View>
          <TouchableOpacity
            style={styles.trackBtn}
            onPress={() => navigation.navigate('Tracking')}
            activeOpacity={0.85}
          >
            <Text style={styles.trackBtnText}>Suivre mon barbier</Text>
          </TouchableOpacity>
        </Card>

        {/* Contexts */}
        <SectionLabel label="Contexte" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ctxRow}>
          {CONTEXTS.map(ctx => (
            <Tag
              key={ctx}
              label={ctx}
              active={activeContext === ctx}
              onPress={() => setActiveContext(ctx)}
            />
          ))}
        </ScrollView>

        {/* Available barbers */}
        <SectionLabel label="Barbiers disponibles" style={{ marginTop: 6 }} />
        {BARBIERS.map(barber => (
          <Card key={barber.id} onPress={() => navigation.navigate('BarberProfile', { barber })}>
            <View style={styles.barberRow}>
              <Avatar initials={barber.initials} size={42} />
              <View style={{ flex: 1 }}>
                <Text style={styles.barberName}>{barber.name}</Text>
                <Text style={styles.barberMeta}>{barber.zone} · {barber.dist}</Text>
                <StarRating rating={barber.rating} />
              </View>
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <Price value={barber.price} size={18} />
                {barber.available
                  ? <Badge label="Dispo" variant="green" />
                  : <Badge label="Occupé" variant="default" />
                }
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: SPACING.xl },
  hdr: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 4 },
  logo: { fontFamily: FONTS.serif, fontSize: 26, fontWeight: '300', letterSpacing: 2.5, color: COLORS.gold },
  sub: { fontSize: 9, fontFamily: FONTS.sansMedium, letterSpacing: 2, textTransform: 'uppercase', color: COLORS.textSecondary, opacity: 0.5, marginTop: 2 },
  hdrRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  notifBtn: { position: 'relative' },
  notifIcon: { fontSize: 20, color: COLORS.textSecondary, opacity: 0.45 },
  notifBadge: { position: 'absolute', top: 0, right: -1, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.gold, borderWidth: 1.5, borderColor: COLORS.bg },
  rdvRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  rdvService: { fontSize: 13, fontFamily: FONTS.sans, color: COLORS.textPrimary, marginBottom: 3 },
  rdvMeta: { fontSize: 11, fontFamily: FONTS.sansLight, color: COLORS.textPrimary, opacity: 0.38, marginBottom: 2 },
  rdvLoc: { fontSize: 10, fontFamily: FONTS.sans, color: COLORS.textPrimary, opacity: 0.28 },
  trackBtn: { marginTop: 12, backgroundColor: COLORS.gold, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  trackBtnText: { fontSize: 10, fontFamily: FONTS.sansMedium, color: COLORS.bg, letterSpacing: 1 },
  ctxRow: { marginBottom: 4 },
  barberRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  barberName: { fontSize: 13, fontFamily: FONTS.sans, color: COLORS.textPrimary, marginBottom: 2 },
  barberMeta: { fontSize: 10, color: COLORS.textSecondary, opacity: 0.7, marginBottom: 3 },
});

export default HomeScreen;
