import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Eyebrow } from '../components/Eyebrow';
import { EditableTagList } from '../components/EditableTagList';
import { PlaceholderSwatch } from '../components/PlaceholderSwatch';
import { ScreenHeader } from '../components/ScreenHeader';
import { useAuth } from '../auth/AuthContext';
import { useAppState } from '../context/AppStateContext';
import { colors, fonts } from '../theme/tokens';
import type { RootTabParamList } from '../types';

type Props = BottomTabScreenProps<RootTabParamList, 'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  const { client, advisor, updateMaterials, updateBrands } = useAppState();
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

        <EditableTagList
          label="Materials You Love"
          hint="Tell your advisor what to look for. Tap a tag to remove it."
          placeholder="Add a material, like Cashmere"
          values={client.materials}
          onChange={updateMaterials}
        />

        <EditableTagList
          label="Brands You Love"
          hint="Let your advisor know your favorite brands. Tap a tag to remove it."
          placeholder="Add a brand, like Billy Reid"
          values={client.brands}
          onChange={updateBrands}
        />

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
