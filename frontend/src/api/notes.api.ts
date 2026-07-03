import axios from "axios";

export const notesClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/ghi-chu`,
  withCredentials: true,
});

// ========== TYPES ==========

export interface Note {
  id: string;
  title: string;
  content: string | null;
  position: number;
  columnId: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteColumn {
  id: string;
  title: string;
  position: number;
  notes: Note[];
}

export interface ReorderItem {
  id: string;
  position: number;
  columnId: string;
}

// ========== API FUNCTIONS ==========

// Board
export const getBoard = async (): Promise<NoteColumn[]> => {
  const response = await notesClient.get("/");
  return response.data;
};

// Columns
export const createColumn = async (title: string): Promise<NoteColumn> => {
  const response = await notesClient.post("/cot", { title });
  return response.data;
};

export const updateColumn = async (id: string, title: string): Promise<NoteColumn> => {
  const response = await notesClient.put(`/cot/${id}`, { title });
  return response.data;
};

export const deleteColumn = async (id: string): Promise<void> => {
  await notesClient.delete(`/cot/${id}`);
};

// Notes
export const createNote = async (columnId: string, title: string, content?: string): Promise<Note> => {
  const response = await notesClient.post("/ghi-chu", { columnId, title, content });
  return response.data;
};

export const updateNote = async (id: string, data: { title?: string; content?: string | null }): Promise<Note> => {
  const response = await notesClient.put(`/ghi-chu/${id}`, data);
  return response.data;
};

export const deleteNote = async (id: string): Promise<void> => {
  await notesClient.delete(`/ghi-chu/${id}`);
};

// Reorder (Drag & Drop)
export const reorderNotes = async (updates: ReorderItem[]): Promise<void> => {
  await notesClient.patch("/sap-xep", { updates });
};
