"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { BranchTable, type BranchRow } from "@/components/admin/BranchTable";
import { BranchForm } from "@/components/admin/BranchForm";
import { QrCodeCard } from "@/components/admin/QrCodeCard";
import { Button } from "@/components/ui/Button";
import type { BranchFormData } from "@/lib/types";

export default function AdminBranchesPage() {
  const [branches, setBranches] = useState<BranchRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchRow | null>(null);
  const router = useRouter();

  const refreshBranches = () =>
    fetch("/api/branches")
      .then((res) => res.json())
      .then((data: BranchRow[]) => {
        setBranches(data);
        setLoading(false);
      });

  useEffect(() => {
    let cancelled = false;

    void fetch("/api/branches")
      .then((res) => res.json())
      .then((data: BranchRow[]) => {
        if (!cancelled) {
          setBranches(data);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreate = async (data: BranchFormData) => {
    const res = await fetch("/api/branches", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-flamze-csrf": "1" },
      body: JSON.stringify(data),
    });

    const branch = await res.json();
    await refreshBranches();

    if (res.ok && branch?.id) {
      router.push(`/admin/menu?branchId=${branch.id}&openSelector=true`);
    }
  };

  const handleUpdate = async (data: BranchFormData) => {
    if (!editingBranch) return;
    await fetch(`/api/branches/${editingBranch.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-flamze-csrf": "1" },
      body: JSON.stringify(data),
    });
    setEditingBranch(null);
    await refreshBranches();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/branches/${id}`, { method: "DELETE", headers: { "x-flamze-csrf": "1" } });
    await refreshBranches();
  };

  const openEdit = (branch: BranchRow) => {
    setEditingBranch(branch);
    setFormOpen(true);
  };

  const openCreate = () => {
    setEditingBranch(null);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingBranch(null);
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Branches</h1>
            <p className="text-sm text-zinc-500">Manage locations and generate QR codes</p>
          </div>
          <Button variant="primary" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add Branch
          </Button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-zinc-500">Loading...</div>
        ) : (
          <>
            <BranchTable
              branches={branches}
              onEdit={openEdit}
              onDelete={handleDelete}
              onSelectItems={(branchId) => router.push(`/admin/menu?branchId=${branchId}&openSelector=true`)}
            />

            {branches.length > 0 && (
              <section className="mt-10">
                <h2 className="mb-4 text-lg font-semibold text-white">All Branch QR Codes</h2>
                <p className="mb-6 text-sm text-zinc-500">
                  Print these QR codes and place them at each branch. Customers scan to open the menu.
                </p>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {branches.map((branch) => (
                    <QrCodeCard
                      key={branch.id}
                      branchName={branch.name}
                      branchSlug={branch.slug}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        <BranchForm
          open={formOpen}
          onClose={closeForm}
          onSubmit={editingBranch ? handleUpdate : handleCreate}
          title={editingBranch ? "Edit Branch" : "Add Branch"}
          initialData={
            editingBranch
              ? {
                  name: editingBranch.name,
                  slug: editingBranch.slug,
                  address: editingBranch.address ?? "",
                  phone: editingBranch.phone ?? "",
                  openingHours: editingBranch.openingHours ?? "",
                  mapUrl: editingBranch.mapUrl ?? "",
                }
              : undefined
          }
        />
      </main>
    </div>
  );
}
