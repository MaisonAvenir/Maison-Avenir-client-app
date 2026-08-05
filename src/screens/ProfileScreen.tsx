import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Eyebrow } from '../components/Eyebrow';
import { PlaceholderSwatch } from '../components/PlaceholderSwatch';
import { ScreenHeader } from '../components/ScreenHeader';
import { useAuth } from '../auth/AuthContext';
import { useAppState } from '../context/AppStateContext';
import { colors, fonts } from '../theme/tokens';
import type { RootTabParamList } from '../types';

type Props = BottomTabScreenProps<RootTabParamList, 'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  const { client, advisor } = useAppState();
  const { logout } = useAuth();

  return (
    <View style={styles.screen}>
      <ScreenHeader>
        <Eyebrow align="center" size={11}>
          Profile
        </Eyebrow>
      </ScreenHeader>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.identity}>
          <PlaceholderSwatch palette={advisor.palette} style={styles.avatar} />
          <Text style={styles.clientName}>{client.name}</Text>
          <Eyebrow size={11} style={styles.memberSince}>
            Private Client since {client.memberSince}
          </Eyebrow>
        </View>

        <View style={styles.section}>
          <Eyebrow size={10.5} style={styles.sectionLabel}>
            Materials You Love
          </Eyebrow>
          <View style={styles.chips}>
            {client.materials.map((material) => (
              <View key={material} style={styles.chip}>
                <Text style={styles.chipText}>{material}</Text>
              </View>
            ))}
          </View>
        </View>

        <Pressable
          onPress={() => navigation.navigate('Messages')}
          style={({ pressed }) => [styles.contactButton, pressed && styles.contactButtonPressed]}
        >
          <Text style={styles.contactButtonText}>Contact {advisor.name}</Text>
        </Pressable>

        <Pressable onPress={logout}>
          <Text style={styles.signOut}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  content: {
    padding: 24,
    paddingTop: 32,
    paddingBottom: 32,
    alignItems: 'center',
    gap: 32,
  },
  identity: {
    alignItems: 'center',
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 999,
    marginBottom: 16,
  },
  clientName: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.obsidian,
  },
  memberSince: {
    marginTop: 6,
    letterSpacing: 1.1,
  },
  section: {
    width: '100%',
  },
  sectionLabel: {
    marginBottom: 12,
    textAlign: 'left',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.stone,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipText: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.ink,
  },
  contactButton: {
    width: '100%',
    backgroundColor: colors.obsidian,
    paddingVertical: 16,
    alignItems: 'center',
  },
  contactButtonPressed: {
    backgroundColor: colors.persianRed,
  },
  contactButtonText: {
    fontFamily: fonts.body,
    fontSize: 11,
    letterSpacing: 1.98,
    textTransform: 'uppercase',
    color: colors.paper,
  },
  signOut: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.ink,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(42,38,34,0.12)',
    paddingBottom: 1,
  },
});
