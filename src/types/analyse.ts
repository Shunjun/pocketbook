export interface MonthStatisticItemType {
  month: number;
  expenses: {
    income: {
      type: number;
      month_expense: number;
    };
    outcome: {
      type: number;
      month_expense: number;
    };
  };
}

export type MonthStatisticType = MonthStatisticItemType[];
