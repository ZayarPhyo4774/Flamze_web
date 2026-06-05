"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import type { MenuItemFormData } from "@/lib/types";

type Branch = { id: string; slug: string; name: string };
type Category = { id: string; slug: string; name: string };

interface MenuItemFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: MenuItemFormData) => Promise<void>;
  branches: Branch[];
  categories: Category[];
  initialData?: MenuItemFormData & { id?: string };
  defaultBranchIds?: string[];
  title?: string;
}

const emptyForm: MenuItemFormData = {
  name: "",
  nameMy: "",
  description: "",
  descriptionMy: "",
  price: 0,
  image: "",
  branchIds: [],
  categoryId: "",
  isAvailable: true,
};

function buildDefaultForm(
  branches: Branch[],
  categories: Category[],
  defaultBranchIds?: string[]
): MenuItemFormData {
  return {
    ...emptyForm,
    branchIds: defaultBranchIds?.length ? defaultBranchIds : [branches[0]?.id ?? ""],
    categoryId: categories[0]?.id ?? "",
  };
}

function MenuItemFormBody({
  initialData,
  defaultBranchIds,
  branches,
  categories,
  onSubmit,
  onClose,
}: {
  initialData?: MenuItemFormData & { id?: string };
  defaultBranchIds?: string[];
  branches: Branch[];
  categories: Category[];
  onSubmit: (data: MenuItemFormData) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<MenuItemFormData>(
    initialData ?? buildDefaultForm(branches, categories, defaultBranchIds)
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="name"
        label="Name (English)"
        required
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Signature Spicy Broth"
      />

      <Input
        id="nameMy"
        label="Name (Myanmar)"
        value={form.nameMy ?? ""}
        onChange={(e) => setForm({ ...form, nameMy: e.target.value })}
        placeholder="အမည် (မြန်မာ)"
      />

      <div className="space-y-1.5">
        <label htmlFor="description" className="block text-sm font-medium text-zinc-300">
          Description (English)
        </label>
        <textarea
          id="description"
          value={form.description ?? ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
          placeholder="Brief description..."
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="descriptionMy" className="block text-sm font-medium text-zinc-300">
          Description (Myanmar)
        </label>
        <textarea
          id="descriptionMy"
          value={form.descriptionMy ?? ""}
          onChange={(e) => setForm({ ...form, descriptionMy: e.target.value })}
          rows={2}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
          placeholder="ဖော်ပြချက် (မြန်မာ)"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="price"
          label="Price (MMK)"
          type="number"
          required
          min={0}
          value={form.price || ""}
          onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-300">Branches</label>
          <div
            role="listbox"
            aria-multiselectable="true"
            className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-auto rounded-xl border border-zinc-700 bg-zinc-900/80 p-2"
          >
            {branches.map((b) => {
              const selected = form.branchIds.includes(b.id);
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    if (selected) {
                      setForm({ ...form, branchIds: form.branchIds.filter((id) => id !== b.id) });
                    } else {
                      setForm({ ...form, branchIds: [...form.branchIds, b.id] });
                    }
                  }}
                  className={
                    "w-full text-left px-3 py-2 rounded-xl text-sm transition-colors " +
                    (selected
                      ? "bg-red-600 text-white"
                      : "bg-transparent text-white/80 hover:bg-zinc-800/60")
                  }
                >
                  {selected ? "✓ " : ""}
                  {b.name}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-zinc-500">Click to toggle branch selection.</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="category" className="block text-sm font-medium text-zinc-300">
          Category
        </label>
        <select
          id="category"
          required
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <ImageUploadField
        value={form.image ?? ""}
        onChange={(url) => setForm({ ...form, image: url })}
      />

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.isAvailable ?? true}
          onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
          className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-red-600 focus:ring-red-500"
        />
        <span className="text-sm text-zinc-300">Available on menu</span>
      </label>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" className="flex-1" disabled={submitting}>
          {submitting ? "Saving..." : "Save Item"}
        </Button>
      </div>
    </form>
  );
}

export function MenuItemForm({
  open,
  onClose,
  onSubmit,
  branches,
  categories,
  initialData,
  defaultBranchIds,
  title = "Add Menu Item",
}: MenuItemFormProps) {
  const formKey = initialData
    ? `${initialData.name}-${initialData.branchIds.join(",")}`
    : `new-${defaultBranchIds?.join(",") ?? ""}`;

  return (
    <Modal open={open} onClose={onClose} title={title}>
      {open ? (
        <MenuItemFormBody
          key={formKey}
          initialData={initialData}
          defaultBranchIds={defaultBranchIds}
          branches={branches}
          categories={categories}
          onSubmit={onSubmit}
          onClose={onClose}
        />
      ) : null}
    </Modal>
  );
}
