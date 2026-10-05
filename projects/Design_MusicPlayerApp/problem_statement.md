# Design a Music Player App

## Functional Requirements

- User can play and pause songs.
- User can create a playlist and add songs to it.
- User can play an entire playlist in different ways — sequential, random, or a custom order.
- The app supports multiple output devices — Bluetooth speaker, wired speaker, headphones, and so on.

## Non-functional Requirements

- The design should be easily scalable.
- New features (a new output device, a new way of playing songs from a playlist) should be easy to add without rewriting existing code.

## Scope note

The app does **not** implement Bluetooth, cable, or headphone audio itself. Each device comes with a **third-party API**, and the app only calls it. Making those APIs fit our code is the Adapter's job.

## Approach

- Bottom-up design: enums and models first, then third-party APIs and adapters, then factory and strategies, then managers, then the engine, facade, and application class.
- Output devices use the **Adapter** pattern, built by a **Factory**.
- Play order uses the **Strategy** pattern (Sequential / Random / Custom queue).
- Shared state lives in **Singleton** managers (`PlaylistManager`, `DeviceManager`, `StrategyManager`).
- `MusicPlayerFacade` is a **Facade** over engine, devices, strategies, and playlists.
- `MusicPlayerApplication` is the client-facing entry point.

## High-level Flow

```
User → MusicPlayerApplication → MusicPlayerFacade
          ├─ PlaylistManager  → Playlist → Songs
          ├─ StrategyManager  → PlayStrategy picks next / previous song
          └─ AudioEngine      → DeviceManager → Adapter → Third-party device API
```

## Docs & Code

- Design walkthrough + UML: [`design_docs.md`](./design_docs.md)
- Runnable TypeScript: `npm run demo:music-player`
