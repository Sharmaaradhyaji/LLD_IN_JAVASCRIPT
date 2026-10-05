/**
 * RandomPlayStrategy — shuffles without repeating a song until all have played.
 *
 * Pattern: Strategy (concrete)
 *
 * Keeps a history of played songs so previous() returns what the user
 * actually heard, not another random pick.
 */
import { Playlist } from "../models/Playlist";
import { Song } from "../models/Song";
import { PlayStrategy } from "./PlayStrategy";

export class RandomPlayStrategy extends PlayStrategy {
  private remaining: Song[] = [];
  private history: Song[] = [];

  setPlaylist(playlist: Playlist): void {
    this.remaining = [...playlist.getSongs()];
    this.history = [];
  }

  hasNext(): boolean {
    return this.remaining.length > 0;
  }

  next(): Song {
    if (!this.hasNext()) {
      throw new Error("Every song in the playlist has been played.");
    }
    const pick = Math.floor(Math.random() * this.remaining.length);
    const [song] = this.remaining.splice(pick, 1);
    this.history.push(song);
    return song;
  }

  hasPrevious(): boolean {
    return this.history.length > 1;
  }

  previous(): Song {
    if (!this.hasPrevious()) {
      throw new Error("No previous song in the shuffle history.");
    }
    // The current song goes back into the pool so it can still come up later.
    const current = this.history.pop() as Song;
    this.remaining.push(current);
    return this.history[this.history.length - 1];
  }
}
