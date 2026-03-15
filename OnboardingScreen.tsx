// src/screens/auth/OnboardingScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions,
  FlatList, TouchableOpacity, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS } from '../../theme';
import { Button, Tag, OnboardingDots } from '../../components/UI';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    key: 'welcome',
    icon: '✦',
    title: 'Votre barbier\nà votre porte',
    titleItalic: 'à votre porte',
    body: 'Un barbier certifié se déplace chez vous, en hôtel, au bureau ou pour vos événements.',
    tags: null,
  },
  {
    key: 'tracking',
    icon: '⊙',
    title: 'Réservez &\nsuivez en direct',
    titleItalic: 'suivez en direct',
    body: "Choisissez votre créneau, payez en ligne et suivez l'arrivée de votre barbier en temps réel.",
    tags: null,
  },
  {
    key: 'contexts',
    icon: '☆',
    title: 'Palace, Mariage,\nPartout',
    titleItalic: 'Partout',
    body: "Hôtel 5 étoiles, particulier, EVG, aéroport ou bureau — BLADE s'adapte à chaque contexte.",
    tags: ['Palace', 'Hôtel', 'Mariage', 'EVG', 'Aéroport', 'Bureau'],
  },
];

interface Props {
  navigation: any;
}

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

  const goNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.replace('Signup1');
    }
  };

  const renderSlide = ({ item, index }: { item: typeof SLIDES[0]; index: number }) => (
    <View style={[styles.slide, { width }]}>
      <Text style={styles.slideIcon}>{item.icon}</Text>
      <Text style={styles.slideTitle}>
        {item.title.split('\n').map((line, i) => {
          const isItalic = item.titleItalic && line.includes(item.titleItalic.split('\n')[0]);
          return (
            <Text key={i}>
              {i > 0 && '\n'}
              {isItalic
                ? <Text style={styles.slideTitleItalic}>{line}</Text>
                : line
              }
            </Text>
          );
        })}
      </Text>
      <Text style={styles.slideBody}>{item.body}</Text>
      {item.tags && (
        <View style={styles.tagsRow}>
          {item.tags.map(tag => <Tag key={tag} label={tag} active />)}
        </View>
      )}
      <OnboardingDots total={SLIDES.length} current={index} />
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* Skip */}
      <TouchableOpacity
        style={styles.skipBtn}
        onPress={() => navigation.replace('Login')}
        activeOpacity={0.7}
      >
        <Text style={styles.skipText}>Passer</Text>
      </TouchableOpacity>

      {/* Logo */}
      <View style={styles.logoWrap}>
        <View style={styles.logoRing}>
          <Text style={styles.logoIcon}>✦</Text>
        </View>
        <Text style={styles.logoText}>BLADE</Text>
        <Text style={styles.logoSub}>BARBER CONCIERGE</Text>
      </View>

      {/* Slides */}
      <FlatList
        ref={flatRef}
        data={SLIDES}
        keyExtractor={item => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        renderItem={renderSlide}
        onMomentumScrollEnd={e => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(idx);
        }}
        style={{ flex: 1 }}
      />

      {/* Bottom Actions */}
      <View style={[styles.bottomActions, { paddingBottom: insets.bottom + 16 }]}>
        <Button
          label={currentIndex < SLIDES.length - 1 ? 'Suivant' : 'Créer mon compte'}
          onPress={goNext}
        />
        {currentIndex === SLIDES.length - 1 && (
          <Button
            label="Se connecter"
            variant="outline"
            onPress={() => navigation.replace('Login')}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
  },
  skipBtn: {
    position: 'absolute',
    top: 60,
    right: SPACING.xl,
    zIndex: 10,
  },
  skipText: {
    fontSize: 11,
    fontFamily: FONTS.sans,
    color: COLORS.textSecondary,
    opacity: 0.5,
    letterSpacing: 0.3,
  },
  logoWrap: { alignItems: 'center', paddingTop: SPACING.xxl, paddingBottom: SPACING.xl },
  logoRing: {
    width: 54, height: 54, borderRadius: 27,
    borderWidth: 1, borderColor: 'rgba(184,150,62,0.2)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  logoIcon: { fontSize: 20, color: COLORS.gold },
  logoText: {
    fontFamily: FONTS.serif,
    fontSize: 38, fontWeight: '300',
    letterSpacing: 10, color: COLORS.gold,
  },
  logoSub: {
    fontSize: 8, fontFamily: FONTS.sansMedium,
    letterSpacing: 4, textTransform: 'uppercase',
    color: COLORS.textSecondary, opacity: 0.5, marginTop: 5,
  },
  slide: {
    paddingHorizontal: SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  slideIcon: { fontSize: 38, opacity: 0.55, marginBottom: SPACING.xl, color: COLORS.gold },
  slideTitle: {
    fontFamily: FONTS.serif,
    fontSize: 26, fontWeight: '300',
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: SPACING.md,
  },
  slideTitleItalic: {
    fontFamily: FONTS.serifItalic,
    color: COLORS.textPrimary,
    opacity: 0.45,
  },
  slideBody: {
    fontSize: 12, fontFamily: FONTS.sansLight,
    color: COLORS.textPrimary, opacity: 0.35,
    textAlign: 'center', lineHeight: 20,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  tagsRow: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'center', gap: 6,
    marginBottom: SPACING.lg,
  },
  bottomActions: {
    width: '100%',
    paddingHorizontal: SPACING.xl,
    gap: 8,
  },
});

export default OnboardingScreen;
