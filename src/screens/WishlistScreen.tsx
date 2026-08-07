import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';

import { Eyebrow } from '../components/Eyebrow';
import { PlaceholderSwatch } from '../components/PlaceholderSwatch';
import { ScreenHeader } from '../components/ScreenHeader';
import { useAppState } from '../context/AppStateContext';
import { formatPrice } from '../data/mockData';
import { colors, fonts } from '../theme/tokens';
import type { FeedItem } from '../types';

export function WishlistScreen() {
  const { wishlistItems } = useAppState();

  const renderItem = ({ item }: { item: FeedItem }) => (
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
      </View>
      <Text style={styles.rowPrice}>{formatPrice(item.price)}</Text>
    </View>
  );

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
          renderItem={renderItem}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 18,
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
  },
});
