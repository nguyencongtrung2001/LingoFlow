export type PartOfSpeech = "NOUN" | "VERB" | "ADJECTIVE" | "ADVERB" | "PHRASE";

export interface Word {
  id: number;
  word: string;
  meaning: string;
  phonetic?: string | null;
  pos: PartOfSpeech;
  example?: string | null;
  image?: string | null;
  learned: boolean;
}

export interface FolderDetail {
  id: string;
  name: string;
  desc: string;
  words: Word[];
}
