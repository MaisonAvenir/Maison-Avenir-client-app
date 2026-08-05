import React, { useMemo } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native';

import { Eyebrow } from '../components/Eyebrow';
import { PlaceholderSwatch } from '../components/PlaceholderSwatch';
import { ScreenHeader } from '../components/ScreenHeader';
import { useAppState } from '../context/AppStateContext';
import { formatPrice } from '../data/mockData';
import { colors, fonts } from '../theme/tokens';
import type { Purchase } from '../types';

export function HistoryScreen() {
  const { purchases, client, isLoadingCustomerData, customerDataError } = useAppState();
  const totalSpent = useMemo(() => purchases.reduce((sum, p) => sum + p.price, 0), [purchases]);

  const renderItem = ({ item }: { item: Purchase }) => (
    <View style={styles.row}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.thumb} />
      ) : (
        <PlaceholderSwatch palette={item.palette} style={styles.thumb} />
      )}
      <View style={styles.rowInfo}>
        <Text style={styles.rowName}>{item.name}</Text>
        <Text style={styles.rowDate}>{item.date}</Text>
      </View>
      <Text style={styles.rowPrice}>{formatPrice(item.price)}</Text>
    </View>
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader style={styles.header}>
        <Eyebrow align="center" size={11}>
          Purchase History
        </Eyebrow>
        <Text style={styles.summary}>
          {purchases.length} pieces · {formatPrice(totalSpent)} since {client.memberSince}
        </Text>
      </ScreenHeader>

      {isLoadingCustomerData && purchases.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.bark} />
        </View>
      ) : customerDataError ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{customerDataError}</Text>
        </View>
      ) : purchases.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No purchases yet.</Text>
        </View>
      ) : (
        <FlatList
          data={purchases}
          keyExtractor={(p) => p.id}
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
  header: {
    alignItems: 'center',
  },
  summary: {
    fontFamily: fonts.display,
    fontSize: 14,
    color: colors.bark,
    marginTop: 6,
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
    width: 48,
    height: 48,
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
  },
  rowDate: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.clay,
    marginTop: 3,
  },
  rowPrice: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.ink,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.persianRed,
    textAlign: 'center',
  },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.clay,
    textAlign: 'center',
  },
});
