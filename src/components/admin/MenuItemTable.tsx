"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pencil, Trash2, Copy } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50] as const;

type MenuItemRow = {
  id: string;
  name: string;
  nameMy: string | null;
  description: string | null;
  descriptionMy: string | null;
  price: number;
  image: string | null;
  rating: number;
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
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, items.length);
  const paginatedItems = items.slice(startIndex, endIndex);

  useEffect(() => {
    setPage(1);
  }, [items.length, pageSize]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

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
      <div className="flex flex-col gap-3 border-b border-zinc-800 bg-zinc-900/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-400">
          Showing {startIndex + 1}–{endIndex} of {items.length} items
        </p>
        <label className="flex items-center gap-2 text-sm text-zinc-400">
          <span>Rows per page</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-white focus:border-red-500 focus:outline-none"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="max-h-[min(60vh,640px)] overflow-auto">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-zinc-800 bg-zinc-900 text-left text-zinc-400">
              <th className="px-4 py-3 font-medium">Item</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Branch</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {paginatedItems.map((item) => (
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
                <td className="px-4 py-3 text-amber-400">{formatPrice(item.price)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <span
                        key={value}
                        className={
                          "text-sm " +
                          (item.rating >= value ? "text-amber-400" : "text-zinc-700")
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </td>
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

      <div className="flex flex-col gap-3 border-t border-zinc-800 bg-zinc-900/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-500">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export type { MenuItemRow };
