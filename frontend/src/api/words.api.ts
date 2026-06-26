import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
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
}

export type CreateWordInput = Omit<Word, "id" | "createdAt" | "updatedAt">;
export type UpdateWordInput = Partial<CreateWordInput>;

export const getWordsByFolder = async (folderId: number): Promise<Word[]> => {
  const res = await api.get(`/tu-vung/thu-muc/${folderId}`);
  return res.data;
};

export const createWord = async (data: CreateWordInput): Promise<Word> => {
  const res = await api.post("/tu-vung", data);
  return res.data;
};

export const updateWord = async (id: number, data: UpdateWordInput): Promise<Word> => {
  const res = await api.put(`/tu-vung/${id}`, data);
  return res.data;
};

export const deleteWord = async (id: number): Promise<void> => {
  await api.delete(`/tu-vung/${id}`);
};
