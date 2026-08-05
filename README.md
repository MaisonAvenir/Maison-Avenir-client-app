# Maison Avenir — Private Client App

A private mobile app for Maison Avenir's best clients: view purchase history,
message a dedicated client advisor 1:1, and browse/react to new-arrival
recommendations picked for them by their advisor.

Built with [Expo](https://expo.dev) (React Native + TypeScript) so a single
codebase ships to iOS and Android.

## Getting started

```bash
npm install
npm start        # opens the Expo dev tools; scan the QR code with Expo Go
npm run ios      # requires macOS + Xcode
npm run android  # requires an Android emulator or device
npm run web      # runs in the browser (handy for quick UI checks)
```

## Structure

```
App.tsx                   entry point: loads fonts, providers, navigation
src/
  theme/tokens.ts          Maison Avenir design tokens (color, type, spacing)
  types/                   shared TypeScript types (Client, Advisor, Message, ...)
  data/                    mock data + palette definitions (swap for a real API)
  context/AppStateContext  in-memory state: feed reactions, messages, composer draft
  components/              shared UI: Eyebrow, ScreenHeader, PlaceholderSwatch
  navigation/RootTabs.tsx  5-tab bottom navigator (Home / For You / Messages / History / Profile)
  screens/                 one file per tab
design/
  handoff/                 original interactive HTML design prototype + screenshots
  *.zip                    original design handoff package
```

## Design system

Warm-neutral palette, no pure black/white, square corners by default, hairline
borders, no shadows at rest, no gradients/blur/emoji. See `src/theme/tokens.ts`
for the exact tokens (Canvas/Paper/Bone/Stone/Clay/Bark/Ink/Obsidian + Persian
Red accent) and `design/handoff/README.md` for the full design spec this app
was built from.

## Known gaps before shipping

These are called out in the original design handoff and are not yet solved
here — this app currently runs entirely on local mock data:

- **Auth**: this is meant to be an invite-only private client app; there's no
  real login yet, just a placeholder "Sign Out" link.
- **Backend**: `client`, `advisor`, `purchases`, `feedItems`, and `messages`
  are hardcoded in `src/data/mockData.ts`. Replace with real API calls /
  a data layer — the shapes in `src/types/index.ts` are meant to carry over.
- **Real-time messaging**: sending a message is a local optimistic append
  only. Needs a real backend send + push notification to the advisor's
  console, and the advisor's replies pushed back in real time (websocket or
  push).
- **Photography**: every product/avatar image is a gradient placeholder
  (`src/components/PlaceholderSwatch.tsx`) standing in for real product
  photography and advisor headshots.
- **Editable preferences**: "Materials You Love" chips on Profile are
  currently a static list from mock data; the design calls for these to
  become editable preference tags.
- **Loading/error/empty states**: only the For You "all caught up" empty
  state was designed. Add loading skeletons and network-error states per
  screen before shipping.
