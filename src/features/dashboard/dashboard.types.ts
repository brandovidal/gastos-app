export interface SummaryCardData {
  title: string;
  value: number;
  description?: string;
  trend?: "up" | "down" | "neutral";
}

export interface ChartDataPoint {
  month: string;
  totalExpenses: number;
  salary: number;
  surplus: number;
}
