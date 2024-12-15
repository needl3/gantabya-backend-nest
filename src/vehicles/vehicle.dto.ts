export type CheckoutSuccessKhaltiResponse = {
  pidx: string;
  payment_url: string;
  expires_at: string;
  expires_in: number;
}

export type CheckoutFailedKhaltiResponse = {
  error_key: string;
} | CheckoutFailedGenericResponse
export type CheckoutFailedGenericResponse = {
  status_code: number;
}

export class PaymentSuccessKhaltiCallbackBodyDto {
  pidx: string;
  status: 'Completed' | 'Pending' | 'User cancelled';
  transaction_id: string;
  tids: string;
  amount: number;
  mobile: string;
  purchase_order_id: string;
  purchase_order_name: string;
  total_amount: number;
}

export type KhaltiPaymentVerificationResponse = {
  pidx: string,
  total_amount: number,
  status: "Completed" | "Pending" | "Initiated" | "Refunded" | "Expired" | "User canceled",
  transaction_id: string,
  fee: number,
  refunded: boolean
}
