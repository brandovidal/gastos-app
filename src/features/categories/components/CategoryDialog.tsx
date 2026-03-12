import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResponsiveDialog } from "@/shared/components/ResponsiveDialog";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { useAppStore } from "@/mocks/store";
import { createCategorySchema, type Category } from "../category.validator";
import type { z } from "zod/v4";

type CreateCategory = z.infer<typeof createCategorySchema>;

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category;
}

export function CategoryDialog({ open, onOpenChange, category }: CategoryDialogProps) {
  const addCategory = useAppStore((s) => s.addCategory);
  const updateCategory = useAppStore((s) => s.updateCategory);
  const isEdit = !!category;

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CreateCategory>({
    resolver: zodResolver(createCategorySchema) as any,
    defaultValues: {
      name: "",
      color: "#6B7280",
      icon: null,
      isDefault: false,
    },
  });

  useEffect(() => {
    if (open && category) {
      reset({
        name: category.name,
        color: category.color,
        icon: category.icon,
        isDefault: category.isDefault,
      });
    } else if (open) {
      reset({
        name: "",
        color: "#6B7280",
        icon: null,
        isDefault: false,
      });
    }
  }, [open, category, reset]);

  const onSubmit = (data: CreateCategory) => {
    if (isEdit) {
      updateCategory(category.id, data);
    } else {
      addCategory({
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
      title={isEdit ? "Editar categoría" : "Nueva categoría"}
      description={isEdit ? "Modifica los datos de la categoría" : "Crea una nueva categoría para clasificar gastos"}
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
          <Input {...register("name")} placeholder="Ej: Transporte, Comida..." />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={watch("color")}
                onChange={(e) => setValue("color", e.target.value)}
                className="h-9 w-12 cursor-pointer rounded border"
              />
              <Input {...register("color")} className="flex-1" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Icono (opcional)</label>
            <Input {...register("icon")} placeholder="Ej: tag, home..." />
          </div>
        </div>
      </form>
    </ResponsiveDialog>
  );
}
