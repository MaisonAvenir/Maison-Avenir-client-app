import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Eyebrow } from '../components/Eyebrow';
import { PlaceholderSwatch } from '../components/PlaceholderSwatch';
import { ScreenHeader } from '../components/ScreenHeader';
import { useAppState } from '../context/AppStateContext';
import { formatPrice } from '../data/mockData';
import { colors, fonts } from '../theme/tokens';

export function ForYouScreen() {
  const {
    advisor,
    feedItems,
    feedIndex,
    currentFeedItem,
    savedItems,
    reactToCurrentItem,
    isLoadingCustomerData,
    customerDataError,
  } = useAppState();
  const feedTotal = feedItems.length;
  const feedPos = Math.min(feedIndex + 1, feedTotal);
  const advisorFirstName = advisor.name.split(' ')[0];

  if (isLoadingCustomerData && feedItems.length === 0) {
    return (
      <View style={styles.screen}>
        <ScreenHeader>
          <Eyebrow align="center" size={11}>
            For You
          </Eyebrow>
        </ScreenHeader>
        <View style={styles.centered}>
          <ActivityIndicator color={colors.bark} />
        </View>
      </View>
    );
  }

  if (customerDataError) {
    return (
      <View style={styles.screen}>
        <ScreenHeader>
          <Eyebrow align="center" size={11}>
            For You
          </Eyebrow>
        </ScreenHeader>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{customerDataError}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader>
        <Eyebrow align="center" size={11}>
          For You
        </Eyebrow>
      </ScreenHeader>

      <ScrollView contentContainerStyle={styles.content}>
        {currentFeedItem ? (
          <View style={styles.card}>
            <Text style={styles.position}>
              {feedPos} / {feedTotal}
            </Text>
            <View style={styles.imageWrap}>
              {currentFeedItem.imageUrl ? (
                <Image source={{ uri: currentFeedItem.imageUrl }} style={StyleSheet.absoluteFill} />
              ) : (
                <PlaceholderSwatch palette={currentFeedItem.palette} style={StyleSheet.absoluteFill} />
              )}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.32)']}
                locations={[0.5, 1]}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.imageCaption}>
                <Eyebrow size={10} color="rgba(250,247,242,0.85)">
                  {currentFeedItem.material}
                </Eyebrow>
                <Text style={styles.itemName}>{currentFeedItem.name}</Text>
              </View>
            </View>
            <Text style={styles.note}>"{currentFeedItem.note}"</Text>
            <Text style={styles.price}>{formatPrice(currentFeedItem.price)}</Text>
            <View style={styles.actions}>
              <Pressable
                onPress={() => reactToCurrentItem('passed')}
                style={({ pressed }) => [styles.notForMeButton, pressed && styles.notForMeButtonPressed]}
              >
                {({ pressed }) => (
                  <Text style={[styles.notForMeText, pressed && styles.notForMeTextPressed]}>Not For Me</Text>
                )}
              </Pressable>
              <Pressable
                onPress={() => reactToCurrentItem('saved')}
                style={({ pressed }) => [styles.saveButton, pressed && styles.saveButtonPressed]}
              >
                <Text style={styles.saveText}>Save</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.doneWrap}>
            <Text style={styles.doneTitle}>You're all caught up.</Text>
            <Text style={styles.doneSubtitle}>{advisorFirstName} will let you know when something new arrives.</Text>
            {savedItems.length > 0 && (
              <View style={styles.savedChips}>
                {savedItems.map((item) => (
                  <View key={item.id} style={styles.savedChip}>
                    <Text style={styles.savedChipText}>{item.name}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
  screen: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  content: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 28,
    paddingBottom: 32,
  },
  card: {
    flex: 1,
  },
  position: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.clay,
    textAlign: 'right',
    marginBottom: 10,
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 4 / 5,
    overflow: 'hidden',
  },
  imageCaption: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  itemName: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: colors.paper,
    marginTop: 4,
  },
  note: {
    fontFamily: fonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 15,
    color: colors.bark,
    lineHeight: 22,
    paddingTop: 16,
    paddingHorizontal: 2,
  },
  price: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.obsidian,
    paddingVertical: 8,
    paddingHorizontal: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 'auto',
    paddingTop: 12,
  },
  notForMeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.ink,
    paddingVertical: 15,
    alignItems: 'center',
  },
  notForMeButtonPressed: {
    backgroundColor: colors.ink,
  },
  notForMeText: {
    fontFamily: fonts.body,
    fontSize: 11,
    letterSpacing: 1.76,
    textTransform: 'uppercase',
    color: colors.ink,
  },
  notForMeTextPressed: {
    color: colors.paper,
  },
  saveButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.persianRed,
    backgroundColor: colors.persianRed,
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveButtonPressed: {
    backgroundColor: colors.persianRedPress,
    borderColor: colors.persianRedPress,
  },
  saveText: {
    fontFamily: fonts.body,
    fontSize: 11,
    letterSpacing: 1.76,
    textTransform: 'uppercase',
    color: colors.paper,
  },
  doneWrap: {
    margin: 'auto',
    alignItems: 'center',
    padding: 40,
  },
  doneTitle: {
    fontFamily: fonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 22,
    color: colors.bark,
    marginBottom: 10,
    textAlign: 'center',
  },
  doneSubtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.clay,
    lineHeight: 21,
    textAlign: 'center',
  },
  savedChips: {
    marginTop: 28,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  savedChip: {
    borderWidth: 1,
    borderColor: colors.stone,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  savedChipText: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.ink,
  },
});
