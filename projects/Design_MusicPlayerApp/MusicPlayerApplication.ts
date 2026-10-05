/**
 * MusicPlayerApplication — SINGLETON entry point
 *
 * Pattern: Singleton
 *   One app instance owns one song library.
 *
 * Role:
 *   The client-facing API. It works with song titles and playlist names
 *   (what a UI would send), owns the song library, and delegates:
 *     - playlist storage → PlaylistManager
 *     - playback         → MusicPlayerFacade
 *
 * Why separate from the facade?
 *   The facade simplifies the PLAYBACK subsystem and works with Song
 *   objects. This class handles the LIBRARY and turns names into Songs.
 */
import { MusicPlayerFacade } from "./core/MusicPlayerFacade";
import { DeviceType } from "./enums/DeviceType";
import { StrategyType } from "./enums/StrategyType";
import { PlaylistManager } from "./managers/PlaylistManager";
import { Song } from "./models/Song";

export class MusicPlayerApplication {
  private static instance: MusicPlayerApplication | null = null;
  private readonly songLibrary: Song[] = [];

  private constructor() {}

  static getInstance(): MusicPlayerApplication {
    if (!MusicPlayerApplication.instance) {
      MusicPlayerApplication.instance = new MusicPlayerApplication();
    }
    return MusicPlayerApplication.instance;
  }

  // ----- Library + playlists -----

  createSongInLibrary(title: string, artist: string, filePath: string): Song {
    const song = new Song(title, artist, filePath);
    this.songLibrary.push(song);
    return song;
  }

  createPlaylist(playlistName: string): void {
    PlaylistManager.getInstance().createPlaylist(playlistName);
  }

  addSongToPlaylist(playlistName: string, songTitle: string): void {
    PlaylistManager.getInstance().addSongToPlaylist(playlistName, this.findSong(songTitle));
  }

  // ----- Playback (delegated to the facade) -----

  connectAudioDevice(deviceType: DeviceType): void {
    MusicPlayerFacade.getInstance().connectDevice(deviceType);
  }

  selectPlayStrategy(strategyType: StrategyType): void {
    MusicPlayerFacade.getInstance().setPlayStrategy(strategyType);
  }

  loadPlaylist(playlistName: string): void {
    MusicPlayerFacade.getInstance().loadPlaylist(playlistName);
  }

  playSingleSong(songTitle: string): void {
    MusicPlayerFacade.getInstance().playSong(this.findSong(songTitle));
  }

  pauseCurrentSong(songTitle: string): void {
    MusicPlayerFacade.getInstance().pauseSong(this.findSong(songTitle));
  }

  playAllTracksInPlaylist(): void {
    MusicPlayerFacade.getInstance().playAllTracks();
  }

  playNextTrackInPlaylist(): void {
    MusicPlayerFacade.getInstance().playNextTrack();
  }

  playPreviousTrackInPlaylist(): void {
    MusicPlayerFacade.getInstance().playPreviousTrack();
  }

  queueSongNext(songTitle: string): void {
    MusicPlayerFacade.getInstance().enqueueNext(this.findSong(songTitle));
  }

  private findSong(title: string): Song {
    const song = this.songLibrary.find((s) => s.getTitle() === title);
    if (!song) {
      throw new Error(`Song "${title}" not found in the library.`);
    }
    return song;
  }
}
