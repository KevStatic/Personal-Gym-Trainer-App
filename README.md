# AI Gym Trainer

A polished, theme-aware fitness companion built with Expo Router. It includes a tabbed workout experience, an AI coach chat UI, profile management, and a smooth authentication flow.

## What’s Included

- Home dashboard with stats, workout card, and daily AI tip
- AI Coach chat UI with quick prompts
- Workouts list with weekly calendar chips
- Profile screen with theme switching
- Auth screens (login + register) with gradient backgrounds
- Light and dark mode support
- Supabase-backed auth integration (via REST API)

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

## Supabase Setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env` and add values:

```bash
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
# or EXPO_PUBLIC_SUPABASE_KEY=... (new Supabase naming)
```

3. Open Supabase SQL Editor and run:

```sql
-- contents of supabase/schema.sql
```

4. In Supabase Auth settings, choose whether email confirmation is required.

## Project Structure

- `app/` – File-based routes and screens
- `src/components/` – Reusable UI components
- `src/context/` – Theme context and providers
- `src/theme/` – Theme colors and typography
- `constants/` – Shared constants

## Theming

Theme state lives in `src/context/ThemeContext.tsx`. Colors are defined in `src/theme/color.ts`. Gradients are applied per screen and in `src/components/ScreenWrapper.tsx`.

## Notes

- Auth now uses Supabase Auth endpoints in `src/services/supabase/auth.ts`.
- Workout data service stubs are in `src/services/supabase/workouts.ts` for future use.
- To change the initial route (auth vs tabs), update `app/_layout.tsx`.
