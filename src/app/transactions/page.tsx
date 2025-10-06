"use client";

import { useAuth } from "@/hooks/useAuth";
import { useTransactions } from "@/hooks/useTransactions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Receipt, CreditCard, Wallet, Check, X, Clock } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const TransactionsPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { data: transactions, isLoading: transactionsLoading, error } = useTransactions();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-purple-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const getPaymentMethodIcon = (method: string) => {
    if (method === 'STRIPE') {
      return <CreditCard className="h-5 w-5 text-purple-600" />;
    }
    return <Wallet className="h-5 w-5 text-green-600" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <Badge variant="default" className="gap-1">
            <Check className="h-3 w-3" />
            Thành công
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            Đang xử lý
          </Badge>
        );
      case 'FAILED':
        return (
          <Badge variant="destructive" className="gap-1">
            <X className="h-3 w-3" />
            Thất bại
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPlanName = (plan: string) => {
    switch (plan) {
      case 'monthly':
        return 'Monthly (30 ngày)';
      case 'quarterly':
        return 'Quarterly (90 ngày)';
      case 'yearly':
        return 'Yearly (365 ngày)';
      default:
        return plan;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lịch sử giao dịch</h1>
          <p className="text-muted-foreground mt-1">
            Xem lại tất cả các giao dịch mua lượt chơi
          </p>
        </div>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách giao dịch</CardTitle>
            <CardDescription>
              Lịch sử mua lượt chơi qua Direct và Stripe
            </CardDescription>
          </CardHeader>
          <CardContent>
            {transactionsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">
                Không thể tải lịch sử giao dịch. Vui lòng thử lại sau.
              </div>
            ) : !transactions || transactions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Chưa có giao dịch nào</p>
                <p className="text-sm mt-1">Mua lượt chơi để bắt đầu!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {/* Icon */}
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-purple-100 to-pink-100">
                      {getPaymentMethodIcon(transaction.paymentMethod)}
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">
                          {transaction.paymentMethod === 'STRIPE' ? 'Stripe Payment' : 'Mua trực tiếp'}
                        </p>
                        {transaction.subscriptionPlan && (
                          <Badge variant="outline" className="text-xs">
                            {getPlanName(transaction.subscriptionPlan)}
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground">
                        +{transaction.turnsAdded} lượt chơi • 
                        <span className="font-medium text-foreground ml-1">
                          ${transaction.amount.toFixed(2)}
                        </span>
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {format(new Date(transaction.createdAt), "dd/MM/yyyy HH:mm:ss", { locale: vi })}
                      </p>

                      {transaction.transactionRef && (
                        <p className="text-xs text-muted-foreground">
                          Mã GD: {transaction.transactionRef}
                        </p>
                      )}
                    </div>

                    {/* Status */}
                    <div className="text-right">
                      {getStatusBadge(transaction.paymentStatus)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        {transactions && transactions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Thống kê</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Tổng giao dịch</p>
                <p className="text-2xl font-bold">{transactions.length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Tổng lượt đã mua</p>
                <p className="text-2xl font-bold">
                  {transactions.reduce((sum, t) => sum + t.turnsAdded, 0)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Tổng chi tiêu</p>
                <p className="text-2xl font-bold">
                  ${transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default TransactionsPage;
