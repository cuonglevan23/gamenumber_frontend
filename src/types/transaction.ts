export type SubscriptionPlan = 'monthly' | 'quarterly' | 'yearly';
export type PaymentMethod = 'direct' | 'stripe';

export interface BuyTurnsRequest {
  paymentMethod: PaymentMethod;
  quantity?: number; // For direct payment
  plan?: SubscriptionPlan; // For stripe payment
}

export interface StripeCheckoutResponse {
  checkoutUrl: string;
}

export interface BuyTurnsResponse {
  id: number;
  transactionType: string;
  turnsAdded: number;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionRef: string;
  stripeSessionId?: string;
  subscriptionPlan?: string;
  createdAt: string;
}

export interface Transaction {
  id: number;
  transactionType: string;
  turnsAdded: number;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionRef: string;
  stripeSessionId?: string;
  subscriptionPlan?: string;
  createdAt: string;
}
