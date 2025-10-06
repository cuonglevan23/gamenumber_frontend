import axiosInstance from "@/lib/axios.customize";
import { User } from "@/types/auth";
import { LeaderboardEntry } from "@/types/leaderboard";

export const userService = {
  /**
   * Get current user info
   * GET /api/v1/me
   * Authentication required
   */
  getCurrentUser: async (): Promise<User> => {
    const { data: response } = await axiosInstance.get<User>("/me");
    return response;
  },

  /**
   * Get leaderboard (top 100 users)
   * GET /api/v1/leaderboard
   * No authentication required
   */
  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    const { data: response } = await axiosInstance.get<LeaderboardEntry[]>("/leaderboard");
    return response;
  },
};
