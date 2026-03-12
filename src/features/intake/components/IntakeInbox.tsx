import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/ui/table";
import { Inbox, Trash2, Eye } from "lucide-react";
import { useAppStore } from "@/mocks/store";
import type { IntakeItem, Classification } from "../intake.validator";
import { ClassificationDialog } from "./ClassificationDialog";
import { formatCurrency } from "@/shared/lib/currency";
import { INTAKE_DESTINATION_LABELS } from "@/shared/constants";

const SOURCE_COLORS: Record<string, string> = {
  whatsapp: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  ocr: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  email: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  classified: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  dismissed: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  classified: "Clasificado",
  dismissed: "Descartado",
};

export function IntakeInbox() {
  const intakeItems = useAppStore((s) => s.intakeItems);
  const classifyAndConfirmItem = useAppStore((s) => s.classifyAndConfirmItem);
  const dismissIntakeItem = useAppStore((s) => s.dismissIntakeItem);
  const deleteIntakeItem = useAppStore((s) => s.deleteIntakeItem);

  const [selectedItem, setSelectedItem] = useState<IntakeItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const pending = intakeItems.filter((i) => i.status === "pending");
  const classified = intakeItems.filter((i) => i.status === "classified");
  const dismissed = intakeItems.filter((i) => i.status === "dismissed");

  const todayStr = new Date().toISOString().split("T")[0];
  const classifiedToday = classified.filter((i) => i.updatedAt.startsWith(todayStr));

  const handleClassify = (item: IntakeItem) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleConfirm = (classification: Classification) => {
    if (selectedItem) {
      classifyAndConfirmItem(selectedItem.id, classification);
      setDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const handleDismiss = () => {
    if (selectedItem) {
      dismissIntakeItem(selectedItem.id);
      setDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const renderTable = (items: IntakeItem[], showActions: boolean) => {
    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Inbox className="h-12 w-12 mb-3 opacity-50" />
          <p className="text-lg font-medium">Sin items</p>
        </div>
      );
    }

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fuente</TableHead>
              <TableHead>Descripcion</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              {showActions && <TableHead className="text-right">Acciones</TableHead>}
              {!showActions && items[0]?.status === "classified" && <TableHead>Destino</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Badge className={SOURCE_COLORS[item.source]}>{item.source}</Badge>
                </TableCell>
                <TableCell className="font-medium max-w-[200px] truncate">{item.description}</TableCell>
                <TableCell>{formatCurrency(item.amount, item.currency)}</TableCell>
                <TableCell className="text-muted-foreground">{item.date ?? "—"}</TableCell>
                <TableCell>
                  <Badge className={STATUS_COLORS[item.status]}>{STATUS_LABELS[item.status]}</Badge>
                </TableCell>
                {showActions && (
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" onClick={() => handleClassify(item)}>Clasificar</Button>
                      <Button size="sm" variant="ghost" onClick={() => dismissIntakeItem(item.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteIntakeItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
                {!showActions && item.status === "classified" && (
                  <TableCell>
                    <Badge variant="outline">
                      {item.classification ? INTAKE_DESTINATION_LABELS[item.classification.destination] : "—"}
                    </Badge>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{pending.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clasificados hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{classifiedToday.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total en bandeja</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{intakeItems.length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pendientes ({pending.length})</TabsTrigger>
          <TabsTrigger value="classified">Clasificados ({classified.length})</TabsTrigger>
          <TabsTrigger value="dismissed">Descartados ({dismissed.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="mt-4">{renderTable(pending, true)}</TabsContent>
        <TabsContent value="classified" className="mt-4">{renderTable(classified, false)}</TabsContent>
        <TabsContent value="dismissed" className="mt-4">{renderTable(dismissed, false)}</TabsContent>
      </Tabs>

      {selectedItem && (
        <ClassificationDialog
          item={selectedItem}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onConfirm={handleConfirm}
          onDismiss={handleDismiss}
        />
      )}
    </div>
  );
}
