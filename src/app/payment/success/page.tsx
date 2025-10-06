"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Receipt } from "lucide-react";
import axiosInstance from "@/lib/axios.customize";

const PaymentSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processPayment = async () => {
      if (!sessionId) {
        setError("Không tìm thấy session ID");
        setIsProcessing(false);
        return;
      }

      try {
        await axiosInstance.get(`/payment/success?session_id=${sessionId}`);
        setIsProcessing(false);
      } catch {
        setError("Có lỗi xảy ra khi xử lý thanh toán");
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [sessionId]);

  if (isProcessing) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-purple-600" />
            <p className="text-lg font-medium">Đang xử lý thanh toán...</p>
            <p className="text-sm text-muted-foreground">Vui lòng đợi trong giây lát</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <CheckCircle2 className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl">Có lỗi xảy ra</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => router.push("/shop")}
                className="w-full gap-2"
                size="lg"
              >
                <ArrowRight className="h-4 w-4" />
                Thử lại
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Thanh toán thành công!</CardTitle>
            <CardDescription>
              Lượt chơi đã được cộng vào tài khoản của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-green-50 p-4 text-center">
              <p className="text-sm text-green-800">
                Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
              </p>
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => router.push("/game")}
                className="w-full gap-2"
                size="lg"
              >
                <ArrowRight className="h-4 w-4" />
                Chơi ngay
              </Button>

              <Button
                onClick={() => router.push("/transactions")}
                variant="outline"
                className="w-full gap-2"
                size="lg"
              >
                <Receipt className="h-4 w-4" />
                Xem lịch sử giao dịch
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default PaymentSuccessPage;
