import type { currencyCode } from '../../users/types/create-user.types';
import { splitMethods } from './splitMethod.types';

export interface Expense {
  id: string;
  groupId: string;
  name: string;
  totalAmount: number;
  currency: currencyCode;
  paidByMemberId: string; //who paid the expense
  createdAt: string;
  splitMethod: splitMethods;
  note: string | null;
  reciptURL: string | null;
  createdBy: string; // who created the expense
  updatedAt: string | null;
}
