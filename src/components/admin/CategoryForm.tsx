"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { slugify } from "@/lib/utils";
import type { CategoryFormData } from "@/lib/types";

interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  initialData?: CategoryFormData;
  title?: string;
}

const emptyForm: CategoryFormData = {
  name: "",
  nameMy: "",
  slug: "",
  sortOrder: 0,
};

function CategoryFormBody({
  initialData,
  onSubmit,
  onClose,
}: {
  initialData?: CategoryFormData;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onClose: () => void;
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
      await onSubmit(form);
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
        />
      ) : null}
    </Modal>
  );
}
