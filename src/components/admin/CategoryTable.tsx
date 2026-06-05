"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  nameMy: string | null;
  sortOrder: number;
  _count?: { menuItems: number };
};

interface CategoryTableProps {
  categories: CategoryRow[];
  onEdit: (category: CategoryRow) => void;
  onDelete: (id: string) => void;
}

export function CategoryTable({ categories, onEdit, onDelete }: CategoryTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  if (categories.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-12 text-center text-zinc-500">
        No categories yet. Add your first category above.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50 text-left text-zinc-400">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Menu Items</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {categories.map((category) => (
              <tr
                key={category.id}
                className="bg-zinc-950/50 hover:bg-zinc-900/30 transition-colors"
              >
                <td className="px-4 py-3 text-zinc-400">{category.sortOrder}</td>
                <td className="px-4 py-3 font-medium text-white">{category.name}</td>
                <td className="px-4 py-3">
                  <Badge variant="gold">{category.slug}</Badge>
                </td>
                <td className="px-4 py-3 text-zinc-300">
                  {category._count?.menuItems ?? 0}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(category)}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                      disabled={deletingId === category.id}
                      title="Delete"
                      className="hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export type { CategoryRow };
