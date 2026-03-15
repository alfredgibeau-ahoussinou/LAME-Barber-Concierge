// src/screens/client/BookingScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS } from '../../theme';
import { Card, Avatar, StarRating, Price, SectionLabel, Divider, Button, InputField } from '../../components/UI';

const SERVICES = [
  { id: '1', name: 'Coupe + Barbe', duration: '45 min', price: '85€', priceNum: 85 },
  { id: '2', name: 'Coupe seule', duration: '30 min', price: '55€', priceNum: 55 },
  { id: '3', name: 'Barbe seule', duration: '30 min', price: '40€', priceNum: 40 },
];

const SLOTS = [
  { day: 'LUN', time: '09:00', available: true },
  { day: 'LUN', time: '11:30', available: true },
  { day: 'MAR', time: '14:00', available: true },
  { day: 'MER', time: '16:30', available: true },
  { day: 'JEU', time: '10:00', available: false },
];

interface Props { navigation: any; route?: any; }

const BookingScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selectedService, setSelectedService] = useState('1');
  const [selectedSlot, setSelectedSlot] = useState('11:30');
  const [location, setLocation] = useState('Hôtel George V — Suite 412');

  const service = SERVICES.find(s => s.id === selectedService);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16, paddingBottom: 110 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hdr}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
            <Text style={{ fontSize: 18, color: COLORS.gold }}>←</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}><Text style={styles.logo}>BLADE</Text><Text style={styles.sub}>Réservation</Text></View>
          <Price value={service?.price || '85€'} size={18} />
        </View>

        {/* Barber summary */}
        <Card gold>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Avatar initials="J" size={42} />
            <View style={{ flex: 1 }}>
              <Text style={styles.barberName}>Jean-Marc V.</Text>
              <Text style={styles.barberMeta}>Certifié · 8 ans · Paris</Text>
            </View>
            <StarRating rating={5} size={12} />
          </View>
        </Card>

        {/* Service selection */}
        <SectionLabel label="Prestation" />
        {SERVICES.map(svc => (
          <TouchableOpacity
            key={svc.id}
            style={[styles.serviceRow, selectedService === svc.id && styles.serviceRowActive]}
            onPress={() => setSelectedService(svc.id)}
            activeOpacity={0.85}
          >
            <View style={[styles.radioChk, selectedService === svc.id && styles.radioChkActive]}>
              {selectedService === svc.id && <Text style={styles.radioTick}>✓</Text>}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.serviceName, selectedService === svc.id && { color: COLORS.textPrimary }]}>{svc.name}</Text>
              <Text style={styles.serviceDur}>{svc.duration}</Text>
            </View>
            <Price value={svc.price} size={15} style={selectedService !== svc.id && { opacity: 0.4 }} />
          </TouchableOpacity>
        ))}

        {/* Slot selection */}
        <SectionLabel label="Créneau" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.slotsRow}>
          {SLOTS.filter(s => s.available).map((slot, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.slot, selectedSlot === slot.time && styles.slotActive]}
              onPress={() => setSelectedSlot(slot.time)}
              activeOpacity={0.85}
            >
              <Text style={styles.slotDay}>{slot.day}</Text>
              <Text style={[styles.slotTime, selectedSlot === slot.time && { color: COLORS.gold }]}>{slot.time}</Text>
              <Text style={styles.slotAvail}>libre</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Location */}
        <SectionLabel label="Lieu" />
        <TouchableOpacity style={styles.locationField} activeOpacity={0.85}>
          <Text style={styles.locationText}>{location}</Text>
          <Text style={{ color: COLORS.gold, fontSize: 12 }}>✎</Text>
        </TouchableOpacity>

        <Divider />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Price value={service?.price || '85€'} size={32} />
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={[styles.stickyBtn, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => navigation.navigate('Payment')}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaBtnText}>Réserver &amp; Payer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ═══════════════════════════════════════════════════════
// PAYMENT SCREEN
// ═══════════════════════════════════════════════════════
export const PaymentScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selectedPM, setSelectedPM] = useState('visa');
  const [loading, setLoading] = useState(false);

  const PMS = [
    { id: 'visa', icon: 'VISA', label: '•••• 4242' },
    { id: 'apple', icon: '', label: 'Apple Pay' },
    { id: 'google', icon: 'G', label: 'Google Pay' },
  ];

  const handlePay = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    navigation.replace('Tracking');
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16, paddingBottom: 110 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hdr}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 18, color: COLORS.gold, marginRight: 10 }}>←</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}><Text style={styles.logo}>BLADE</Text><Text style={styles.sub}>Paiement</Text></View>
          <Text style={{ fontSize: 9, color: COLORS.textSecondary, opacity: 0.5 }}>SSL ✓</Text>
        </View>

        {/* Summary */}
        <Card>
          <Text style={styles.summaryTitle}>Récapitulatif</Text>
          <Text style={styles.summaryService}>Coupe + Barbe · Jean-Marc V.</Text>
          <Text style={styles.summaryMeta}>Lundi 16 mars · 11h30 · Hôtel George V</Text>
          <Divider />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.summaryTotal}>Total TTC</Text>
            <Price value="85€" size={32} />
          </View>
        </Card>

        {/* Payment methods */}
        <SectionLabel label="Mode de paiement" />
        {PMS.map(pm => (
          <TouchableOpacity
            key={pm.id}
            style={[styles.pmRow, selectedPM === pm.id && styles.pmRowActive]}
            onPress={() => setSelectedPM(pm.id)}
            activeOpacity={0.85}
          >
            <View style={styles.pmIcon}><Text style={styles.pmIconText}>{pm.icon}</Text></View>
            <Text style={[styles.pmLabel, selectedPM === pm.id && { color: COLORS.textPrimary }]}>{pm.label}</Text>
            {selectedPM === pm.id && <Text style={{ color: COLORS.gold, marginLeft: 'auto' }}>✓</Text>}
          </TouchableOpacity>
        ))}

        <Text style={styles.refundNote}>
          Remboursement intégral si annulation avant 2h du rendez-vous.
        </Text>
      </ScrollView>

      <View style={[styles.stickyBtn, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity style={styles.ctaBtn} onPress={handlePay} activeOpacity={0.85}>
          {loading
            ? <Text style={styles.ctaBtnText}>Traitement…</Text>
            : <Text style={styles.ctaBtnText}>Confirmer le paiement</Text>
          }
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ═══════════════════════════════════════════════════════
// TRACKING SCREEN
// ═══════════════════════════════════════════════════════
export const TrackingScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const TIMELINE = [
    { label: 'Réservation confirmée', meta: '85€ reçus', done: true },
    { label: 'Barbier en route', meta: 'Tracking activé · 30 min', done: true },
    { label: 'Prestation', meta: '11h30 · Suite 412', done: false },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16, paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hdr, { justifyContent: 'space-between' }]}>
          <View><Text style={styles.logo}>BLADE</Text><Text style={styles.sub}>Tracking en direct</Text></View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.gold }} />
            <Text style={{ fontSize: 9, fontFamily: FONTS.sansMedium, letterSpacing: 1, color: COLORS.gold }}>LIVE</Text>
          </View>
        </View>

        {/* Barber card */}
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Avatar initials="J" size={42} />
            <View style={{ flex: 1 }}>
              <Text style={styles.barberName}>Jean-Marc V.</Text>
              <Text style={styles.barberMeta}>En route · RDV 11h30</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 10, color: COLORS.gold, fontFamily: FONTS.sansMedium }}>RDV 11h30</Text>
              <Text style={styles.barberMeta}>Suite 412</Text>
            </View>
          </View>
        </Card>

        {/* Map placeholder */}
        <View style={styles.mapPlaceholder}>
          <View style={styles.mapRoadH} /><View style={styles.mapRoadV} />
          <View style={styles.barberPin}><Text style={styles.barberPinIcon}>✦</Text></View>
          <View style={styles.destPin}><Text style={styles.destPinIcon}>⌂</Text></View>
          <View style={styles.mapLiveBadge}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.gold }} />
            <Text style={{ fontSize: 9, color: COLORS.gold, marginLeft: 4, fontFamily: FONTS.sansMedium }}>EN ROUTE</Text>
          </View>
        </View>

        {/* ETA */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
          {[['28 min', 'Arrivée'], ['4.2 km', 'Distance']].map(([val, lbl]) => (
            <Card key={lbl} style={{ flex: 1, alignItems: 'center', paddingVertical: 12, marginBottom: 0 }}>
              <Text style={{ fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase', color: COLORS.textSecondary, opacity: 0.5, marginBottom: 4 }}>{lbl}</Text>
              <Price value={val} size={24} />
            </Card>
          ))}
        </View>

        {/* Timeline */}
        <SectionLabel label="Statut" />
        {TIMELINE.map((item, i) => (
          <View key={i} style={[styles.tlItem, !item.done && { opacity: 0.28 }]}>
            <View style={{ alignItems: 'center' }}>
              <View style={[styles.tlDot, item.done && styles.tlDotActive]} />
              {i < TIMELINE.length - 1 && <View style={styles.tlLine} />}
            </View>
            <View style={{ flex: 1, marginLeft: 10, paddingBottom: item.done ? 14 : 0 }}>
              <Text style={[styles.tlLabel, item.done && { color: COLORS.textPrimary }]}>{item.label}</Text>
              <Text style={styles.tlMeta}>{item.meta}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.privacyNote}>
          Localisation partagée 30 min avant le RDV uniquement — vie privée protégée.
        </Text>
      </ScrollView>
    </View>
  );
};

// ═══════════════════════════════════════════════════════
// REVIEW SCREEN
// ═══════════════════════════════════════════════════════
export const ReviewScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const REVIEWS = [
    { name: 'Alexandre M.', stars: 5, text: 'Impeccable, ponctuel. Parfait avant un meeting.' },
    { name: 'Sophie L.', stars: 5, text: 'Tous les garçons d\'honneur ravis pour notre mariage.' },
  ];

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    navigation.navigate('Home');
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16, paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hdr, { justifyContent: 'space-between' }]}>
          <View><Text style={styles.logo}>BLADE</Text><Text style={styles.sub}>Votre avis</Text></View>
          <Text style={{ fontSize: 9, color: '#5a9a5a', fontFamily: FONTS.sansMedium, letterSpacing: 0.5 }}>Terminé ✓</Text>
        </View>

        {/* Barber */}
        <View style={{ alignItems: 'center', paddingVertical: 20 }}>
          <Avatar initials="J" size={54} style={{ marginBottom: 10 }} />
          <Text style={{ fontFamily: FONTS.serif, fontSize: 20, fontWeight: '300', color: COLORS.textPrimary }}>Jean-Marc V.</Text>
          <Text style={{ fontSize: 11, color: COLORS.textSecondary, marginTop: 3 }}>Lundi 16 mars · Coupe + Barbe</Text>
        </View>

        {/* Star rating */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Text style={styles.ratingLbl}>NOTE</Text>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Text style={[styles.starBtn, star <= rating ? styles.starActive : styles.starInactive]}>★</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={{ fontSize: 11, color: COLORS.textSecondary, marginTop: 8, opacity: 0.5 }}>
            {rating}/5 — {['', 'Insuffisant', 'Passable', 'Bien', 'Très bien', 'Excellent'][rating]}
          </Text>
        </View>

        {/* Comment */}
        <SectionLabel label="Commentaire" />
        <View style={styles.commentInput}>
          <Text style={[styles.commentText, !comment && { color: COLORS.textSecondary, opacity: 0.5 }]}>
            {comment || 'Votre avis sur la prestation…'}
          </Text>
        </View>

        <TouchableOpacity style={styles.ctaBtn} onPress={handleSubmit} activeOpacity={0.85}>
          <Text style={styles.ctaBtnText}>{loading ? 'Publication…' : 'Publier mon avis'}</Text>
        </TouchableOpacity>

        {/* Recent reviews */}
        <Divider style={{ marginVertical: 20 }} />
        <SectionLabel label="Avis récents" />
        {REVIEWS.map((rev, i) => (
          <Card key={i}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ fontSize: 12, fontFamily: FONTS.sans, color: COLORS.textPrimary }}>{rev.name}</Text>
              <StarRating rating={rev.stars} size={10} />
            </View>
            <Text style={{ fontSize: 11, color: COLORS.textPrimary, opacity: 0.3, fontFamily: FONTS.sansLight, lineHeight: 17 }}>{rev.text}</Text>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

// ═══════════════════════════════════════════════════════
// HISTORY SCREEN
// ═══════════════════════════════════════════════════════
export const HistoryScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const PRESTATIONS = [
    { month: 'Mars 2025', items: [
      { service: 'Coupe + Barbe', barber: 'Jean-Marc V.', date: 'Lun. 16 mars', ctx: 'Hôtel George V', price: '85€', rating: 5 },
      { service: 'Coupe seule', barber: 'Rachid B.', date: 'Sam. 8 mars', ctx: 'Bureau', price: '55€', rating: 4 },
    ]},
    { month: 'Février 2025', items: [
      { service: 'Coupe + Barbe', barber: 'Jean-Marc V.', date: 'Ven. 21 fév', ctx: 'Mariage', price: '85€', rating: 5 },
      { service: 'Barbe seule', barber: 'Jean-Marc V.', date: 'Mer. 5 fév', ctx: 'Aéroport CDG', price: '40€', rating: 5 },
    ]},
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16, paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hdr}>
          <Text style={styles.logo}>BLADE</Text>
          <Text style={styles.sub}>Historique</Text>
        </View>

        {PRESTATIONS.map(group => (
          <View key={group.month}>
            <SectionLabel label={group.month} />
            {group.items.map((item, i) => (
              <Card key={i} onPress={() => navigation.navigate('Review')}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontSize: 12, fontFamily: FONTS.sans, color: COLORS.textPrimary }}>{item.service}</Text>
                  <Price value={item.price} size={16} />
                </View>
                <Text style={{ fontSize: 10, color: COLORS.textSecondary, marginBottom: 6 }}>
                  {item.barber} · {item.date} · {item.ctx}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <StarRating rating={item.rating} size={10} />
                  <Text style={{ fontSize: 9, color: '#5a9a5a', fontFamily: FONTS.sansMedium }}>Noté</Text>
                </View>
              </Card>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// ─── Shared styles ───────────────────────────────────────
const styles = StyleSheet.create({
  scroll: { paddingHorizontal: SPACING.xl },
  hdr: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 16 },
  logo: { fontFamily: FONTS.serif, fontSize: 26, fontWeight: '300', letterSpacing: 2.5, color: COLORS.gold },
  sub: { fontSize: 9, fontFamily: FONTS.sansMedium, letterSpacing: 2, textTransform: 'uppercase', color: COLORS.textSecondary, opacity: 0.5, marginTop: 2 },
  barberName: { fontSize: 13, fontFamily: FONTS.sans, color: COLORS.textPrimary, marginBottom: 2 },
  barberMeta: { fontSize: 10, color: COLORS.textSecondary, opacity: 0.6 },
  serviceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.bg3, marginBottom: 7, opacity: 0.45 },
  serviceRowActive: { backgroundColor: COLORS.bg5, borderColor: 'rgba(184,150,62,0.4)', opacity: 1 },
  radioChk: { width: 17, height: 17, borderRadius: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  radioChkActive: { backgroundColor: COLORS.bg5, borderColor: 'rgba(184,150,62,0.5)' },
  radioTick: { fontSize: 10, color: COLORS.gold },
  serviceName: { fontSize: 12, fontFamily: FONTS.sans, color: COLORS.textSecondary },
  serviceDur: { fontSize: 10, color: COLORS.textSecondary, opacity: 0.5, marginTop: 2 },
  slotsRow: { marginBottom: 4 },
  slot: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.bg3, marginRight: 7, alignItems: 'center' },
  slotActive: { backgroundColor: COLORS.bg5, borderColor: 'rgba(184,150,62,0.5)' },
  slotDay: { fontSize: 8, fontFamily: FONTS.sansMedium, letterSpacing: 1, textTransform: 'uppercase', color: COLORS.textSecondary, opacity: 0.5, marginBottom: 3 },
  slotTime: { fontSize: 14, fontFamily: FONTS.serif, fontWeight: '300', color: COLORS.gold },
  slotAvail: { fontSize: 8, color: COLORS.success, marginTop: 2 },
  locationField: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.bg3, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, padding: 12 },
  locationText: { fontSize: 12, fontFamily: FONTS.sansLight, color: COLORS.textPrimary },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 11, color: COLORS.textSecondary, opacity: 0.6 },
  stickyBtn: { paddingHorizontal: SPACING.xl, paddingTop: 12, backgroundColor: COLORS.bg, borderTopWidth: 1, borderTopColor: COLORS.border },
  ctaBtn: { backgroundColor: COLORS.gold, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  ctaBtnText: { fontSize: 11, fontFamily: FONTS.sansMedium, letterSpacing: 1.2, textTransform: 'uppercase', color: COLORS.bg },
  summaryTitle: { fontSize: 10, color: COLORS.textSecondary, opacity: 0.5, marginBottom: 8 },
  summaryService: { fontSize: 13, fontFamily: FONTS.sans, color: COLORS.textPrimary },
  summaryMeta: { fontSize: 11, color: COLORS.textSecondary, marginTop: 3 },
  summaryTotal: { fontSize: 11, color: COLORS.textSecondary, opacity: 0.5 },
  pmRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 11, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.bg3, marginBottom: 7, opacity: 0.45 },
  pmRowActive: { backgroundColor: COLORS.bg5, borderColor: 'rgba(184,150,62,0.4)', opacity: 1 },
  pmIcon: { width: 32, height: 22, borderRadius: 4, backgroundColor: COLORS.bg5, borderWidth: 1, borderColor: 'rgba(184,150,62,0.3)', alignItems: 'center', justifyContent: 'center' },
  pmIconText: { fontSize: 9, fontFamily: FONTS.sansMedium, color: COLORS.gold },
  pmLabel: { fontSize: 12, fontFamily: FONTS.sans, color: COLORS.textSecondary, flex: 1 },
  refundNote: { fontSize: 10, color: COLORS.textSecondary, opacity: 0.35, textAlign: 'center', lineHeight: 17, marginTop: 16 },
  mapPlaceholder: { height: 120, borderRadius: 14, backgroundColor: '#111', borderWidth: 1, borderColor: COLORS.border, marginBottom: 10, overflow: 'hidden', position: 'relative', justifyContent: 'center', alignItems: 'center' },
  mapRoadH: { position: 'absolute', height: 1, left: 0, right: 0, top: '50%', backgroundColor: 'rgba(255,255,255,0.06)' },
  mapRoadV: { position: 'absolute', width: 1, top: 0, bottom: 0, left: '50%', backgroundColor: 'rgba(255,255,255,0.06)' },
  barberPin: { position: 'absolute', bottom: 22, left: '52%', width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.gold, alignItems: 'center', justifyContent: 'center' },
  barberPinIcon: { fontSize: 8, color: COLORS.bg },
  destPin: { position: 'absolute', top: 18, right: 36, width: 20, height: 20, borderRadius: 10, backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  destPinIcon: { fontSize: 9, color: COLORS.textSecondary },
  mapLiveBadge: { position: 'absolute', top: 8, left: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(184,150,62,0.08)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  tlItem: { flexDirection: 'row', marginBottom: 0 },
  tlDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', marginTop: 4 },
  tlDotActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  tlLine: { width: 1, flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginTop: 2, marginBottom: 2 },
  tlLabel: { fontSize: 12, fontFamily: FONTS.sans, color: COLORS.textSecondary, marginBottom: 2 },
  tlMeta: { fontSize: 10, color: COLORS.textSecondary, opacity: 0.5, marginBottom: 14 },
  privacyNote: { fontSize: 10, color: COLORS.textSecondary, opacity: 0.3, textAlign: 'center', lineHeight: 17, marginTop: 12 },
  ratingLbl: { fontSize: 9, fontFamily: FONTS.sansMedium, letterSpacing: 1.6, textTransform: 'uppercase', color: COLORS.textSecondary, opacity: 0.5 },
  starBtn: { fontSize: 32 },
  starActive: { color: COLORS.gold },
  starInactive: { color: COLORS.textSecondary, opacity: 0.18 },
  commentInput: { backgroundColor: COLORS.bg3, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, padding: 14, minHeight: 80, marginBottom: 14 },
  commentText: { fontSize: 12, fontFamily: FONTS.sansLight, color: COLORS.textPrimary, lineHeight: 19 },
});

export default BookingScreen;
