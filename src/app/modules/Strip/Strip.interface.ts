import { paymentType } from "@prisma/client";

export type TPayProvider = {
  receiverId: string;
  paymentMethodId: string;
  amount: number;
  unitPaymentId: string;
  paymentType: paymentType;
};
