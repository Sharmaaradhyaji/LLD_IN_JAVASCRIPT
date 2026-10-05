/**
 * Playlist — a named, ordered list of songs.
 *
 * It only stores songs. The ORDER they are played in is decided by a
 * PlayStrategy, so the same playlist can be played sequentially, randomly,
 * or with a custom queue without changing this class.
 */
import { Song } from "./Song";

export class Playlist {
  private readonly songs: Song[] = [];

  constructor(private readonly name: string) {}

  getName(): string {
    return this.name;
  }

  addSong(song: Song): void {
    this.songs.push(song);
  }

  getSongs(): readonly Song[] {
    return this.songs;
  }

  getSize(): number {
    return this.songs.length;
  }
}
