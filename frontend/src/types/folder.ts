export type LanguageCode = "en" | "zh" | "ja" | "ko" | "fr" | "vi" | "other";

export type PartOfSpeech = "Noun" | "Verb" | "Adjective" | "Adverb" | "Phrase";

export interface Word {
  id: number;
  word: string;
  meaning: string;
  phonetic?: string;
  pos: PartOfSpeech;
  example?: string;
  image?: string;
  learned: boolean;
}

export interface FolderDetail {
  id: string;
  name: string;
  desc: string;
  language: LanguageCode;
  words: Word[];
}
