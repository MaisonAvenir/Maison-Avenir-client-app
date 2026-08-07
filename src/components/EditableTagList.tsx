import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Eyebrow } from './Eyebrow';
import { colors, fonts } from '../theme/tokens';

interface Props {
  label: string;
  hint: string;
  placeholder: string;
  values: string[];
  onChange: (values: string[]) => Promise<void>;
}

/** A tag list the customer can add to and remove from, autosaving each change. */
export function EditableTagList({ label, hint, placeholder, values, onChange }: Props) {
  const [draft, setDraft] = useState('');
  const [savingTag, setSavingTag] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addTag = async () => {
    const tag = draft.trim();
    if (!tag || values.includes(tag)) {
      setDraft('');
      return;
    }
    setError(null);
    setSavingTag(tag);
    try {
      await onChange([...values, tag]);
      setDraft('');
    } catch {
      setError("Couldn't save that — try again.");
    } finally {
      setSavingTag(null);
    }
  };

  const removeTag = async (tag: string) => {
    setError(null);
    setSavingTag(tag);
    try {
      await onChange(values.filter((v) => v !== tag));
    } catch {
      setError("Couldn't save that — try again.");
    } finally {
      setSavingTag(null);
    }
  };

  return (
    <View style={styles.section}>
      <Eyebrow size={10.5} style={styles.sectionLabel}>
        {label}
      </Eyebrow>
      <Text style={styles.sectionHint}>{hint}</Text>

      <View style={styles.chips}>
        {values.map((tag) => (
          <Pressable
            key={tag}
            onPress={() => removeTag(tag)}
            disabled={savingTag === tag}
            style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
          >
            <Text style={styles.chipText}>{tag}</Text>
            {savingTag === tag ? (
              <ActivityIndicator size="small" color={colors.bark} style={styles.chipSpinner} />
            ) : (
              <Text style={styles.chipRemove}>×</Text>
            )}
          </Pressable>
        ))}
      </View>

      <View style={styles.addRow}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder={placeholder}
          placeholderTextColor={colors.clay}
          style={styles.addInput}
          returnKeyType="done"
          onSubmitEditing={addTag}
        />
        <Pressable
          onPress={addTag}
          disabled={!draft.trim()}
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.addButtonPressed,
            !draft.trim() && styles.addButtonDisabled,
          ]}
        >
          {({ pressed }) => (
            <Text style={[styles.addButtonText, pressed && styles.addButtonTextPressed]}>Add</Text>
          )}
        </Pressable>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
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
  error: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.persianRed,
    marginTop: 10,
  },
});
