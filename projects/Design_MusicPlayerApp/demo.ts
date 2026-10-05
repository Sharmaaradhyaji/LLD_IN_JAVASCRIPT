/**
 * Music Player demo — walks every functional requirement.
 *
 * Run: npm run demo:music-player
 *
 *   1. Build a song library and playlists         (Singleton managers)
 *   2. Connect a device                           (Factory + Adapter)
 *   3. Play / pause / resume a single song        (Facade → AudioEngine)
 *   4. Play a playlist sequentially               (Strategy)
 *   5. Switch device + shuffle                    (Adapter + Strategy swap)
 *   6. Custom queue on headphones                 (Strategy with addToNext)
 */
import { DeviceType } from "./enums/DeviceType";
import { StrategyType } from "./enums/StrategyType";
import { MusicPlayerApplication } from "./MusicPlayerApplication";

function main(): void {
  console.log("=== Music Player App — LLD Demo ===\n");

  const app = MusicPlayerApplication.getInstance();

  console.log("--- 1) Song library + playlists ---");
  app.createSongInLibrary("Kesariya", "Arijit Singh", "/music/kesariya.mp3");
  app.createSongInLibrary("Chaiyya Chaiyya", "Sukhwinder Singh", "/music/chaiyya.mp3");
  app.createSongInLibrary("Tum Hi Ho", "Arijit Singh", "/music/tum_hi_ho.mp3");
  app.createSongInLibrary("Kun Faya Kun", "A.R. Rahman", "/music/kun_faya_kun.mp3");
  app.createSongInLibrary("Malang", "Ved Sharma", "/music/malang.mp3");

  app.createPlaylist("Bollywood Vibes");
  app.addSongToPlaylist("Bollywood Vibes", "Kesariya");
  app.addSongToPlaylist("Bollywood Vibes", "Chaiyya Chaiyya");
  app.addSongToPlaylist("Bollywood Vibes", "Tum Hi Ho");
  app.addSongToPlaylist("Bollywood Vibes", "Kun Faya Kun");
  console.log('  Created "Bollywood Vibes" with 4 songs');

  console.log("\n--- 2) Connect Bluetooth speaker (Factory builds the Adapter) ---");
  app.connectAudioDevice(DeviceType.BLUETOOTH);

  console.log("\n--- 3) Play, pause, resume a single song ---");
  app.playSingleSong("Malang");
  app.pauseCurrentSong("Malang");
  app.playSingleSong("Malang");

  console.log("\n--- 4) Play the whole playlist sequentially ---");
  app.selectPlayStrategy(StrategyType.SEQUENTIAL);
  app.loadPlaylist("Bollywood Vibes");
  app.playAllTracksInPlaylist();

  console.log("\n--- 5) Switch to wired speaker + shuffle ---");
  app.connectAudioDevice(DeviceType.WIRED);
  app.selectPlayStrategy(StrategyType.RANDOM);
  app.playNextTrackInPlaylist();
  app.playNextTrackInPlaylist();
  app.playNextTrackInPlaylist();
  console.log("  User presses Previous:");
  app.playPreviousTrackInPlaylist();

  console.log("\n--- 6) Headphones + custom queue ---");
  app.connectAudioDevice(DeviceType.HEADPHONES);
  app.selectPlayStrategy(StrategyType.CUSTOM_QUEUE);
  app.queueSongNext("Malang");
  app.queueSongNext("Tum Hi Ho");
  app.playNextTrackInPlaylist(); // Malang (queued)
  app.playNextTrackInPlaylist(); // Tum Hi Ho (queued)
  app.playNextTrackInPlaylist(); // Kesariya (playlist resumes)
  app.playPreviousTrackInPlaylist();

  console.log("\n--- 7) Queueing is only allowed in CUSTOM_QUEUE ---");
  app.selectPlayStrategy(StrategyType.SEQUENTIAL);
  try {
    app.queueSongNext("Malang");
  } catch (error) {
    console.log(`  Error: ${(error as Error).message}`);
  }

  console.log("\n=== Demo complete ===");
}

main();
