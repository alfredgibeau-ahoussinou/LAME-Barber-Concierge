// src/components/ScreenWrapper.tsx
import React from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING } from '../theme';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onBack?: () => void;
  transparent?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title, subtitle, rightElement, onBack, transparent,
}) => {
  return (
    <View style={[styles.header, transparent && styles.headerTransparent]}>
      <View style={styles.headerLeft}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        )}
        <View>
          <Text style={styles.logoText}>{title || 'BLADE'}</Text>
          {subtitle && <Text style={styles.subText}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement && <View style={styles.headerRight}>{rightElement}</View>}
    </View>
  );
};

interface ScreenWrapperProps {
  children: React.ReactNode;
  scroll?: boolean;
  style?: object;
  padBottom?: boolean;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children, scroll = true, style, padBottom = true,
}) => {
  const insets = useSafeAreaInsets();

  const content = scroll ? (
    <ScrollView
      style={[styles.screen, style]}
      contentContainerStyle={[
        styles.scrollContent,
        padBottom && { paddingBottom: insets.bottom + 80 },
      ]}
      showsVerticalScrollIndicator={false}
      bounces
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.screen, style, padBottom && { paddingBottom: insets.bottom + 80 }]}>
      {children}
    </View>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      {content}
    </>
  );
};

// ── Bottom Tab Bar ────────────────────────────────────
interface TabItem {
  key: string;
  icon: string;
  label: string;
}

interface BottomTabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (key: string) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ tabs, activeTab, onTabPress }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom + 4 }]}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.key}
          onPress={() => onTabPress(tab.key)}
          style={styles.tabItem}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabIcon, activeTab === tab.key && styles.tabIconActive]}>
            {tab.icon}
          </Text>
          <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: 12,
    backgroundColor: COLORS.bg,
  },
  headerTransparent: { backgroundColor: COLORS.transparent },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerRight: { alignItems: 'flex-end' },
  backBtn: { marginRight: 4, padding: 4 },
  backIcon: { fontSize: 18, color: COLORS.gold },
  logoText: {
    fontFamily: FONTS.serif,
    fontSize: 26,
    fontWeight: '300',
    letterSpacing: 2,
    color: COLORS.gold,
  },
  subText: {
    fontSize: 9,
    fontFamily: FONTS.sansMedium,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    color: COLORS.textSecondary,
    opacity: 0.55,
    marginTop: 2,
  },
  screen: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { paddingHorizontal: SPACING.xl },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.bg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingVertical: 2,
  },
  tabIcon: { fontSize: 18, color: COLORS.textSecondary, opacity: 0.3 },
  tabIconActive: { color: COLORS.gold, opacity: 1 },
  tabLabel: {
    fontSize: 9,
    fontFamily: FONTS.sans,
    color: COLORS.textSecondary,
    opacity: 0.3,
    letterSpacing: 0.4,
  },
  tabLabelActive: { color: COLORS.gold, opacity: 1 },
});
