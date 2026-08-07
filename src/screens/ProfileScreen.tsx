import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Eyebrow } from '../components/Eyebrow';
import { PlaceholderSwatch } from '../components/PlaceholderSwatch';
import { ScreenHeader } from '../components/ScreenHeader';
import { useAuth } from '../auth/AuthContext';
import { useAppState } from '../context/AppStateContext';
import { colors, fonts } from '../theme/tokens';
import type { RootTabParamList } from '../types';

type Props = BottomTabScreenProps<RootTabParamList, 'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  const { client, advisor, updateMaterials } = useAppState();
  const { logout } = useAuth();
  const [draftMaterial, setDraftMaterial] = useState('');
  const [savingMaterial, setSavingMaterial] = useState<string | null>(null);
  const [materialsError, setMaterialsError] = useState<string | null>(null);

  const addMaterial = async () => {
    const material = draftMaterial.trim();
    if (!material || client.materials.includes(material)) {
      setDraftMaterial('');
      return;
    }
    setMaterialsError(null);
    setSavingMaterial(material);
    try {
      await updateMaterials([...client.materials, material]);
      setDraftMaterial('');
    } catch {
      setMaterialsError("Couldn't save that — try again.");
    } finally {
      setSavingMaterial(null);
    }
  };

  const removeMaterial = async (material: string) => {
    setMaterialsError(null);
    setSavingMaterial(material);
    try {
      await updateMaterials(client.materials.filter((m) => m !== material));
    } catch {
      setMaterialsError("Couldn't save that — try again.");
    } finally {
      setSavingMaterial(null);
    }
  };

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
          <Text style={styles.sectionHint}>Tell your advisor what to look for. Tap a tag to remove it.</Text>

          <View style={styles.chips}>
            {client.materials.map((material) => (
              <Pressable
                key={material}
                onPress={() => removeMaterial(material)}
                disabled={savingMaterial === material}
                style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
              >
                <Text style={styles.chipText}>{material}</Text>
                {savingMaterial === material ? (
                  <ActivityIndicator size="small" color={colors.bark} style={styles.chipSpinner} />
                ) : (
                  <Text style={styles.chipRemove}>×</Text>
                )}
              </Pressable>
            ))}
          </View>

          <View style={styles.addRow}>
            <TextInput
              value={draftMaterial}
              onChangeText={setDraftMaterial}
              placeholder="Add a material, like Cashmere"
              placeholderTextColor={colors.clay}
              style={styles.addInput}
              returnKeyType="done"
              onSubmitEditing={addMaterial}
            />
            <Pressable
              onPress={addMaterial}
              disabled={!draftMaterial.trim()}
              style={({ pressed }) => [
                styles.addButton,
                pressed && styles.addButtonPressed,
                !draftMaterial.trim() && styles.addButtonDisabled,
              ]}
            >
              {({ pressed }) => (
                <Text style={[styles.addButtonText, pressed && styles.addButtonTextPressed]}>Add</Text>
              )}
            </Pressable>
          </View>
          {materialsError && <Text style={styles.materialsError}>{materialsError}</Text>}
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
    marginBottom: 6,
    textAlign: 'left',
  },
  sectionHint: {
    fontFamily: fonts.body,
    fontSize: 11.5,
    color: colors.bark,
    marginBottom: 14,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.stone,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
  },
  chipPressed: {
    backgroundColor: colors.paper,
  },
  chipText: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.ink,
  },
  chipRemove: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.clay,
  },
  chipSpinner: {
    width: 11,
    height: 11,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
  },
  addInput: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.ink,
    borderWidth: 1,
    borderColor: colors.stone,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  addButton: {
    borderWidth: 1,
    borderColor: colors.ink,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  addButtonPressed: {
    backgroundColor: colors.ink,
  },
  addButtonDisabled: {
    opacity: 0.4,
  },
  addButtonText: {
    fontFamily: fonts.body,
    fontSize: 10.5,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.ink,
  },
  addButtonTextPressed: {
    color: colors.paper,
  },
  materialsError: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.persianRed,
    marginTop: 10,
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
