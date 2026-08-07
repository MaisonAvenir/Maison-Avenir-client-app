import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Eyebrow } from '../components/Eyebrow';
import { PlaceholderSwatch } from '../components/PlaceholderSwatch';
import { ScreenHeader } from '../components/ScreenHeader';
import { useAppState } from '../context/AppStateContext';
import { formatPrice } from '../data/mockData';
import { colors, fonts } from '../theme/tokens';
import type { FeedItem } from '../types';

function WishlistRow({ item }: { item: FeedItem }) {
  const { wishlistNotes, removeFromWishlist, updateWishlistNote } = useAppState();
  const [draft, setDraft] = useState(wishlistNotes[item.id] ?? '');
  const [isRemoving, setIsRemoving] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await removeFromWishlist(item.id);
    } catch {
      setIsRemoving(false);
    }
  };

  const handleNoteBlur = async () => {
    if (draft.trim() === (wishlistNotes[item.id] ?? '')) return;
    setIsSavingNote(true);
    try {
      await updateWishlistNote(item.id, draft);
    } finally {
      setIsSavingNote(false);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.thumb} />
        ) : (
          <PlaceholderSwatch palette={item.palette} style={styles.thumb} />
        )}
        <View style={styles.rowInfo}>
          <Eyebrow size={9.5} color={colors.clay}>
            {item.brand}
          </Eyebrow>
          <Text style={styles.rowName}>{item.name}</Text>
          <Text style={styles.rowPrice}>{formatPrice(item.price)}</Text>
        </View>
        <Pressable onPress={handleRemove} disabled={isRemoving} style={styles.removeButton}>
          {isRemoving ? (
            <ActivityIndicator size="small" color={colors.clay} />
          ) : (
            <Text style={styles.removeText}>×</Text>
          )}
        </Pressable>
      </View>
      <View style={styles.noteRow}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          onBlur={handleNoteBlur}
          placeholder="Add a note…"
          placeholderTextColor={colors.clay}
          style={styles.noteInput}
          returnKeyType="done"
        />
        {isSavingNote && <ActivityIndicator size="small" color={colors.clay} style={styles.noteSpinner} />}
      </View>
    </View>
  );
}

export function WishlistScreen() {
  const { wishlistItems } = useAppState();

  return (
    <View style={styles.screen}>
      <ScreenHeader>
        <Eyebrow align="center" size={11}>
          Wishlist
        </Eyebrow>
      </ScreenHeader>

      {wishlistItems.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>
            Nothing saved yet. Tap Save on anything in For You to keep it here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={wishlistItems}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => <WishlistRow item={item} />}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.clay,
    textAlign: 'center',
    lineHeight: 20,
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: colors.hairlineSoft,
  },
  card: {
    paddingVertical: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  thumb: {
    width: 56,
    height: 56,
    flexShrink: 0,
  },
  rowInfo: {
    flex: 1,
    minWidth: 0,
  },
  rowName: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.obsidian,
    lineHeight: 19,
    marginTop: 3,
  },
  rowPrice: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.ink,
    marginTop: 3,
  },
  removeButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  removeText: {
    fontFamily: fonts.body,
    fontSize: 20,
    color: colors.clay,
    lineHeight: 22,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    marginLeft: 70,
  },
  noteInput: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 12.5,
    color: colors.ink,
    borderWidth: 1,
    borderColor: colors.stone,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  noteSpinner: {
    width: 14,
    height: 14,
  },
});
