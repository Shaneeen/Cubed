import { cn } from "@/lib/utils";
import type { StockStatus } from "@/types/cube";

const labels: Record<StockStatus, string> = {
  in_stock: "In stock",
  low_stock: "Low stock",
  out_of_stock: "Out of stock",
};

const styles: Record<StockStatus, string> = {
  in_stock: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  low_stock: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  out_of_stock: "bg-red-500/10 text-red-500 dark:text-red-300",
};

export function StockBadge({ status }: { status: StockStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        styles[status]
      )}
    >
      {labels[status]}
    </span>
  );
}
