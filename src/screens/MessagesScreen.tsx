import { ArrowUpIcon } from 'phosphor-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
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

/** Where "Message" notes get emailed — there's no in-app inbox, this opens the customer's mail app. */
const ADVISOR_EMAIL = 'jenrhoude@gmail.com';

export function MessagesScreen() {
  const { advisor, client } = useAppState();
  const [draft, setDraft] = useState('');
  const advisorFirstName = advisor.name.split(' ')[0];

  const handleSend = async () => {
    const text = draft.trim();
    if (!text) return;

    const subject = encodeURIComponent(`Message from ${client.name} — Avenir Privé`);
    const body = encodeURIComponent(`${text}\n\n— ${client.name}`);
    const url = `mailto:${ADVISOR_EMAIL}?subject=${subject}&body=${body}`;

    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert('Could not open Mail', `Please email ${advisorFirstName} directly at ${ADVISOR_EMAIL}.`);
      return;
    }
    await Linking.openURL(url);
    setDraft('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScreenHeader style={styles.header}>
        {advisor.photo ? (
          <Image source={advisor.photo} style={styles.avatar} />
        ) : (
          <PlaceholderSwatch palette={advisor.palette} style={styles.avatar} />
        )}
        <View>
          <Text style={styles.advisorName}>{advisor.name}</Text>
          <Eyebrow size={10.5} style={styles.advisorTitle}>
            {advisor.title}
          </Eyebrow>
        </View>
      </ScreenHeader>

      <View style={styles.body}>
        <Text style={styles.hint}>
          Write a note below, then tap send — it opens your email app with the message ready to go to{' '}
          {advisorFirstName}.
        </Text>
      </View>

      <View style={styles.composer}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder={`Write to ${advisorFirstName}…`}
          placeholderTextColor={colors.clay}
          style={styles.input}
          multiline
        />
        <Pressable
          onPress={handleSend}
          disabled={!draft.trim()}
          style={({ pressed }) => [
            styles.sendButton,
            pressed && styles.sendButtonPressed,
            !draft.trim() && styles.sendButtonDisabled,
          ]}
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
  body: {
    flex: 1,
    padding: 24,
  },
  hint: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 20,
    color: colors.bark,
  },
  composer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    backgroundColor: colors.paper,
    alignItems: 'flex-end',
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
    maxHeight: 120,
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
  sendButtonDisabled: {
    opacity: 0.4,
  },
});
