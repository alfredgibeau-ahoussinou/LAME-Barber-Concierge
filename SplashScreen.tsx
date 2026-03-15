// src/components/SplashScreen.tsx
import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, Easing, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../theme';

const { width, height } = Dimensions.get('window');

interface Props {
  onFinish: () => void;
}

const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  const insets = useSafeAreaInsets();

  // Animation values
  const ringScale = useRef(new Animated.Value(0)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(20)).current;
  const subOpacity = useRef(new Animated.Value(0)).current;
  const dividerWidth = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // 1. Ring appears
      Animated.parallel([
        Animated.timing(ringScale, { toValue: 1, duration: 500, useNativeDriver: true, easing: Easing.out(Easing.back(1.3)) }),
        Animated.timing(ringOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),

      // 2. Logo slides up
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(logoTranslateY, { toValue: 0, duration: 500, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
      ]),

      // 3. Divider grows
      Animated.timing(dividerWidth, { toValue: 32, duration: 400, useNativeDriver: false }),

      // 4. Subtitle fades in
      Animated.timing(subOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),

      // 5. Hold for 800ms
      Animated.delay(800),

      // 6. Fade out entire screen
      Animated.timing(screenOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(() => {
      onFinish();
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      {/* Ring icon */}
      <Animated.View style={[
        styles.ring,
        {
          opacity: ringOpacity,
          transform: [{ scale: ringScale }],
        },
      ]}>
        <Text style={styles.ringIcon}>✦</Text>
      </Animated.View>

      {/* Logo */}
      <Animated.Text style={[
        styles.logo,
        {
          opacity: logoOpacity,
          transform: [{ translateY: logoTranslateY }],
        },
      ]}>
        BLADE
      </Animated.Text>

      {/* Divider */}
      <Animated.View style={[styles.divider, { width: dividerWidth }]} />

      {/* Subtitle */}
      <Animated.Text style={[styles.sub, { opacity: subOpacity }]}>
        BARBER CONCIERGE
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  ring: {
    width: 60, height: 60, borderRadius: 30,
    borderWidth: 1, borderColor: 'rgba(184,150,62,0.25)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 24,
  },
  ringIcon: { fontSize: 22, color: COLORS.gold },
  logo: {
    fontFamily: FONTS.serif,
    fontSize: 48,
    fontWeight: '300',
    letterSpacing: 12,
    color: COLORS.gold,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.gold,
    opacity: 0.3,
    marginVertical: 14,
  },
  sub: {
    fontSize: 9,
    fontFamily: FONTS.sansMedium,
    letterSpacing: 5,
    textTransform: 'uppercase',
    color: COLORS.textSecondary,
    opacity: 0.5,
  },
});

export default SplashScreen;
