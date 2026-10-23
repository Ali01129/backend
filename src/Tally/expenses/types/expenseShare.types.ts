export interface ExpenseShare {
  id: string;
  expenseId: string;
  memberId: string;
  amount: number;
  percent: number | null;
  exact: number | null;
  equal: number | null;
  byItems: number | null;
}
