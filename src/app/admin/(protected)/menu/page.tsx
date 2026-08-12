"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Filter } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { MenuItemTable, type MenuItemRow } from "@/components/admin/MenuItemTable";
import { MenuItemForm } from "@/components/admin/MenuItemForm";
import { MenuItemSelector } from "@/components/admin/MenuItemSelector";
import { Button } from "@/components/ui/Button";
import type { MenuItemFormData } from "@/lib/types";
import { adminHeaders } from "@/lib/admin-fetch";

type Branch = { id: string; slug: string; name: string };
type Category = { id: string; slug: string; name: string };

function AdminMenuPageContent() {
  const searchParams = useSearchParams();
  const branchIdFromUrl = searchParams.get("branchId");
  const openFormFromUrl = searchParams.get("openForm") === "true";
  const openSelectorFromUrl = searchParams.get("openSelector") === "true";

  const [items, setItems] = useState<MenuItemRow[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectorItems, setSelectorItems] = useState<MenuItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(openFormFromUrl);
  const [selectorOpen, setSelectorOpen] = useState(openSelectorFromUrl);
  const [filterBranch, setFilterBranch] = useState(branchIdFromUrl ?? "all");
  const [editingItem, setEditingItem] = useState<MenuItemRow | null>(null);
  const [duplicateData, setDuplicateData] = useState<MenuItemFormData | null>(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const targetBranchId = branchIdFromUrl ?? (filterBranch !== "all" ? filterBranch : "");

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (filterBranch !== "all") params.set("branchId", filterBranch);
    if (filterCategory !== "all") params.set("categoryId", filterCategory);
    const query = params.toString();

    void Promise.all([
      fetch("/api/menu-items" + (query ? `?${query}` : "")),
      fetch("/api/branches"),
      fetch("/api/categories"),
    ])
      .then(([itemsRes, branchesRes, categoriesRes]) =>
        Promise.all([itemsRes.json(), branchesRes.json(), categoriesRes.json()])
      )
      .then(([itemsData, branchesData, categoriesData]) => {
        if (!cancelled) {
          setItems(itemsData);
          setBranches(branchesData);
          setCategories(categoriesData);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [filterBranch, filterCategory]);

  useEffect(() => {
    if (!selectorOpen || !targetBranchId) return;

    let cancelled = false;

    void fetch(`/api/menu-items?excludeBranchId=${targetBranchId}`)
      .then((res) => res.json())
      .then((data: MenuItemRow[]) => {
        if (!cancelled) {
          setSelectorItems(data);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectorOpen, targetBranchId]);

  const refreshData = async () => {
    const params = new URLSearchParams();
    if (filterBranch !== "all") params.set("branchId", filterBranch);
    if (filterCategory !== "all") params.set("categoryId", filterCategory);
    const query = params.toString();

    const [itemsRes, branchesRes, categoriesRes] = await Promise.all([
      fetch("/api/menu-items" + (query ? `?${query}` : "")),
      fetch("/api/branches"),
      fetch("/api/categories"),
    ]);

    const [itemsData, branchesData, categoriesData] = await Promise.all([
      itemsRes.json(),
      branchesRes.json(),
      categoriesRes.json(),
    ]);

    setItems(itemsData);
    setBranches(branchesData);
    setCategories(categoriesData);
  };

  const handleCreate = async (data: MenuItemFormData) => {
    const response = await fetch("/api/menu-items", {
      method: "POST",
      headers: adminHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body?.error || "Failed to create menu item");
    }

    await refreshData();
  };

  const handleUpdate = async (data: MenuItemFormData) => {
    if (!editingItem) return;

    const response = await fetch(`/api/menu-items/${editingItem.id}`, {
      method: "PUT",
      headers: adminHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body?.error || "Failed to update menu item");
    }

    setEditingItem(null);
    await refreshData();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/menu-items/${id}`, { method: "DELETE", headers: adminHeaders() });
    await refreshData();
  };

  const handleDuplicate = (item: MenuItemRow) => {
    const unassignedBranch = branches.find((b) => !item.branches.some((assigned) => assigned.id === b.id));
    setEditingItem(null);
    setDuplicateData({
      name: item.name,
      nameMy: item.nameMy ?? "",
      description: item.description ?? "",
      descriptionMy: item.descriptionMy ?? "",
      price: item.price,
      image: item.image ?? "",
      rating: item.rating,
      branchIds: [
        ...item.branches.map((branch) => branch.id),
        unassignedBranch?.id ?? item.branches[0]?.id ?? "",
      ].filter(Boolean),
      categoryId: item.category.id,
      isAvailable: item.isAvailable,
    });
    setFormOpen(true);
  };

  const openEdit = (item: MenuItemRow) => {
    setDuplicateData(null);
    setEditingItem(item);
    setFormOpen(true);
  };

  const openCreate = () => {
    setEditingItem(null);
    setDuplicateData(null);
    setFormOpen(true);
  };

  const openSelector = () => {
    setEditingItem(null);
    setDuplicateData(null);
    setSelectorOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingItem(null);
    setDuplicateData(null);
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Menu Items</h1>
            <p className="text-sm text-zinc-500">Manage items across all branches</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
            {targetBranchId && (
              <Button variant="secondary" onClick={openSelector}>
                Add Existing Item
              </Button>
            )}
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Filter className="h-4 w-4 text-zinc-500" />
          <select
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
          >
            <option value="all">All Branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {(filterBranch !== "all" || filterCategory !== "all") && (
            <button
              onClick={() => {
                setFilterBranch("all");
                setFilterCategory("all");
              }}
              className="text-xs text-zinc-500 hover:text-white transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-12 text-center text-zinc-500">Loading...</div>
        ) : (
          <MenuItemTable
            items={items}
            onEdit={openEdit}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
          />
        )}

        <MenuItemForm
          open={formOpen}
          onClose={closeForm}
          onSubmit={editingItem ? handleUpdate : handleCreate}
          branches={branches}
          categories={categories}
          defaultBranchIds={branchIdFromUrl ? [branchIdFromUrl] : filterBranch !== "all" ? [filterBranch] : undefined}
          title={
            editingItem
              ? "Edit Menu Item"
              : duplicateData
                ? "Copy to Branch"
                : "Add Menu Item"
          }
          initialData={
            editingItem
              ? {
                  name: editingItem.name,
                  nameMy: editingItem.nameMy ?? "",
                  description: editingItem.description ?? "",
                  descriptionMy: editingItem.descriptionMy ?? "",
                  price: editingItem.price,
                  image: editingItem.image ?? "",
                  rating: editingItem.rating,
                  branchIds: editingItem.branches.map((branch) => branch.id),
                  categoryId: editingItem.category.id,
                  isAvailable: editingItem.isAvailable,
                }
              : duplicateData ?? undefined
          }
        />

        <MenuItemSelector
          open={selectorOpen}
          onClose={() => setSelectorOpen(false)}
          targetBranchId={branchIdFromUrl ?? ""}
          targetBranchName={branches.find((b) => b.id === branchIdFromUrl)?.name ?? "Selected branch"}
          items={selectorItems}
          onCopy={async (sourceItemIds) => {
            if (!branchIdFromUrl) return;
            await fetch("/api/menu-items/copy", {
              method: "POST",
              headers: adminHeaders({ "Content-Type": "application/json" }),
              body: JSON.stringify({ sourceItemIds, branchId: branchIdFromUrl }),
            });
            setSelectorOpen(false);
            await refreshData();
          }}
        />
      </main>
    </div>
  );
}

export default function AdminMenuPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-zinc-500">Loading...</div>}>
      <AdminMenuPageContent />
    </Suspense>
  );
}
