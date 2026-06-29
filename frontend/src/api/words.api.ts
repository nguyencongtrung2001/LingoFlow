import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`,
  withCredentials: true,
});

export type PartOfSpeech = "NOUN" | "VERB" | "ADJECTIVE" | "ADVERB" | "PHRASE";

export interface Word {
  id: number;
  word: string;
  meaning: string;
  phonetic?: string | null;
  pos: PartOfSpeech;
  example?: string | null;
  image?: string | null;
  folderId: number;
  createdAt: string;
  updatedAt: string;
  learned: boolean;
}

export type CreateWordInput = Omit<Word, "id" | "createdAt" | "updatedAt" | "learned"> & { learned?: boolean };
export type UpdateWordInput = Partial<CreateWordInput>;

export interface ExcelWordInput {
  Word: string;
  Meaning: string;
  Pos?: string;
  Phonetic?: string;
  Example?: string;
}

export const getWordsByFolder = async (folderId: number): Promise<Word[]> => {
  const res = await api.get(`/tu-vung/thu-muc/${folderId}`);
  return res.data;
};

export const createWord = async (data: CreateWordInput): Promise<Word> => {
  const res = await api.post("/tu-vung", data);
  return res.data;
};

export const createMultipleWords = async (folderId: number, wordsArray: ExcelWordInput[]): Promise<Word[]> => {
  const res = await api.post("/tu-vung/batch", { folderId, wordsArray });
  return res.data;
};

export const updateWord = async (id: number, data: UpdateWordInput): Promise<Word> => {
  const res = await api.put(`/tu-vung/${id}`, data);
  return res.data;
};

export const deleteWord = async (id: number): Promise<void> => {
  await api.delete(`/tu-vung/${id}`);
};

export interface StudySessionDetailInput {
  wordId: number;
  isCorrect: boolean;
  userAnswer?: string;
  expectedAnswer?: string;
}

export interface StudySessionInput {
  folderId: number;
  mode: "FLASHCARD" | "QUIZ" | "MATCH" | "WRITE";
  totalWords: number;
  correctCount: number;
  accuracy: number;
  timeSeconds: number;
  maxStreak?: number;
  details: StudySessionDetailInput[];
}

export const saveStudySession = async (data: StudySessionInput) => {
  const res = await api.post("/tu-vung/phien-hoc", data);
  return res.data;
};

export const getWordsSequential = async (folderId: number, page: number): Promise<Word[]> => {
  const res = await api.get(`/tu-vung/cuon-chieu/${folderId}?page=${page}`);
  return res.data;
};
