declare interface ILibraryEntry {
  id: string;
  chapterNumber: number;
  chapterName: string;
  verseStart: number;
  verseEnd: number;
  timestamp: number;
}

declare interface ILibrarySection {
  title: string;
  data: ILibraryEntry[];
}