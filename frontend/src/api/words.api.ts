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

export const moveWords = async (wordIds: number[], targetFolderId: number): Promise<{ message: string; count: number }> => {
  const res = await api.put("/tu-vung/di-chuyen", { wordIds, targetFolderId });
  return res.data;
};

export interface SmartWordsResponse {
  words: Word[];
  meta: {
    dangOn: number;    // Số từ đang ôn (attempts > 0, corrects < 7)
    chuaHoc: number;   // Số từ chưa học (attempts = 0)
    moiTinh: number;   // Số từ mới tinh (chưa có WordProgress)
    daThuocBu: number; // Số từ đã thuộc lấy bù (khi không đủ từ mới)
  };
}

/** Lấy từ vựng thông minh: ưu tiên từ chưa thuộc + gối đầu từ mới */
export const getSmartWords = async (folderId: number): Promise<SmartWordsResponse> => {
  const res = await api.get(`/tu-vung/thong-minh/${folderId}`);
  return res.data;
};

/** Lấy danh sách từ đã thuộc (ôn tập lại) */
export const getMasteredWords = async (folderId: number): Promise<Word[]> => {
  const res = await api.get(`/tu-vung/da-thuoc/${folderId}`);
  return res.data;
};
