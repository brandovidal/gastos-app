import { Menu, CreditCard } from "lucide-react";
import { useState } from "react";
import { Button } from "@/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/ui/sheet";
import { NAV_ITEMS } from "@/shared/constants";
import { cn } from "@/shared/lib/utils";

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
        <nav className="space-y-1 p-4">
          {NAV_ITEMS.map((item) => (
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
              {item.label}
            </a>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
