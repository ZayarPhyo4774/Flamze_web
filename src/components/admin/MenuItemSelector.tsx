"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import type { MenuItemRow } from "@/components/admin/MenuItemTable";

interface MenuItemSelectorProps {
  open: boolean;
  onClose: () => void;
  targetBranchId: string;
  targetBranchName: string;
  items: MenuItemRow[];
  onCopy: (sourceItemIds: string[]) => Promise<void>;
}

function MenuItemSelectorBody({
  targetBranchId,
  targetBranchName,
  items,
  onCopy,
  onClose,
}: {
  targetBranchId: string;
  targetBranchName: string;
  items: MenuItemRow[];
  onCopy: (sourceItemIds: string[]) => Promise<void>;
  onClose: () => void;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const toggleSelection = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id]
    );
  };

  const handleCopy = async () => {
    if (!targetBranchId || selectedIds.length === 0) return;
    setSubmitting(true);
    try {
      await onCopy(selectedIds);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="text-sm text-zinc-400">
          Choose existing menu items and assign them to this branch. Only items from other branches are shown.
        </p>
        <p className="text-xs text-zinc-500">
          Selected branch: <span className="font-medium text-white">{targetBranchName}</span>
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 text-center text-zinc-500">
          No existing items found to copy.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-800">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/50 text-left text-zinc-400">
                  <th className="px-4 py-3 font-medium">Select</th>
                  <th className="px-4 py-3 font-medium">Item</th>
                  <th className="px-4 py-3 font-medium">Branch</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="bg-zinc-950/50 hover:bg-zinc-900/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={() => toggleSelection(item.id)}
                          className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-red-600 focus:ring-red-500"
                        />
                      </label>
                    </td>
                    <td className="px-4 py-3 text-white">{item.name}</td>
                    <td className="px-4 py-3 text-zinc-300">
                      {item.branches.length === 1
                        ? item.branches[0]?.name
                        : `${item.branches.length} branches`}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="gold">{item.category.name}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onClose} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleCopy}
          disabled={selectedIds.length === 0 || submitting || !targetBranchId}
          className="w-full sm:w-auto"
        >
          {submitting ? "Assigning..." : `Assign ${selectedIds.length} item(s)`}
        </Button>
      </div>
    </div>
  );
}

export function MenuItemSelector({
  open,
  onClose,
  targetBranchId,
  targetBranchName,
  items,
  onCopy,
}: MenuItemSelectorProps) {
  return (
    <Modal open={open} onClose={onClose} title={`Select items for ${targetBranchName}`}>
      {open ? (
        <MenuItemSelectorBody
          key={targetBranchId}
          targetBranchId={targetBranchId}
          targetBranchName={targetBranchName}
          items={items}
          onCopy={onCopy}
          onClose={onClose}
        />
      ) : null}
    </Modal>
  );
}
