import { useQuery } from "@tanstack/react-query";
import { getStudyHistory } from "@/api/statistics.api";

export function useStudyHistory() {
  return useQuery({
    queryKey: ["study-history"],
    queryFn: getStudyHistory,
    staleTime: 1000 * 60 * 1, // Cache for 1 minute
    refetchOnWindowFocus: false
  });
}
