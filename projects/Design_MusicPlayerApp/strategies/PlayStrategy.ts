/**
 * PlayStrategy — decides the ORDER songs are played in.
 *
 * Pattern: Strategy (abstract strategy)
 *
 * Why:
 *   "Sequential", "Random", and "Custom queue" are different algorithms
 *   for the same job: pick the next / previous song. Each lives in its own
 *   class, so a new mode (e.g. Repeat-One) is a new class, not a new
 *   if/else inside the player.
 */
import { Playlist } from "../models/Playlist";
import { Song } from "../models/Song";

export abstract class PlayStrategy {
  /** Resets internal position so playback starts from the beginning. */
  abstract setPlaylist(playlist: Playlist): void;

  abstract hasNext(): boolean;
  abstract next(): Song;

  abstract hasPrevious(): boolean;
  abstract previous(): Song;

  /**
   * Queue a song to play next. Only queue-based strategies support this;
   * others fail loudly instead of silently ignoring the request.
   */
  addToNext(_song: Song): void {
    throw new Error(
      `${this.constructor.name} does not support queueing. Switch to CUSTOM_QUEUE first.`,
    );
  }
}
