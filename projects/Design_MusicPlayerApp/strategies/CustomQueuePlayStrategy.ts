/**
 * CustomQueuePlayStrategy — queued songs first, then the playlist in order.
 *
 * Pattern: Strategy (concrete)
 *
 * The only strategy that supports addToNext(). Like "Add to queue" in
 * Spotify: queued songs jump ahead, then normal order resumes.
 */
import { Playlist } from "../models/Playlist";
import { Song } from "../models/Song";
import { PlayStrategy } from "./PlayStrategy";

export class CustomQueuePlayStrategy extends PlayStrategy {
  private playlist: Playlist | null = null;
  private currentIndex = -1;
  private queue: Song[] = [];
  private history: Song[] = [];

  setPlaylist(playlist: Playlist): void {
    this.playlist = playlist;
    this.currentIndex = -1;
    this.queue = [];
    this.history = [];
  }

  addToNext(song: Song): void {
    this.queue.push(song);
  }

  hasNext(): boolean {
    const playlistHasMore =
      this.playlist !== null && this.currentIndex + 1 < this.playlist.getSize();
    return this.queue.length > 0 || playlistHasMore;
  }

  next(): Song {
    if (!this.hasNext()) {
      throw new Error("Queue and playlist are both finished.");
    }

    let song: Song;
    if (this.queue.length > 0) {
      song = this.queue.shift() as Song;
    } else {
      this.currentIndex++;
      song = (this.playlist as Playlist).getSongs()[this.currentIndex];
    }

    this.history.push(song);
    return song;
  }

  hasPrevious(): boolean {
    return this.history.length > 1;
  }

  previous(): Song {
    if (!this.hasPrevious()) {
      throw new Error("No previous song.");
    }
    this.history.pop();
    return this.history[this.history.length - 1];
  }
}
