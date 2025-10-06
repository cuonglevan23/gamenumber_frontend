import axiosInstance from "@/lib/axios.customize";
import { BuyTurnsRequest, BuyTurnsResponse, StripeCheckoutResponse, Transaction } from "@/types/transaction";

export const transactionService = {
  /**
   * Buy game turns - Direct or Stripe
   * POST /api/v1/buy-turns
   * Authentication required
   */
  buyTurns: async (data: BuyTurnsRequest): Promise<BuyTurnsResponse | StripeCheckoutResponse> => {
    const { data: response } = await axiosInstance.post<BuyTurnsResponse | StripeCheckoutResponse>(
      "/buy-turns",
      data
    );
    return response;
  },

  /**
   * Get transaction history
   * GET /api/v1/transactions
   * Authentication required
   */
  getTransactions: async (): Promise<Transaction[]> => {
    const { data: response } = await axiosInstance.get<Transaction[]>("/transactions");
    return response;
  },
};
