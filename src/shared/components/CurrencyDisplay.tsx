import { formatCurrency } from "@/shared/lib/currency";

interface CurrencyDisplayProps {
  amount: number;
  currency?: string;
  amountInPEN?: number | null;
  className?: string;
}

export function CurrencyDisplay({ amount, currency = "PEN", amountInPEN, className }: CurrencyDisplayProps) {
  if (currency !== "PEN" && amountInPEN) {
    return (
      <div className={className}>
        <span className="font-semibold">{formatCurrency(amountInPEN)}</span>
        <span className="text-xs text-muted-foreground ml-1">
          ({formatCurrency(amount, currency)})
        </span>
      </div>
    );
  }
  return <span className={`font-semibold ${className ?? ""}`}>{formatCurrency(amount, currency)}</span>;
}
