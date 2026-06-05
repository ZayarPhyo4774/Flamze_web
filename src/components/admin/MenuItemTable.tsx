"use client";

import { useState } from "react";
import { Pencil, Trash2, Copy } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";

type MenuItemRow = {
  id: string;
  name: string;
  nameMy: string | null;
  description: string | null;
  descriptionMy: string | null;
  price: number;
  image: string | null;
  isAvailable: boolean;
  branches: { id: string; name: string }[];
  category: { id: string; slug: string; name: string };
};

interface MenuItemTableProps {
  items: MenuItemRow[];
  onEdit: (item: MenuItemRow) => void;
  onDelete: (id: string) => void;
  onDuplicate: (item: MenuItemRow) => void;
}

export function MenuItemTable({ items, onEdit, onDelete, onDuplicate }: MenuItemTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this menu item?")) return;
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-12 text-center text-zinc-500">
        No menu items found. Add your first item above.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50 text-left text-zinc-400">
              <th className="px-4 py-3 font-medium">Item</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Branch</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {items.map((item) => (
              <tr key={item.id} className="bg-zinc-950/50 hover:bg-zinc-900/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {item.image ? (
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="40px" />
                      </div>
                    ) : (
                      <div className="h-10 w-10 shrink-0 rounded-lg bg-zinc-800" />
                    )}
                    <div>
                      <p className="font-medium text-white">{item.name}</p>
                      {item.description && (
                        <p className="line-clamp-1 text-xs text-zinc-500">{item.description}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="gold">{item.category.name}</Badge>
                </td>
                <td className="px-4 py-3 text-zinc-300">
                  {item.branches.length === 1
                    ? item.branches[0]?.name
                    : `${item.branches.length} branches`}
                </td>
                <td className="px-4 py-3 font-medium text-amber-400">{formatPrice(item.price)}</td>
                <td className="px-4 py-3">
                  <Badge variant={item.isAvailable ? "success" : "warning"}>
                    {item.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(item)} title="Edit">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDuplicate(item)} title="Copy to branch">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
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

export type { MenuItemRow };
