// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS, FONTS } from '../theme';

// Auth
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import { Signup1Screen, Signup2Screen, Signup3Screen, Signup4Screen } from '../screens/auth/SignupScreen';

// Client
import HomeScreen from '../screens/client/HomeScreen';
import SearchScreen, { BarberProfileScreen } from '../screens/client/SearchScreen';
import BookingScreen, {
  PaymentScreen, TrackingScreen, ReviewScreen, HistoryScreen,
} from '../screens/client/BookingScreen';

// Shared
import NotificationsScreen, {
  ProfileScreen, SettingsScreen, SupportScreen,
} from '../screens/shared/NotificationsScreen';

// Pro
import BarberDashboardScreen, { AdminDashboardScreen } from '../screens/barber/BarberDashboardScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ── Custom Tab Bar ────────────────────────────────────────
const TAB_ITEMS = [
  { key: 'HomeTab', label: 'Accueil', icon: '⌂' },
  { key: 'SearchTab', label: 'Recherche', icon: '◎' },
  { key: 'TrackingTab', label: 'Tracking', icon: '⊙' },
  { key: 'NotifsTab', label: 'Notifs', icon: '◈' },
  { key: 'ProfileTab', label: 'Profil', icon: '☆' },
];

const CustomTabBar = ({ state, navigation }: any) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[tabStyles.bar, { paddingBottom: insets.bottom + 4 }]}>
      {state.routes.map((route: any, index: number) => {
        const tab = TAB_ITEMS[index];
        const focused = state.index === index;
        return (
          <TouchableOpacity
            key={route.key}
            style={tabStyles.item}
            onPress={() => navigation.navigate(route.name)}
            activeOpacity={0.7}
          >
            <Text style={[tabStyles.icon, focused && tabStyles.iconActive]}>{tab.icon}</Text>
            <Text style={[tabStyles.label, focused && tabStyles.labelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ── Client Stack ──────────────────────────────────────────
const ClientStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="BarberProfile" component={BarberProfileScreen} />
    <Stack.Screen name="Booking" component={BookingScreen} />
    <Stack.Screen name="Payment" component={PaymentScreen} />
    <Stack.Screen name="Tracking" component={TrackingScreen} />
    <Stack.Screen name="Review" component={ReviewScreen} />
    <Stack.Screen name="History" component={HistoryScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Support" component={SupportScreen} />
  </Stack.Navigator>
);

const SearchStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="Search" component={SearchScreen} />
    <Stack.Screen name="BarberProfile" component={BarberProfileScreen} />
    <Stack.Screen name="Booking" component={BookingScreen} />
    <Stack.Screen name="Payment" component={PaymentScreen} />
  </Stack.Navigator>
);

const TrackingStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TrackingMain" component={TrackingScreen} />
  </Stack.Navigator>
);

const NotifsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Notifs" component={NotificationsScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Support" component={SupportScreen} />
    <Stack.Screen name="History" component={HistoryScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
  </Stack.Navigator>
);

// ── Client Bottom Tabs ────────────────────────────────────
const ClientTabs = () => (
  <Tab.Navigator
    tabBar={props => <CustomTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="HomeTab" component={ClientStack} />
    <Tab.Screen name="SearchTab" component={SearchStack} />
    <Tab.Screen name="TrackingTab" component={TrackingStack} />
    <Tab.Screen name="NotifsTab" component={NotifsStack} />
    <Tab.Screen name="ProfileTab" component={ProfileStack} />
  </Tab.Navigator>
);

// ── Barber Stack ──────────────────────────────────────────
const BarberTabs = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="BarberDashboard" component={BarberDashboardScreen} />
    <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
  </Stack.Navigator>
);

// ── Root Navigator ────────────────────────────────────────
const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{ headerShown: false, animation: 'fade' }}
    >
      {/* Onboarding & Auth */}
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup1" component={Signup1Screen} />
      <Stack.Screen name="Signup2" component={Signup2Screen} />
      <Stack.Screen name="Signup3" component={Signup3Screen} />
      <Stack.Screen name="Signup4" component={Signup4Screen} />

      {/* Main Apps */}
      <Stack.Screen name="ClientTabs" component={ClientTabs} />
      <Stack.Screen name="BarberTabs" component={BarberTabs} />
    </Stack.Navigator>
  </NavigationContainer>
);

// ── Styles ────────────────────────────────────────────────
const tabStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: COLORS.bg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 10,
  },
  item: { flex: 1, alignItems: 'center', gap: 3, paddingVertical: 2 },
  icon: { fontSize: 18, color: COLORS.textSecondary, opacity: 0.28 },
  iconActive: { color: COLORS.gold, opacity: 1 },
  label: { fontSize: 9, fontFamily: FONTS.sans, color: COLORS.textSecondary, opacity: 0.28, letterSpacing: 0.4 },
  labelActive: { color: COLORS.gold, opacity: 1 },
});

export default AppNavigator;
