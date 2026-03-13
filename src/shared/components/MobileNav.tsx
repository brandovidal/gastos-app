import { Menu, CreditCard, LayoutDashboard, Inbox, MessageCircle, Receipt, Tv, HandCoins, Tags, Repeat, BarChart3, ScanText, PieChart, Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "@/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/ui/sheet";
import { NAV_ITEMS, SETTINGS_NAV } from "@/shared/constants";
import { cn } from "@/shared/lib/utils";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  "layout-dashboard": LayoutDashboard,
  inbox: Inbox,
  "message-circle": MessageCircle,
  receipt: Receipt,
  tv: Tv,
  "credit-card": CreditCard,
  "hand-coins": HandCoins,
  tags: Tags,
  repeat: Repeat,
  "bar-chart-3": BarChart3,
  "scan-text": ScanText,
  "pie-chart": PieChart,
  settings: Settings,
};

interface MobileNavProps {
  currentPath: string;
}

export function MobileNav({ currentPath }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetTitle className="flex h-16 items-center gap-2 px-6 border-b">
          <CreditCard className="h-6 w-6" />
          <span className="text-lg font-bold">Gastos</span>
        </SheetTitle>
        <nav className="flex-1 space-y-1 p-4">
          {NAV_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.icon];
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  currentPath === item.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {item.label}
              </a>
            );
          })}
        </nav>
        <div className="border-t p-4">
          {(() => {
            const Icon = ICON_MAP[SETTINGS_NAV.icon];
            return (
              <a
                href={SETTINGS_NAV.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  currentPath === SETTINGS_NAV.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {SETTINGS_NAV.label}
              </a>
            );
          })()}
        </div>
      </SheetContent>
    </Sheet>
  );
}
