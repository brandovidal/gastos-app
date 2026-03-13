import { useAppStore } from "@/mocks/store";
import { Button } from "@/ui/button";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { getMonthName, getCurrentMonth, getCurrentYear } from "@/shared/lib/dates";

export function MonthNavigator() {
  const selectedMonth = useAppStore((s) => s.selectedMonth);
  const selectedYear = useAppStore((s) => s.selectedYear);
  const navigateMonth = useAppStore((s) => s.navigateMonth);
  const setSelectedPeriod = useAppStore((s) => s.setSelectedPeriod);

  const isCurrentMonth = selectedMonth === getCurrentMonth() && selectedYear === getCurrentYear();

  return (
    <div className="flex items-center gap-1">
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => navigateMonth(-1)}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="min-w-[140px] text-center text-sm font-medium">
        {getMonthName(selectedMonth)} {selectedYear}
      </span>
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => navigateMonth(1)}>
        <ChevronRight className="h-4 w-4" />
      </Button>
      {!isCurrentMonth && (
        <Button
          variant="ghost"
          size="sm"
          className="ml-1 h-8 text-xs"
          onClick={() => setSelectedPeriod(getCurrentMonth(), getCurrentYear())}
        >
          <CalendarDays className="mr-1 h-3.5 w-3.5" />
          Hoy
        </Button>
      )}
    </div>
  );
}
