// src/components/TrackingMap.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, Easing,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';

interface TrackingMapProps {
  eta: number;
  distance: string;
  isLive?: boolean;
}

/**
 * TrackingMap — Composant de carte de tracking
 *
 * En production, remplacer le <View> de simulation par :
 * import MapView, { Marker, Polyline } from 'react-native-maps';
 *
 * Exemple d'intégration réelle :
 *
 * <MapView
 *   style={{ flex: 1, borderRadius: 14 }}
 *   initialRegion={{
 *     latitude: 48.8566,
 *     longitude: 2.3522,
 *     latitudeDelta: 0.02,
 *     longitudeDelta: 0.02,
 *   }}
 *   customMapStyle={DARK_MAP_STYLE}
 * >
 *   <Marker coordinate={{ latitude: barberLat, longitude: barberLng }}>
 *     <View style={styles.barberMarker}><Text>✦</Text></View>
 *   </Marker>
 *   <Marker coordinate={{ latitude: destLat, longitude: destLng }}>
 *     <View style={styles.destMarker}><Text>⌂</Text></View>
 *   </Marker>
 *   <Polyline
 *     coordinates={routeCoordinates}
 *     strokeColor={COLORS.gold}
 *     strokeWidth={2}
 *   />
 * </MapView>
 */
const TrackingMap: React.FC<TrackingMapProps> = ({ eta, distance, isLive = true }) => {
  // Animate barber pin position
  const pinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulsing live dot
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.2, duration: 600, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      ])
    ).start();

    // Subtle pin movement simulation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pinAnim, { toValue: 1, duration: 3000, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(pinAnim, { toValue: 0, duration: 3000, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      ])
    ).start();
  }, []);

  const barberTranslateX = pinAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 8] });
  const barberTranslateY = pinAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -5] });

  return (
    <View style={styles.container}>
      {/* Simulated map grid */}
      <View style={styles.gridH1} /><View style={styles.gridH2} />
      <View style={styles.gridV1} /><View style={styles.gridV2} />

      {/* Route line (simulated) */}
      <View style={styles.routeLine} />

      {/* Destination pin */}
      <View style={styles.destPin}>
        <View style={styles.destPinCircle}>
          <Text style={styles.destPinIcon}>⌂</Text>
        </View>
      </View>

      {/* Barber pin (animated) */}
      <Animated.View style={[styles.barberPin, { transform: [{ translateX: barberTranslateX }, { translateY: barberTranslateY }] }]}>
        <View style={styles.barberPinCircle}>
          <Text style={styles.barberPinIcon}>✦</Text>
        </View>
        <View style={styles.barberPinShadow} />
      </Animated.View>

      {/* Live badge */}
      {isLive && (
        <View style={styles.liveBadge}>
          <Animated.View style={[styles.liveDot, { opacity: pulseAnim }]} />
          <Text style={styles.liveText}>EN ROUTE</Text>
        </View>
      )}

      {/* ETA overlay */}
      <View style={styles.etaOverlay}>
        <Text style={styles.etaValue}>{eta} min</Text>
        <Text style={styles.etaDist}>{distance}</Text>
      </View>
    </View>
  );
};

// Dark map style for Google Maps (use with react-native-maps)
export const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#0a0a0a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#555555' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0a0a0a' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#222222' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2a2a2a' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0a0f1a' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#111111' }] },
];

const styles = StyleSheet.create({
  container: {
    height: 140,
    borderRadius: RADIUS.lg,
    backgroundColor: '#0f0f0f',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    overflow: 'hidden',
    marginBottom: 10,
    position: 'relative',
  },
  // Grid lines simulating map roads
  gridH1: { position: 'absolute', height: 1, left: 0, right: 0, top: '45%', backgroundColor: 'rgba(255,255,255,0.05)' },
  gridH2: { position: 'absolute', height: 1, left: 0, right: 0, top: '70%', backgroundColor: 'rgba(255,255,255,0.04)' },
  gridV1: { position: 'absolute', width: 1, top: 0, bottom: 0, left: '45%', backgroundColor: 'rgba(255,255,255,0.05)' },
  gridV2: { position: 'absolute', width: 1, top: 0, bottom: 0, left: '72%', backgroundColor: 'rgba(255,255,255,0.03)' },
  // Route
  routeLine: {
    position: 'absolute',
    bottom: 36,
    left: '30%',
    right: '28%',
    height: 1.5,
    backgroundColor: 'rgba(184,150,62,0.3)',
    borderRadius: 1,
    transform: [{ rotate: '-8deg' }],
  },
  // Barber pin
  barberPin: { position: 'absolute', bottom: 28, left: '33%' },
  barberPinCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.gold, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#0a0a0a' },
  barberPinIcon: { fontSize: 10, color: COLORS.bg },
  barberPinShadow: { width: 8, height: 3, borderRadius: 4, backgroundColor: 'rgba(184,150,62,0.25)', alignSelf: 'center', marginTop: 1 },
  // Destination pin
  destPin: { position: 'absolute', top: 18, right: '25%' },
  destPinCircle: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  destPinIcon: { fontSize: 10, color: COLORS.textSecondary },
  // Live badge
  liveBadge: { position: 'absolute', top: 10, left: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(184,150,62,0.1)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: 'rgba(184,150,62,0.2)' },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.gold, marginRight: 5 },
  liveText: { fontSize: 8, fontFamily: FONTS.sansMedium, letterSpacing: 1, color: COLORS.gold },
  // ETA overlay
  etaOverlay: { position: 'absolute', bottom: 8, right: 10, alignItems: 'flex-end' },
  etaValue: { fontFamily: FONTS.serif, fontSize: 18, fontWeight: '300', color: COLORS.gold },
  etaDist: { fontSize: 9, color: COLORS.textSecondary, opacity: 0.6, marginTop: 1 },
});

export default TrackingMap;
