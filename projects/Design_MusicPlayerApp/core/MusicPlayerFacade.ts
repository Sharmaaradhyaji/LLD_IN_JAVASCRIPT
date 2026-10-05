/**
 * MusicPlayerFacade — SINGLETON + FACADE
 *
 * Pattern: Facade
 *   Playing a song touches four subsystems: AudioEngine, DeviceManager,
 *   StrategyManager, and PlaylistManager. The facade hides them behind
 *   simple calls like playNext() so callers never coordinate them by hand.
 *
 * Pattern: Singleton
 *   There is one player per app — one current playlist, one active
 *   strategy, one engine. Two facades would fight over the same speaker.
 */
import { DeviceType } from "../enums/DeviceType";
import { StrategyType } from "../enums/StrategyType";
import { DeviceManager } from "../managers/DeviceManager";
import { PlaylistManager } from "../managers/PlaylistManager";
import { StrategyManager } from "../managers/StrategyManager";
import { Playlist } from "../models/Playlist";
import { Song } from "../models/Song";
import { PlayStrategy } from "../strategies/PlayStrategy";
import { AudioEngine } from "./AudioEngine";

export class MusicPlayerFacade {
  private static instance: MusicPlayerFacade | null = null;

  private readonly audioEngine = new AudioEngine();
  private currentPlaylist: Playlist | null = null;
  private playStrategy: PlayStrategy = StrategyManager.getInstance().getStrategy(
    StrategyType.SEQUENTIAL,
  );

  private constructor() {}

  static getInstance(): MusicPlayerFacade {
    if (!MusicPlayerFacade.instance) {
      MusicPlayerFacade.instance = new MusicPlayerFacade();
    }
    return MusicPlayerFacade.instance;
  }

  connectDevice(deviceType: DeviceType): void {
    DeviceManager.getInstance().connect(deviceType);
  }

  setPlayStrategy(strategyType: StrategyType): void {
    this.playStrategy = StrategyManager.getInstance().getStrategy(strategyType);
    // Works in either order: switching strategy re-applies the loaded playlist.
    if (this.currentPlaylist) {
      this.playStrategy.setPlaylist(this.currentPlaylist);
    }
    console.log(`[Player] Strategy set to ${strategyType}`);
  }

  loadPlaylist(playlistName: string): void {
    this.currentPlaylist = PlaylistManager.getInstance().getPlaylist(playlistName);
    this.playStrategy.setPlaylist(this.currentPlaylist);
    console.log(
      `[Player] Loaded playlist "${playlistName}" (${this.currentPlaylist.getSize()} songs)`,
    );
  }

  playSong(song: Song): void {
    const device = DeviceManager.getInstance().getOutputDevice();
    this.audioEngine.play(device, song);
  }

  pauseSong(song: Song): void {
    this.audioEngine.pause(song);
  }

  playAllTracks(): void {
    this.requirePlaylist();
    while (this.playStrategy.hasNext()) {
      this.playSong(this.playStrategy.next());
    }
    console.log("[Player] Reached the end of the playlist");
  }

  playNextTrack(): void {
    this.requirePlaylist();
    if (!this.playStrategy.hasNext()) {
      console.log("[Player] No next track");
      return;
    }
    this.playSong(this.playStrategy.next());
  }

  playPreviousTrack(): void {
    this.requirePlaylist();
    if (!this.playStrategy.hasPrevious()) {
      console.log("[Player] No previous track");
      return;
    }
    this.playSong(this.playStrategy.previous());
  }

  enqueueNext(song: Song): void {
    this.playStrategy.addToNext(song);
    console.log(`[Player] Queued ${song.toString()}`);
  }

  private requirePlaylist(): void {
    if (!this.currentPlaylist) {
      throw new Error("No playlist loaded. Call loadPlaylist() first.");
    }
  }
}
