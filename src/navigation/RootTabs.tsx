import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  ChatCircleDotsIcon,
  ClockCounterClockwiseIcon,
  HouseIcon,
  SparkleIcon,
  UserIcon,
} from 'phosphor-react-native';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ForYouScreen } from '../screens/ForYouScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { MessagesScreen } from '../screens/MessagesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { WishlistScreen } from '../screens/WishlistScreen';
import { colors, fonts } from '../theme/tokens';
import type { RootTabParamList } from '../types';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        tabBarActiveTintColor: colors.persianRed,
        tabBarInactiveTintColor: colors.clay,
        tabBarStyle: {
          backgroundColor: colors.paper,
          borderTopWidth: 1,
          borderTopColor: colors.hairline,
          paddingTop: 10,
          paddingBottom: Math.max(insets.bottom, 10),
          height: 54 + Math.max(insets.bottom, 10),
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: styles.item,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <HouseIcon color={color} size={size} weight="thin" />,
          tabBarLabel: ({ color }) => <Text style={[styles.label, { color }]}>Home</Text>,
        }}
      />
      <Tab.Screen
        name="ForYou"
        component={ForYouScreen}
        options={{
          tabBarIcon: ({ color, size }) => <SparkleIcon color={color} size={size} weight="thin" />,
          tabBarLabel: ({ color }) => <Text style={[styles.label, { color }]}>For You</Text>,
        }}
      />
      <Tab.Screen
        name="Wishlist"
        component={WishlistScreen}
        options={{
          // Reachable via the "Wishlist" link on For You, not a bottom tab icon —
          // keeps the tab bar at 5 items.
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <ChatCircleDotsIcon color={color} size={size} weight="thin" />,
          tabBarLabel: ({ color }) => <Text style={[styles.label, { color }]}>Messages</Text>,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <ClockCounterClockwiseIcon color={color} size={size} weight="thin" />
          ),
          tabBarLabel: ({ color }) => <Text style={[styles.label, { color }]}>History</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <UserIcon color={color} size={size} weight="thin" />,
          tabBarLabel: ({ color }) => <Text style={[styles.label, { color }]}>Profile</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.body,
    fontSize: 9.5,
    letterSpacing: 0.4,
  },
  item: {
    paddingTop: 4,
  },
});
