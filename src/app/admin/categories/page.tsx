"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { CategoryTable, type CategoryRow } from "@/components/admin/CategoryTable";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { Button } from "@/components/ui/Button";
import type { CategoryFormData } from "@/lib/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refreshCategories = () =>
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data: CategoryRow[]) => {
        setCategories(data);
        setLoading(false);
      });

  useEffect(() => {
    let cancelled = false;

    void fetch("/api/categories")
      .then((res) => res.json())
      .then((data: CategoryRow[]) => {
        if (!cancelled) {
          setCategories(data);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreate = async (data: CategoryFormData) => {
    setError(null);
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-flamze-csrf": "1" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      setError(err.error ?? "Failed to create category");
      throw new Error(err.error);
    }
    await refreshCategories();
  };

  const handleUpdate = async (data: CategoryFormData) => {
    if (!editingCategory) return;
    setError(null);
    const res = await fetch(`/api/categories/${editingCategory.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-flamze-csrf": "1" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      setError(err.error ?? "Failed to update category");
      throw new Error(err.error);
    }
    setEditingCategory(null);
    await refreshCategories();
  };

  const handleDelete = async (id: string) => {
    setError(null);
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE", headers: { "x-flamze-csrf": "1" } });
    if (!res.ok) {
      const err = await res.json();
      setError(err.error ?? "Failed to delete category");
      return;
    }
    await refreshCategories();
  };

  const openEdit = (category: CategoryRow) => {
    setEditingCategory(category);
    setFormOpen(true);
  };

  const openCreate = () => {
    setEditingCategory(null);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Categories</h1>
            <p className="text-sm text-zinc-500">
              Manage food categories shown in the menu tabs
            </p>
          </div>
          <Button variant="primary" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-zinc-500">Loading...</div>
        ) : (
          <CategoryTable
            categories={categories}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}

        <CategoryForm
          open={formOpen}
          onClose={closeForm}
          onSubmit={editingCategory ? handleUpdate : handleCreate}
          title={editingCategory ? "Edit Category" : "Add Category"}
          initialData={
            editingCategory
              ? {
                  name: editingCategory.name,
                  nameMy: editingCategory.nameMy ?? "",
                  slug: editingCategory.slug,
                  sortOrder: editingCategory.sortOrder,
                }
              : undefined
          }
        />
      </main>
    </div>
  );
}
