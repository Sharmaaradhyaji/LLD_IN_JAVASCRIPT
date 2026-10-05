/**
 * PlaylistManager — SINGLETON
 *
 * Pattern: Singleton
 *
 * Why:
 *   Every part of the app must see the SAME playlists. If two screens had
 *   their own manager, a song added on one would be missing on the other.
 */
import { Playlist } from "../models/Playlist";
import { Song } from "../models/Song";

export class PlaylistManager {
  private static instance: PlaylistManager | null = null;
  private readonly playlists = new Map<string, Playlist>();

  private constructor() {}

  static getInstance(): PlaylistManager {
    if (!PlaylistManager.instance) {
      PlaylistManager.instance = new PlaylistManager();
    }
    return PlaylistManager.instance;
  }

  createPlaylist(name: string): Playlist {
    if (this.playlists.has(name)) {
      throw new Error(`Playlist "${name}" already exists.`);
    }
    const playlist = new Playlist(name);
    this.playlists.set(name, playlist);
    return playlist;
  }

  addSongToPlaylist(playlistName: string, song: Song): void {
    this.getPlaylist(playlistName).addSong(song);
  }

  getPlaylist(name: string): Playlist {
    const playlist = this.playlists.get(name);
    if (!playlist) {
      throw new Error(`Playlist "${name}" not found.`);
    }
    return playlist;
  }
}
