import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResponsiveDialog } from "@/shared/components/ResponsiveDialog";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { useAppStore } from "@/mocks/store";
import { createBudgetGroupSchema, type BudgetGroup } from "../budget-group.validator";
import type { z } from "zod/v4";

type CreateBudgetGroup = z.infer<typeof createBudgetGroupSchema>;

interface BudgetGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group?: BudgetGroup;
}

export function BudgetGroupDialog({ open, onOpenChange, group }: BudgetGroupDialogProps) {
  const addBudgetGroup = useAppStore((s) => s.addBudgetGroup);
  const updateBudgetGroup = useAppStore((s) => s.updateBudgetGroup);
  const groups = useAppStore((s) => s.budgetGroups);
  const isEdit = !!group;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateBudgetGroup>({
    resolver: zodResolver(createBudgetGroupSchema) as any,
    defaultValues: {
      name: "",
      emoji: "📦",
      percentage: 0,
      order: groups.length + 1,
    },
  });

  useEffect(() => {
    if (open && group) {
      reset({
        name: group.name,
        emoji: group.emoji,
        percentage: group.percentage,
        order: group.order,
      });
    } else if (open) {
      reset({
        name: "",
        emoji: "📦",
        percentage: 0,
        order: groups.length + 1,
      });
    }
  }, [open, group, reset, groups.length]);

  const onSubmit = (data: CreateBudgetGroup) => {
    if (isEdit) {
      updateBudgetGroup(group.id, data);
    } else {
      addBudgetGroup({
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    onOpenChange(false);
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Editar grupo" : "Nuevo grupo presupuestario"}
      description={isEdit ? "Modifica los datos del grupo" : "Crea un nuevo grupo para organizar tu presupuesto"}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit(onSubmit)}>
            {isEdit ? "Guardar" : "Crear"}
          </Button>
        </>
      }
    >
      <form className="space-y-4 py-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Nombre *</label>
          <Input {...register("name")} placeholder="Ej: Costos Fijos, Ahorros..." />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Emoji</label>
            <Input {...register("emoji")} placeholder="📦" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Porcentaje (%)</label>
            <Input type="number" {...register("percentage", { valueAsNumber: true })} placeholder="25" />
            {errors.percentage && <p className="text-xs text-destructive">{errors.percentage.message}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Orden</label>
            <Input type="number" {...register("order", { valueAsNumber: true })} placeholder="1" />
          </div>
        </div>
      </form>
    </ResponsiveDialog>
  );
}
