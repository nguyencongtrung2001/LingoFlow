import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/api/statistics.api";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
    staleTime: 1000 * 60 * 5, // Dữ liệu thống kê giữ nguyên trong 5 phút
    refetchOnWindowFocus: false
  });
}
