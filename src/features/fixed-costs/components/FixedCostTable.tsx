import { useState } from "react";
import { useAppStore } from "@/mocks/store";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { CurrencyDisplay } from "@/shared/components/CurrencyDisplay";
import { EmptyState } from "@/shared/components/EmptyState";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Input } from "@/ui/input";
import { Plus, Search, Trash2, Pencil } from "lucide-react";
import { formatDate } from "@/shared/lib/dates";
import { PAYMENT_STATUSES, PAYMENT_STATUS_LABELS } from "@/shared/constants";

export function FixedCostTable() {
  const fixedCosts = useAppStore((s) => s.fixedCosts);
  const categories = useAppStore((s) => s.categories);
  const updateFixedCost = useAppStore((s) => s.updateFixedCost);
  const deleteFixedCost = useAppStore((s) => s.deleteFixedCost);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filtered = fixedCosts
    .filter((fc) => fc.paymentMonth === 3 && fc.paymentYear === 2026)
    .filter((fc) => !search || fc.description.toLowerCase().includes(search.toLowerCase()))
    .filter((fc) => statusFilter === "all" || fc.paymentStatus === statusFilter)
    .filter((fc) => categoryFilter === "all" || fc.categoryId === categoryFilter);

  const total = filtered.reduce((sum, fc) => sum + (fc.amountInPEN ?? fc.amount), 0);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {PAYMENT_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{PAYMENT_STATUS_LABELS[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button size="sm">
          <Plus className="mr-1 h-4 w-4" /> Nuevo gasto
        </Button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState description="No hay costos fijos con los filtros seleccionados" />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descripción</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Persona</TableHead>
                <TableHead>Vencimiento</TableHead>
                <TableHead>Cuenta</TableHead>
                <TableHead className="w-[80px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((fc) => {
                const cat = categories.find((c) => c.id === fc.categoryId);
                return (
                  <TableRow key={fc.id}>
                    <TableCell>
                      <div>
                        <span className="font-medium">{fc.description}</span>
                        {fc.installments && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            {fc.installments}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {cat && (
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                          <span className="text-sm">{cat.name}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <CurrencyDisplay amount={fc.amount} currency={fc.currency} amountInPEN={fc.amountInPEN} />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={fc.paymentStatus}
                        onValueChange={(val) => updateFixedCost(fc.id, { paymentStatus: val })}
                      >
                        <SelectTrigger className="h-7 w-auto border-0 p-0">
                          <StatusBadge status={fc.paymentStatus} />
                        </SelectTrigger>
                        <SelectContent>
                          {PAYMENT_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>{PAYMENT_STATUS_LABELS[s]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-sm">{fc.person}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {fc.dueDate ? formatDate(fc.dueDate) : "—"}
                    </TableCell>
                    <TableCell className="text-sm">{fc.account ?? "—"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => deleteFixedCost(fc.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between border-t px-4 py-3">
            <span className="text-sm text-muted-foreground">{filtered.length} registros</span>
            <span className="text-sm font-semibold">Total: S/ {total.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
