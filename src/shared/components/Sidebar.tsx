import {
  LayoutDashboard,
  Inbox,
  MessageCircle,
  Receipt,
  Tv,
  CreditCard,
  HandCoins,
  Tags,
  Repeat,
  BarChart3,
  ScanText,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { NAV_ITEMS } from "@/shared/constants";

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
};

interface SidebarProps {
  currentPath: string;
}

export function Sidebar({ currentPath }: SidebarProps) {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center gap-2 px-6 border-b border-sidebar-border">
        <CreditCard className="h-6 w-6 text-sidebar-primary" />
        <span className="text-lg font-bold text-sidebar-foreground">Gastos</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {NAV_ITEMS.map((item) => {
          const Icon = ICON_MAP[item.icon];
          const isActive = currentPath === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {item.label}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
