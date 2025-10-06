"use client";

import { useQuery } from "@tanstack/react-query";
import { transactionService } from "@/services/transaction.service";

/**
 * Hook để lấy lịch sử giao dịch
 * GET /api/v1/transactions
 */
export const useTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: () => transactionService.getTransactions(),
    staleTime: 30000, // 30 seconds
  });
};
