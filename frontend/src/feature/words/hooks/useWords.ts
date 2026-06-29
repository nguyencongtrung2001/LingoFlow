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
      // Làm mới cả folder grid (để update word count)
      queryClient.invalidateQueries({ queryKey: ["folders"] });
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
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
}

export function useUpdateWord(folderId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateWordInput }) => updateWord(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["words", folderId.toString()] });
    },
  });
}

export function useDeleteWord(folderId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteWord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["words", folderId.toString()] });
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
}
