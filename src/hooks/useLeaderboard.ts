"use client";

import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";

/**
 * Hook để lấy bảng xếp hạng top 100
 * Cache 5 phút theo docs
 */
export const useLeaderboard = () => {
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => userService.getLeaderboard(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 5 * 60 * 1000, // Cache time (previously cacheTime)
    refetchInterval: 5 * 60 * 1000, // Auto refetch every 5 minutes
  });
};
