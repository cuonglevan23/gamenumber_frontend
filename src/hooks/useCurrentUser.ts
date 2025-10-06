"use client";

import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";

/**
 * Hook để lấy thông tin user hiện tại từ API /me
 * Có cache và auto-refetch
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: () => userService.getCurrentUser(),
    staleTime: 60000, // 1 minute
    retry: 1,
  });
};
