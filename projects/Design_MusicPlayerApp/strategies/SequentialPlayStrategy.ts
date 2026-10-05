/**
 * SequentialPlayStrategy — plays songs in playlist order.
 *
 * Pattern: Strategy (concrete)
 */
import { Playlist } from "../models/Playlist";
import { Song } from "../models/Song";
import { PlayStrategy } from "./PlayStrategy";

export class SequentialPlayStrategy extends PlayStrategy {
  private playlist: Playlist | null = null;
  private currentIndex = -1;

  setPlaylist(playlist: Playlist): void {
    this.playlist = playlist;
    this.currentIndex = -1;
  }

  hasNext(): boolean {
    return this.playlist !== null && this.currentIndex + 1 < this.playlist.getSize();
  }

  next(): Song {
    if (!this.playlist || !this.hasNext()) {
      throw new Error("No next song in the playlist.");
    }
    this.currentIndex++;
    return this.playlist.getSongs()[this.currentIndex];
  }

  hasPrevious(): boolean {
    return this.currentIndex > 0;
  }

  previous(): Song {
    if (!this.playlist || !this.hasPrevious()) {
      throw new Error("No previous song in the playlist.");
    }
    this.currentIndex--;
    return this.playlist.getSongs()[this.currentIndex];
  }
}
