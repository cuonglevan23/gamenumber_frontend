"use client";

import { useQuery } from "@tanstack/react-query";
import { gameService } from "@/services/game.service";

/**
 * Hook để lấy lịch sử chơi game
 * GET /api/v1/game/history
 */
export const useGameHistory = () => {
  return useQuery({
    queryKey: ["game-history"],
    queryFn: () => gameService.getHistory(),
    staleTime: 30000, // 30 seconds
  });
};
