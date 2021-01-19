export interface DataItem {
  add_date: Date;
  amount: number;
  belong_date: number;
  belong_month: number;
  belong_year: number;
  catlog_id: number;
  day_expense: number;
  desc: string;
  type: number;
  _id: string;
  iconName?: string;
  catlogTitle?: string;
}

export type DayItem = {
  _id: number;
  list: DataItem[];
  belong_date: string;
  day_expense_outcomes: number;
  day_expense_incomes: number;
};

export type MonthItem = {
  list: DayItem[];
  month_expense_income: number;
  month_expense_outcome: number;
  _id: number; //202006
  belong_month?: string;
};

export type userDataList = MonthItem[];
