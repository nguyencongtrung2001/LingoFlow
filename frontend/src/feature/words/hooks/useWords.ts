import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWordsByFolder,
  createWord,
  createMultipleWords,
  updateWord,
  deleteWord,
  CreateWordInput,
  UpdateWordInput,
  ExcelWordInput,
  saveStudySession,
  StudySessionInput,
  getWordsSequential,
  moveWords,
  getSmartWords,
  getMasteredWords,
  getFolderProgress,
  gradeSentence,
} from "@/api/words.api";

export function useGetWords(folderId: number) {
  return useQuery({
    queryKey: ["words", folderId.toString()],
    queryFn: () => getWordsByFolder(folderId),
    enabled: !!folderId,
  });
}

export function useCreateWord(folderId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<CreateWordInput, "folderId">) => createWord({ ...data, folderId }),
    onSuccess: () => {
      // Làm mới danh sách từ
      queryClient.invalidateQueries({ queryKey: ["words", folderId.toString()] });
      // Làm mới cache Smart Queue + Mastered (dùng cho các chế độ chơi)
      queryClient.invalidateQueries({ queryKey: ["words-smart", folderId.toString()] });
      queryClient.invalidateQueries({ queryKey: ["words-mastered", folderId.toString()] });
      queryClient.invalidateQueries({ queryKey: ["words-progress", folderId.toString()] });
      // Làm mới cả folder grid (để update word count)
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      // Làm mới dashboard stats
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useCreateMultipleWords(folderId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (wordsArray: ExcelWordInput[]) => {
      return await createMultipleWords(folderId, wordsArray);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["words", folderId.toString()] });
      queryClient.invalidateQueries({ queryKey: ["words-smart", folderId.toString()] });
      queryClient.invalidateQueries({ queryKey: ["words-mastered", folderId.toString()] });
      queryClient.invalidateQueries({ queryKey: ["words-progress", folderId.toString()] });
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useUpdateWord(folderId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateWordInput }) => updateWord(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["words", folderId.toString()] });
      queryClient.invalidateQueries({ queryKey: ["words-smart", folderId.toString()] });
      queryClient.invalidateQueries({ queryKey: ["words-mastered", folderId.toString()] });
      queryClient.invalidateQueries({ queryKey: ["words-progress", folderId.toString()] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useDeleteWord(folderId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteWord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["words", folderId.toString()] });
      queryClient.invalidateQueries({ queryKey: ["words-smart", folderId.toString()] });
      queryClient.invalidateQueries({ queryKey: ["words-mastered", folderId.toString()] });
      queryClient.invalidateQueries({ queryKey: ["words-progress", folderId.toString()] });
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useSaveStudySession(folderId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StudySessionInput) => saveStudySession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["words", folderId.toString()] });
      queryClient.invalidateQueries({ queryKey: ["words-smart", folderId.toString()] });
      queryClient.invalidateQueries({ queryKey: ["words-mastered", folderId.toString()] });
      queryClient.invalidateQueries({ queryKey: ["words-progress", folderId.toString()] });
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["words-sequential", folderId.toString()] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useGetWordsSequential(folderId: number, page: number) {
  return useQuery({
    queryKey: ["words-sequential", folderId.toString(), page.toString()],
    queryFn: () => getWordsSequential(folderId, page),
    enabled: !!folderId,
  });
}

export function useMoveWords(currentFolderId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ wordIds, targetFolderId }: { wordIds: number[]; targetFolderId: number }) =>
      moveWords(wordIds, targetFolderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["words", currentFolderId.toString()] });
      queryClient.invalidateQueries({ queryKey: ["words-smart", currentFolderId.toString()] });
      queryClient.invalidateQueries({ queryKey: ["words-mastered", currentFolderId.toString()] });
      queryClient.invalidateQueries({ queryKey: ["words-progress", currentFolderId.toString()] });
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["words"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useGetSmartWords(folderId: number) {
  return useQuery({
    queryKey: ["words-smart", folderId.toString()],
    queryFn: () => getSmartWords(folderId),
    enabled: !!folderId,
  });
}

export function useGetMasteredWords(folderId: number) {
  return useQuery({
    queryKey: ["words-mastered", folderId.toString()],
    queryFn: () => getMasteredWords(folderId),
    enabled: !!folderId,
  });
}

export function useGetFolderProgress(folderId: number) {
  return useQuery({
    queryKey: ["words-progress", folderId.toString()],
    queryFn: () => getFolderProgress(folderId),
    enabled: !!folderId,
  });
}

export function useGradeSentence() {
  return useMutation({
    mutationFn: ({ wordId, sentence }: { wordId: number; sentence: string }) =>
      gradeSentence(wordId, sentence),
  });
}
