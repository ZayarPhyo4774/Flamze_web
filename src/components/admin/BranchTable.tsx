"use client";

import { useState } from "react";
import { Pencil, Trash2, QrCode, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { QrCodeCard } from "@/components/admin/QrCodeCard";

type BranchRow = {
  id: string;
  slug: string;
  name: string;
  address: string | null;
  phone: string | null;
  openingHours: string | null;
  mapUrl: string | null;
  imageUrl: string | null;
  _count?: { menuItems: number };
};

interface BranchTableProps {
  branches: BranchRow[];
  onEdit: (branch: BranchRow) => void;
  onDelete: (id: string) => void;
  onSelectItems: (branchId: string) => void;
}

export function BranchTable({ branches, onEdit, onDelete, onSelectItems }: BranchTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [qrBranch, setQrBranch] = useState<BranchRow | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this branch and all its menu items?")) return;
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  if (branches.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-12 text-center text-zinc-500">
        No branches yet. Add your first branch above.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-zinc-800">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50 text-left text-zinc-400">
                <th className="px-4 py-3 font-medium">Branch</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Address</th>
                <th className="px-4 py-3 font-medium">Location Details</th>
                <th className="px-4 py-3 font-medium">Menu Items</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {branches.map((branch) => (
                <tr key={branch.id} className="bg-zinc-950/50 hover:bg-zinc-900/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{branch.name}</td>
                  <td className="px-4 py-3">
                    <Badge variant="gold">{branch.slug}</Badge>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{branch.address ?? "—"}</td>
                  <td className="px-4 py-3 text-zinc-400">
                    <div className="space-y-1">
                      <p>{branch.phone ?? "No phone"}</p>
                      <p>{branch.openingHours ?? "No hours"}</p>
                      {branch.mapUrl ? (
                        <a
                          href={branch.mapUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-amber-400 hover:text-amber-300"
                        >
                          Map link
                        </a>
                      ) : (
                        <p>No map link</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{branch._count?.menuItems ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQrBranch(branch)}
                        title="Generate QR"
                        className="hover:text-amber-400"
                      >
                        <QrCode className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelectItems(branch.id)}
                        title="Select items"
                        className="hover:text-emerald-400"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onEdit(branch)} title="Edit">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(branch.id)}
                        disabled={deletingId === branch.id}
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

      <Modal
        open={!!qrBranch}
        onClose={() => setQrBranch(null)}
        title="Branch QR Code"
      >
        {qrBranch && (
          <QrCodeCard
            branchName={qrBranch.name}
            branchSlug={qrBranch.slug}
            siteUrl={process.env.NEXT_PUBLIC_SITE_URL}
            size={240}
          />
        )}
      </Modal>
    </>
  );
}

export type { BranchRow };
