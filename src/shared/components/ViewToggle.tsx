import { LayoutGrid, Table2 } from "lucide-react";
import { Button } from "@/ui/button";

interface ViewToggleProps {
  view: "table" | "cards";
  onChange: (view: "table" | "cards") => void;
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border p-1">
      <Button
        variant={view === "table" ? "secondary" : "ghost"}
        size="sm"
        className="h-7 px-2"
        onClick={() => onChange("table")}
      >
        <Table2 className="h-4 w-4" />
      </Button>
      <Button
        variant={view === "cards" ? "secondary" : "ghost"}
        size="sm"
        className="h-7 px-2"
        onClick={() => onChange("cards")}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
    </div>
  );
}
