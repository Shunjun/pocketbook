export interface MonthStatisticItemType {
  month: number;
  expenses: {
    income: {
      type: number;
      expense: number;
    };
    outcome: {
      type: number;
      expense: number;
    };
  };
}
export type MonthStatisticType = MonthStatisticItemType[];

export interface DailyStatisticItemType {
  date: number;
  expenses: {
    income: {
      type: number;
      expense: number;
    };
    outcome: {
      type: number;
      expense: number;
    };
  };
}
export type DailyStatisticType = DailyStatisticItemType[];
