# AI Gym Trainer

A polished, theme-aware fitness companion built with Expo Router. It includes a tabbed workout experience, an AI coach chat UI, profile management, and a smooth authentication flow.

## What’s Included

- Home dashboard with stats, workout card, and daily AI tip
- AI Coach chat UI with quick prompts
- Workouts list with weekly calendar chips
- Profile screen with theme switching
- Auth screens (login + register) with gradient backgrounds
- Light and dark mode support

## Screens & Routes

- `/(tabs)/index` – Home dashboard
- `/(tabs)/coach` – AI Coach
- `/(tabs)/workouts` – Workouts
- `/(tabs)/profile` – Profile
- `/auth/login` – Login
- `/auth/register` – Register

## Tech Stack

- Expo + Expo Router
- React Native
- TypeScript
- `expo-linear-gradient` for backgrounds
- `@expo/vector-icons` for icons

## Getting Started

1. Install dependencies

```bash
npm install
```

2. Start the app

```bash
npm run start
```

## Project Structure

- `app/` – File-based routes and screens
- `src/components/` – Reusable UI components
- `src/context/` – Theme context and providers
- `src/theme/` – Theme colors and typography
- `constants/` – Shared constants

## Theming

Theme state lives in `src/context/ThemeContext.tsx`. Colors are defined in `src/theme/color.ts`. Gradients are applied per screen and in `src/components/ScreenWrapper.tsx`.

## Notes

- The auth screens are UI-only by default. Wire them to your backend or auth provider as needed.
- To change the initial route (auth vs tabs), update `app/_layout.tsx`.
