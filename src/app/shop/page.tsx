"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionService } from "@/services/transaction.service";
import { StripePricingCards } from "@/components/payment/stripe-pricing-cards";
import { toast } from "sonner";
import { Zap, ShoppingCart, Check, CreditCard, Wallet } from "lucide-react";
import { SubscriptionPlan, BuyTurnsResponse, StripeCheckoutResponse } from "@/types/transaction";

const ShopPage = () => {
  const { user, isLoading: authLoading, refreshUserData } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
    }
  }, [user, authLoading, router]);

  // Direct payment mutation
  const buyDirectMutation = useMutation({
    mutationFn: (quantity: number) =>
      transactionService.buyTurns({ paymentMethod: 'direct', quantity }),
    onSuccess: async (data) => {
      const response = data as BuyTurnsResponse;
      toast.success("Mua lượt chơi thành công!", {
        description: `Bạn đã mua ${response.turnsAdded} lượt chơi với giá $${response.amount.toFixed(2)}`,
      });
      
      // Refresh user data
      try {
        const { userService } = await import("@/services/user.service");
        const updatedUser = await userService.getCurrentUser();
        refreshUserData(updatedUser);
      } catch {}
      
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      setSelectedPackage(null);
    },
    onError: (error: unknown) => {
      const apiError = error as { response?: { data?: { detail?: string } } };
      toast.error("Mua lượt chơi thất bại", {
        description: apiError?.response?.data?.detail || "Vui lòng thử lại sau",
      });
    },
  });

  // Stripe payment mutation
  const buyStripeMutation = useMutation({
    mutationFn: (plan: SubscriptionPlan) =>
      transactionService.buyTurns({ paymentMethod: 'stripe', plan }),
    onSuccess: (data) => {
      const response = data as StripeCheckoutResponse;
      // Redirect to Stripe checkout
      window.location.href = response.checkoutUrl;
    },
    onError: (error: unknown) => {
      const apiError = error as { response?: { data?: { detail?: string } } };
      toast.error("Không thể tạo phiên thanh toán", {
        description: apiError?.response?.data?.detail || "Vui lòng thử lại sau",
      });
    },
  });

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

  const directPackages = [
    {
      quantity: 1,
      turns: 5,
      price: 0.40,
      popular: false,
      description: "Gói cơ bản",
    },
    {
      quantity: 3,
      turns: 15,
      price: 1.20,
      popular: true,
      description: "Gói phổ biến",
    },
    {
      quantity: 5,
      turns: 25,
      price: 2.00,
      popular: false,
      description: "Gói tiết kiệm",
    },
    {
      quantity: 10,
      turns: 50,
      price: 4.00,
      popular: false,
      description: "Gói VIP",
    },
  ];

  const handleDirectBuy = (quantity: number) => {
    setSelectedPackage(quantity);
    buyDirectMutation.mutate(quantity);
  };

  const handleStripeBuy = (plan: SubscriptionPlan) => {
    buyStripeMutation.mutate(plan);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cửa hàng</h1>
          <p className="text-muted-foreground mt-1">
            Mua thêm lượt chơi để tiếp tục trò chơi
          </p>
        </div>

        {/* Current Balance */}
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="text-lg">Lượt chơi hiện tại</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Zap className="h-12 w-12 text-purple-600" />
              <div>
                <p className="text-3xl font-bold">{user.turns}</p>
                <p className="text-sm text-muted-foreground">lượt chơi còn lại</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods Tabs */}
        <Tabs defaultValue="direct" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="direct" className="gap-2">
              <Wallet className="h-4 w-4" />
              Mua trực tiếp
            </TabsTrigger>
            <TabsTrigger value="stripe" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Thanh toán Stripe
            </TabsTrigger>
          </TabsList>

          {/* Direct Payment Tab */}
          <TabsContent value="direct" className="space-y-4">
            <div className="text-center space-y-2 mb-6">
              <h2 className="text-2xl font-bold">Mua trực tiếp</h2>
              <p className="text-muted-foreground">
                Thanh toán nhanh chóng, không giới hạn thời gian
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {directPackages.map((pkg) => (
                <Card
                  key={pkg.quantity}
                  className={`relative ${
                    pkg.popular
                      ? "border-purple-400 shadow-lg scale-105"
                      : "border-gray-200"
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">
                        Phổ biến nhất
                      </Badge>
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Zap className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl">{pkg.turns} lượt</CardTitle>
                    <CardDescription>{pkg.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-3xl font-bold">
                        ${pkg.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        ${(pkg.price / pkg.turns).toFixed(2)}/lượt
                      </p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>{pkg.turns} lượt chơi</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Không giới hạn thời gian</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Thanh toán an toàn</span>
                      </div>
                    </div>

                    <Button
                      className="w-full gap-2"
                      size="lg"
                      onClick={() => handleDirectBuy(pkg.quantity)}
                      disabled={buyDirectMutation.isPending && selectedPackage === pkg.quantity}
                      variant={pkg.popular ? "default" : "outline"}
                    >
                      {buyDirectMutation.isPending && selectedPackage === pkg.quantity ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4" />
                          Mua ngay
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Stripe Payment Tab */}
          <TabsContent value="stripe" className="space-y-4">
            <div className="text-center space-y-2 mb-6">
              <h2 className="text-2xl font-bold">Gói Stripe Subscription</h2>
              <p className="text-muted-foreground">
                Thanh toán quốc tế an toàn với Stripe
              </p>
            </div>

            <StripePricingCards
              onSelectPlan={handleStripeBuy}
              isLoading={buyStripeMutation.isPending}
            />

            {/* Stripe Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Về thanh toán Stripe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>• Thanh toán quốc tế an toàn qua Stripe</p>
                <p>• Hỗ trợ thẻ Visa, Mastercard, American Express</p>
                <p>• Lượt chơi có thời hạn theo gói đã chọn</p>
                <p>• Sau khi thanh toán, lượt chơi được cộng tự động</p>
                <p>• Stripe bảo vệ thông tin thanh toán của bạn</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* General Info */}
        <Card>
          <CardHeader>
            <CardTitle>Câu hỏi thường gặp</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground">Mua trực tiếp khác gì Stripe?</p>
              <p>• <strong>Mua trực tiếp:</strong> Thanh toán USD, không giới hạn thời gian</p>
              <p>• <strong>Stripe:</strong> Thanh toán card quốc tế, có thời hạn, nhiều lượt hơn</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Lượt chơi có hết hạn không?</p>
              <p>• <strong>Direct:</strong> Không hết hạn</p>
              <p>• <strong>Stripe:</strong> Có thời hạn 30/90/365 ngày</p>
            </div>
            <p className="mt-4">• Liên hệ hỗ trợ: support@gamenumber.com</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ShopPage;
