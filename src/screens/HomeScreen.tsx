import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Eyebrow } from '../components/Eyebrow';
import { PlaceholderSwatch } from '../components/PlaceholderSwatch';
import { ScreenHeader } from '../components/ScreenHeader';
import { useAppState } from '../context/AppStateContext';
import { formatPrice } from '../data/mockData';
import { colors, fonts } from '../theme/tokens';
import type { RootTabParamList } from '../types';

type Props = BottomTabScreenProps<RootTabParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { client, advisor, feedItems, purchases } = useAppState();
  const homeFeedPreview = feedItems.slice(0, 2);
  const recentPurchase = purchases[0];

  return (
    <View style={styles.screen}>
      <ScreenHeader>
        <Eyebrow align="center" size={11}>
          Avenir Privé
        </Eyebrow>
      </ScreenHeader>

      <ScrollView contentContainerStyle={styles.content}>
        <View>
          <Text style={styles.greeting}>Good evening,</Text>
          <Text style={styles.clientName}>{client.name}</Text>
          <Eyebrow style={styles.memberSince} size={11} color={colors.clay}>
            Private Client since {client.memberSince}
          </Eyebrow>
        </View>

        <View style={styles.advisorCard}>
          <PlaceholderSwatch palette={advisor.palette} style={styles.advisorAvatar} />
          <View style={styles.advisorInfo}>
            <Eyebrow size={9.5}>Your Advisor</Eyebrow>
            <Text style={styles.advisorName}>{advisor.name}</Text>
            <Text style={styles.advisorTitle}>{advisor.title}</Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate('Messages')}
            style={({ pressed }) => [styles.messageButton, pressed && styles.messageButtonPressed]}
          >
            {({ pressed }) => (
              <Text style={[styles.messageButtonText, pressed && styles.messageButtonTextPressed]}>
                Message
              </Text>
            )}
          </Pressable>
        </View>

        <View>
          <View style={styles.sectionHeaderRow}>
            <Eyebrow size={10.5}>New For You</Eyebrow>
            <Pressable onPress={() => navigation.navigate('ForYou')}>
              <Text style={styles.viewAll}>View All</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.previewRow}>
            {homeFeedPreview.map((item) => (
              <Pressable key={item.id} onPress={() => navigation.navigate('ForYou')} style={styles.previewCard}>
                {item.imageUrl ? (
                  <Image source={{ uri: item.imageUrl }} style={styles.previewImage} />
                ) : (
                  <PlaceholderSwatch palette={item.palette} style={styles.previewImage} />
                )}
                <Text style={styles.previewName}>{item.name}</Text>
                <Text style={styles.previewPrice}>{formatPrice(item.price)}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View>
          <Eyebrow size={10.5} style={styles.recentlyLabel}>
            Recently Yours
          </Eyebrow>
          <View style={styles.recentCard}>
            {recentPurchase.imageUrl ? (
              <Image source={{ uri: recentPurchase.imageUrl }} style={styles.recentThumb} />
            ) : (
              <PlaceholderSwatch palette={recentPurchase.palette} style={styles.recentThumb} />
            )}
            <View style={styles.recentInfo}>
              <Text style={styles.recentName}>{recentPurchase.name}</Text>
              <Text style={styles.recentMeta}>
                {recentPurchase.date} · {formatPrice(recentPurchase.price)}
              </Text>
            </View>
          </View>
        </View>
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
    paddingTop: 28,
    paddingBottom: 32,
    gap: 36,
  },
  greeting: {
    fontFamily: fonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 26,
    color: colors.bark,
    marginBottom: 4,
  },
  clientName: {
    fontFamily: fonts.display,
    fontSize: 34,
    color: colors.obsidian,
    lineHeight: 36,
  },
  memberSince: {
    marginTop: 8,
    letterSpacing: 0.9,
  },
  advisorCard: {
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  advisorAvatar: {
    width: 52,
    height: 52,
    borderRadius: 999,
  },
  advisorInfo: {
    flex: 1,
    minWidth: 0,
  },
  advisorName: {
    fontFamily: fonts.display,
    fontSize: 19,
    color: colors.obsidian,
    marginTop: 2,
  },
  advisorTitle: {
    fontFamily: fonts.body,
    fontSize: 11.5,
    color: colors.bark,
  },
  messageButton: {
    borderWidth: 1,
    borderColor: colors.ink,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  messageButtonPressed: {
    backgroundColor: colors.ink,
  },
  messageButtonText: {
    fontFamily: fonts.body,
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.ink,
  },
  messageButtonTextPressed: {
    color: colors.paper,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  viewAll: {
    fontFamily: fonts.body,
    fontSize: 10.5,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.ink,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(42,38,34,0.12)',
  },
  previewRow: {
    gap: 14,
    paddingBottom: 4,
  },
  previewCard: {
    width: 140,
  },
  previewImage: {
    width: 140,
    height: 168,
  },
  previewName: {
    marginTop: 9,
    fontFamily: fonts.display,
    fontSize: 15,
    color: colors.obsidian,
    lineHeight: 18,
  },
  previewPrice: {
    fontFamily: fonts.body,
    fontSize: 11.5,
    color: colors.bark,
    marginTop: 2,
  },
  recentlyLabel: {
    marginBottom: 14,
  },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
  },
  recentThumb: {
    width: 64,
    height: 64,
  },
  recentInfo: {
    flex: 1,
    minWidth: 0,
  },
  recentName: {
    fontFamily: fonts.display,
    fontSize: 17,
    color: colors.obsidian,
    lineHeight: 20,
  },
  recentMeta: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.clay,
    marginTop: 3,
  },
});
