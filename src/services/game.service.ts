import axiosInstance from "@/lib/axios.customize";
import { GuessRequest, GuessResponse, GameHistory } from "@/types/game";

export const gameService = {
  /**
   * Đoán số
   * POST /api/v1/game/guess
   */
  guess: async (data: GuessRequest): Promise<GuessResponse> => {
    const { data: response } = await axiosInstance.post<GuessResponse>(
      "/game/guess",
      data
    );
    return response;
  },

  /**
   * Lấy lịch sử chơi game
   * GET /api/v1/game/history
   */
  getHistory: async (): Promise<GameHistory[]> => {
    const { data: response } = await axiosInstance.get<GameHistory[]>(
      "/game/history"
    );
    return response;
  },
};
