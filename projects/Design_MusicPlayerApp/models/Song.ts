/**
 * Song — pure data model.
 *
 * Knows nothing about devices, playlists, or playback order.
 * Every other layer passes Songs around.
 */
export class Song {
  constructor(
    private readonly title: string,
    private readonly artist: string,
    private readonly filePath: string,
  ) {}

  getTitle(): string {
    return this.title;
  }

  getArtist(): string {
    return this.artist;
  }

  getFilePath(): string {
    return this.filePath;
  }

  toString(): string {
    return `"${this.title}" by ${this.artist}`;
  }
}
