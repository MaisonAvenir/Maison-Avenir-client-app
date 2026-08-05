# Handoff: Maison Avenir Private Client App

## Overview
A private mobile app for Maison Avenir's best clients: view purchase history, message a dedicated client advisor 1:1, and browse/react to new-arrival recommendations picked for them by their advisor.

## About the Design Files
The files in this bundle (`Maison Avenir Client App.dc.html`, `ios-frame.jsx`) are **design references built in HTML** — an interactive prototype showing intended look, flow, and behavior. They are not production code to copy directly (they use a custom templating runtime, `<x-import>`, `<sc-if>`/`<sc-for>`, that only exists in this design tool). The task is to **recreate this design in the target codebase's environment** — React Native, SwiftUI, Kotlin/Compose, Flutter, whichever the mobile team already uses — following that codebase's existing patterns. If no mobile app codebase exists yet, React Native or Flutter are reasonable defaults for a single design shipping to iOS and Android.

## Fidelity
**High-fidelity.** Colors, type, spacing, and copy are final per the Maison Avenir design system. Treat hex values, font choices, and copy below as production-ready; recreate pixel-close using the target platform's native components.

## Design System Source
Built on the Maison Avenir Design System (`colors_and_type.css` token names referenced below). Warm-neutral palette, no pure black/white, square corners by default, hairline borders, no shadows at rest, no gradients/blur/emoji.

### Design Tokens
- Canvas: `#F4F1EC` — Paper: `#FAF7F2` — Bone: `#EDE7DD` — Stone (borders): `#C9C0B2` — Clay (tertiary text): `#A89E8C` — Bark (secondary text): `#6B6357` — Ink (primary text): `#2A2622` — Obsidian (headlines): `#1A1714`
- Persian Red (accent, sparingly): `#C24A36`, hover/press `#A33D2C`
- Fonts: Cormorant Garamond (display serif, headlines, italic for warmth/quotes) + Inter (UI/body/eyebrows)
- Eyebrows: Inter, 10–11px, uppercase, `letter-spacing: 0.18–0.22em`, color Clay
- Corners: square (0px) everywhere except inputs (4px max) and pills (999px, chips only)
- Borders: 1px solid Stone/hairline; no drop shadows at rest
- Motion: soft cross-fades only, ease `cubic-bezier(0.32,0.72,0.32,1)`, no bounce/spring/parallax

## Screens / Views
Bottom tab bar (5 tabs, icons: house / sparkle / chat-circle-dots / clock-counter-clockwise / user, Phosphor Thin), active tab tinted Persian Red `#C24A36`, inactive Clay `#A89E8C`.

### 1. Home
- Header: centered eyebrow "Avenir Privé" on Paper bg, hairline bottom border.
- Greeting block: italic Cormorant "Good evening," + large Cormorant client name + eyebrow "Private Client since {year}".
- Advisor card: Paper bg, hairline border, 52px circular avatar, advisor name (Cormorant) + title (Inter) + outline "Message" button (ink border/text, fills ink on hover, text inverts).
- "New For You" section: eyebrow label + "View All" link, horizontal-scroll row of 2 preview cards (140×168 image + name + price), tapping goes to For You tab.
- "Recently Yours" section: eyebrow label, single row card showing most recent purchase (64px thumbnail + name + date + price).

### 2. For You (recommendation feed)
- Header: centered eyebrow "For You".
- Card-by-card lookbook: one item at a time, 4:5 image, position counter top-right ("2 / 4"), material eyebrow + Cormorant item name overlaid bottom-left on image with a dark gradient scrim, italic advisor note below image ("Margaux thought of you…"), price, then two full-width buttons: "Not For Me" (outline) and "Save" (filled Persian Red).
- Tapping either button advances to the next item.
- Empty/done state: centered italic message "You're all caught up." + note that advisor will notify on new arrivals + chips listing any saved item names.

### 3. Messages
- Header: advisor avatar (38px circle) + name (Cormorant) + title (Inter), Paper bg.
- Scrollable thread: advisor bubbles left-aligned (Paper bg, hairline border), client bubbles right-aligned (Obsidian fill, Paper text), timestamp bottom-right of each bubble in muted tone.
- Composer: text input (cream fill, stone border, rounded 4px) + circular send button (Persian Red fill, up-arrow icon, darkens on hover).

### 4. History (Purchase History)
- Header: eyebrow "Purchase History" + summary line "{n} pieces · ${total} since {year}".
- Scrollable list rows: 48px thumbnail + item name (Cormorant) + date (Inter, muted) + price, right-aligned. Hairline divider between rows. Simple list depth (no receipts/reorder in this version).

### 5. Profile
- Centered: 84px avatar-style circle (client's own, currently reuses advisor's palette as placeholder), client name (Cormorant), "Private Client since {year}" eyebrow.
- "Materials You Love" section: wrapped chips (hairline border, Inter) — e.g. Brass, Linen, Oak, Ceramic. Currently static; should become editable preference tags.
- Full-width "Contact {advisor}" button (Obsidian fill, Persian Red on hover).
- "Sign Out" text link below.

## Interactions & Behavior
- Tab switching is instant (cross-fade recommended, ~240ms, no slide).
- For You feed: swipe-or-tap advances through an array of items; each item's save/pass choice is recorded per client per item.
- Messages: local optimistic send (append client bubble immediately, "Just now" timestamp) — real implementation needs a backend send + push notification to the advisor's console, and the advisor's replies pushed back to the client in real time.
- Home → tapping the advisor's "Message" button or a "New For You" card navigates to the corresponding tab.
- No loading/error/empty states beyond the For You "all caught up" state were designed — add per-platform loading skeletons and network-error states before shipping.

## State Management
Needed state/data model (currently hardcoded in the prototype for demo purposes):
- `client`: id, name, memberSince year, style preferences (materials/tags)
- `advisor`: id assigned to that client, name, title, avatar/photo
- `purchases[]`: id, item name, date, price, image — per client, chronological
- `feedItems[]`: id, item name, price, image, material, advisor note, and per-client reaction state (`saved` / `passed` / unseen) — this is the mechanism for "let clients know what's new that we think they'd like"
- `messages[]`: id, sender (advisor/client), text, timestamp, read state — needs real-time delivery (websocket/push) both directions
- Auth: this is a private, invite-only client app — needs real login (the prototype has a placeholder "Sign Out" link only)

## Assets
No photography was available — all product/avatar imagery in the prototype is a placeholder gradient swatch (warm brass/linen/oak/stone/ceramic/velvet tones) standing in for real product photography and advisor headshots. Replace every placeholder swatch with actual photography before shipping. Icons are Phosphor Icons, Thin weight, loaded from `https://unpkg.com/@phosphor-icons/web@2.1.1/src/thin/style.css` — use the same set (or the target app's existing icon library) for house/sparkle/chat/history/user/arrow-up glyphs.

## Files
- `Maison Avenir Client App.dc.html` — the full interactive prototype (all 5 screens, tab logic, feed advance logic, message send logic).
- `ios-frame.jsx` — iPhone device-frame chrome used only for presentation; not part of the app itself.
