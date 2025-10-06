"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Star } from "lucide-react";
import { SubscriptionPlan } from "@/types/transaction";

interface StripePricingProps {
  onSelectPlan: (plan: SubscriptionPlan) => void;
  isLoading?: boolean;
}

const plans = [
  {
    id: 'monthly' as SubscriptionPlan,
    name: 'Monthly',
    price: '$9.99',
    turns: 100,
    duration: '30 ngày',
    icon: Zap,
    color: 'from-blue-500 to-cyan-500',
    features: [
      '100 lượt chơi',
      'Có hiệu lực 30 ngày',
      'Hỗ trợ 24/7',
    ],
  },
  {
    id: 'quarterly' as SubscriptionPlan,
    name: 'Quarterly',
    price: '$24.99',
    turns: 350,
    duration: '90 ngày',
    icon: Star,
    color: 'from-purple-500 to-pink-500',
    badge: 'Phổ biến',
    features: [
      '350 lượt chơi',
      'Có hiệu lực 90 ngày',
      'Tiết kiệm 16%',
      'Hỗ trợ ưu tiên',
    ],
  },
  {
    id: 'yearly' as SubscriptionPlan,
    name: 'Yearly',
    price: '$89.99',
    turns: 1500,
    duration: '365 ngày',
    icon: Crown,
    color: 'from-yellow-500 to-orange-500',
    badge: 'Tốt nhất',
    features: [
      '1500 lượt chơi',
      'Có hiệu lực 365 ngày',
      'Tiết kiệm 25%',
      'Hỗ trợ VIP',
      'Ưu đãi đặc biệt',
    ],
  },
];

export const StripePricingCards = ({ onSelectPlan, isLoading }: StripePricingProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan) => {
        const Icon = plan.icon;
        return (
          <Card
            key={plan.id}
            className={`relative ${
              plan.badge ? 'border-2 border-purple-400 shadow-lg' : ''
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                  {plan.badge}
                </Badge>
              </div>
            )}

            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${plan.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <Badge variant="secondary">{plan.duration}</Badge>
              </div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">/gói</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg">
                <Zap className="h-5 w-5 text-blue-600" />
                <span className="font-bold text-lg">{plan.turns} lượt chơi</span>
              </div>

              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                size="lg"
                onClick={() => onSelectPlan(plan.id)}
                disabled={isLoading}
              >
                {isLoading ? 'Đang xử lý...' : 'Chọn gói này'}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
