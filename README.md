# z-416

A phone app that points at your friend.

Needs [z-416-server](https://github.com/Daniel-231/z-416-server) running.

## Setup

```bash
npm install
```

`.env`:

```dotenv
EXPO_PUBLIC_API_URL=http://<your-lan-ip>:5000
EXPO_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

```bash
npx expo start
```

Use real phones. Simulators don't have a compass.
