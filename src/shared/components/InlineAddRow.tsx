import { useState, useRef, useEffect } from "react";
import { TableRow, TableCell } from "@/ui/table";
import { toast } from "sonner";

interface ColumnConfig {
  key: string;
  placeholder: string;
  type: "text" | "number" | "select";
  options?: Array<{ value: string; label: string }>;
  defaultValue?: string;
}

interface InlineAddRowProps {
  columns: ColumnConfig[];
  totalColumns: number;
  onSave: (values: Record<string, string>) => void;
  placeholder?: string;
}

export function InlineAddRow({
  columns,
  totalColumns,
  onSave,
  placeholder = "Nuevo gasto...",
}: InlineAddRowProps) {
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(columns.map((c) => [c.key, c.defaultValue ?? ""]))
  );
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      firstInputRef.current?.focus();
    }
  }, [editing]);

  const reset = () => {
    setValues(Object.fromEntries(columns.map((c) => [c.key, c.defaultValue ?? ""])));
    setEditing(false);
  };

  const handleSave = () => {
    const desc = columns.find((c) => c.key === "description");
    const amt = columns.find((c) => c.key === "amount");
    if (desc && !values.description?.trim()) return;
    if (amt && !values.amount?.trim()) return;

    onSave(values);
    toast.success("Gasto agregado");
    reset();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      reset();
    }
  };

  if (!editing) {
    return (
      <TableRow
        className="cursor-pointer hover:bg-muted/50"
        onClick={() => setEditing(true)}
      >
        <TableCell
          colSpan={totalColumns}
          className="text-sm text-muted-foreground"
        >
          + {placeholder}
        </TableCell>
      </TableRow>
    );
  }

  const emptyColsCount = totalColumns - columns.length;

  return (
    <TableRow>
      {columns.map((col, i) => (
        <TableCell key={col.key} className="p-1.5">
          {col.type === "select" ? (
            <select
              className="h-8 w-full rounded-md border bg-background px-2 text-sm"
              value={values[col.key]}
              onChange={(e) => setValues({ ...values, [col.key]: e.target.value })}
              onKeyDown={handleKeyDown}
            >
              <option value="">{col.placeholder}</option>
              {col.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              ref={i === 0 ? firstInputRef : undefined}
              type={col.type}
              placeholder={col.placeholder}
              className="h-8 w-full rounded-md border bg-background px-2 text-sm"
              value={values[col.key]}
              onChange={(e) => setValues({ ...values, [col.key]: e.target.value })}
              onKeyDown={handleKeyDown}
            />
          )}
        </TableCell>
      ))}
      {emptyColsCount > 0 && (
        <TableCell colSpan={emptyColsCount} className="p-1.5">
          <span className="text-xs text-muted-foreground">
            Enter para guardar · Esc para cancelar
          </span>
        </TableCell>
      )}
    </TableRow>
  );
}
