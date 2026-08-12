"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { slugify } from "@/lib/utils";
import type { CategoryFormData } from "@/lib/types";

interface ParentOption {
  id: string;
  name: string;
}

interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  initialData?: CategoryFormData;
  title?: string;
  parentOptions?: ParentOption[];
}

const emptyForm: CategoryFormData = {
  name: "",
  nameMy: "",
  slug: "",
  sortOrder: 0,
  parentId: null,
};

function CategoryFormBody({
  initialData,
  onSubmit,
  onClose,
  parentOptions = [],
}: {
  initialData?: CategoryFormData;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onClose: () => void;
  parentOptions?: ParentOption[];
}) {
  const [form, setForm] = useState<CategoryFormData>(initialData ?? emptyForm);
  const [slugEdited, setSlugEdited] = useState(!!initialData?.slug);
  const [submitting, setSubmitting] = useState(false);

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: slugEdited ? prev.slug : slugify(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        parentId: form.parentId || null,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="category-name"
        label="Category Name (English)"
        required
        value={form.name}
        onChange={(e) => handleNameChange(e.target.value)}
        placeholder="Hotpot"
      />

      <Input
        id="category-name-my"
        label="Category Name (Myanmar)"
        value={form.nameMy ?? ""}
        onChange={(e) => setForm({ ...form, nameMy: e.target.value })}
        placeholder="Hotpot (မြန်မာ)"
      />

      <Input
        id="category-slug"
        label="Slug"
        required
        value={form.slug}
        onChange={(e) => {
          setSlugEdited(true);
          setForm({ ...form, slug: slugify(e.target.value) });
        }}
        placeholder="hotpot"
      />

      <div className="space-y-1.5">
        <label htmlFor="category-parent" className="block text-sm font-medium text-zinc-300">
          Parent Category (optional)
        </label>
        <select
          id="category-parent"
          value={form.parentId ?? ""}
          onChange={(e) =>
            setForm({ ...form, parentId: e.target.value || null })
          }
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
        >
          <option value="">None (top-level)</option>
          {parentOptions.map((parent) => (
            <option key={parent.id} value={parent.id}>
              {parent.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-zinc-500">
          Choose a top-level category to create a subcategory.
        </p>
      </div>

      <Input
        id="category-sort"
        label="Sort Order"
        type="number"
        min={0}
        value={form.sortOrder}
        onChange={(e) =>
          setForm({ ...form, sortOrder: parseInt(e.target.value, 10) || 0 })
        }
      />
      <p className="text-xs text-zinc-500">
        Lower numbers appear first in the menu tabs.
      </p>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" className="flex-1" disabled={submitting}>
          {submitting ? "Saving..." : "Save Category"}
        </Button>
      </div>
    </form>
  );
}

export function CategoryForm({
  open,
  onClose,
  onSubmit,
  initialData,
  title = "Add Category",
  parentOptions = [],
}: CategoryFormProps) {
  const formKey = initialData?.slug ?? "new";

  return (
    <Modal open={open} onClose={onClose} title={title}>
      {open ? (
        <CategoryFormBody
          key={formKey}
          initialData={initialData}
          onSubmit={onSubmit}
          onClose={onClose}
          parentOptions={parentOptions}
        />
      ) : null}
    </Modal>
  );
}
