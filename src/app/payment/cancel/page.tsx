"use client";

import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowRight, ShoppingCart } from "lucide-react";

const PaymentCancelPage = () => {
  const router = useRouter();

  return (
    <AppLayout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
              <XCircle className="h-8 w-8 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl">Thanh toán đã hủy</CardTitle>
            <CardDescription>
              Giao dịch của bạn đã bị hủy. Bạn có thể thử lại bất cứ lúc nào.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-yellow-50 p-4 text-center">
              <p className="text-sm text-yellow-800">
                Không có khoản phí nào được tính. Tài khoản của bạn không bị ảnh hưởng.
              </p>
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => router.push("/shop")}
                className="w-full gap-2"
                size="lg"
              >
                <ShoppingCart className="h-4 w-4" />
                Quay lại cửa hàng
              </Button>

              <Button
                onClick={() => router.push("/dashboard")}
                variant="outline"
                className="w-full gap-2"
                size="lg"
              >
                <ArrowRight className="h-4 w-4" />
                Về trang chủ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default PaymentCancelPage;
