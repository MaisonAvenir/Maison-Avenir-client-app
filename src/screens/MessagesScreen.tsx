import { ArrowUpIcon } from 'phosphor-react-native';
import React, { useRef } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Eyebrow } from '../components/Eyebrow';
import { PlaceholderSwatch } from '../components/PlaceholderSwatch';
import { ScreenHeader } from '../components/ScreenHeader';
import { useAppState } from '../context/AppStateContext';
import { colors, fonts } from '../theme/tokens';
import type { Message } from '../types';

export function MessagesScreen() {
  const { advisor, messages, draft, setDraft, sendMessage } = useAppState();
  const listRef = useRef<FlatList<Message>>(null);

  const renderItem = ({ item }: { item: Message }) => {
    const fromAdvisor = item.sender === 'advisor';
    return (
      <View style={[styles.bubbleRow, { justifyContent: fromAdvisor ? 'flex-start' : 'flex-end' }]}>
        <View
          style={[
            styles.bubble,
            fromAdvisor ? styles.advisorBubble : styles.clientBubble,
          ]}
        >
          <Text style={fromAdvisor ? styles.advisorText : styles.clientText}>{item.text}</Text>
          <Text style={fromAdvisor ? styles.advisorTime : styles.clientTime}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScreenHeader style={styles.header}>
        <PlaceholderSwatch palette={advisor.palette} style={styles.avatar} />
        <View>
          <Text style={styles.advisorName}>{advisor.name}</Text>
          <Eyebrow size={10.5} style={styles.advisorTitle}>
            {advisor.title}
          </Eyebrow>
        </View>
      </ScreenHeader>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={renderItem}
        contentContainerStyle={styles.thread}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={styles.composer}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder={`Write to ${advisor.name.split(' ')[0]}…`}
          placeholderTextColor={colors.clay}
          style={styles.input}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <Pressable
          onPress={sendMessage}
          style={({ pressed }) => [styles.sendButton, pressed && styles.sendButtonPressed]}
        >
          <ArrowUpIcon size={17} color={colors.paper} weight="thin" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 999,
  },
  advisorName: {
    fontFamily: fonts.display,
    fontSize: 17,
    color: colors.obsidian,
  },
  advisorTitle: {
    marginTop: 1,
    letterSpacing: 0,
    textTransform: 'none',
  },
  thread: {
    padding: 20,
    gap: 14,
  },
  bubbleRow: {
    flexDirection: 'row',
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  advisorBubble: {
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  clientBubble: {
    backgroundColor: colors.obsidian,
  },
  advisorText: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 19.5,
    color: colors.ink,
  },
  clientText: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 19.5,
    color: colors.paper,
  },
  advisorTime: {
    fontFamily: fonts.body,
    fontSize: 9.5,
    color: colors.clay,
    marginTop: 5,
    textAlign: 'right',
  },
  clientTime: {
    fontFamily: fonts.body,
    fontSize: 9.5,
    color: 'rgba(250,247,242,0.55)',
    marginTop: 5,
    textAlign: 'right',
  },
  composer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    backgroundColor: colors.paper,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.ink,
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.stone,
    borderRadius: 4,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: colors.persianRed,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sendButtonPressed: {
    backgroundColor: colors.persianRedPress,
  },
});
