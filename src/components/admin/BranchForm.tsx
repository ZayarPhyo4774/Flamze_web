"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { slugify } from "@/lib/utils";
import type { BranchFormData } from "@/lib/types";

interface BranchFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BranchFormData) => Promise<void>;
  initialData?: BranchFormData;
  title?: string;
}

const emptyForm: BranchFormData = {
  name: "",
  slug: "",
  address: "",
  phone: "",
  openingHours: "",
  mapUrl: "",
};

function BranchFormBody({
  initialData,
  onSubmit,
  onClose,
}: {
  initialData?: BranchFormData;
  onSubmit: (data: BranchFormData) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<BranchFormData>(initialData ?? emptyForm);
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
        id="branch-name"
        label="Branch Name"
        required
        value={form.name}
        onChange={(e) => handleNameChange(e.target.value)}
        placeholder="Flamze Yangon"
      />

      <Input
        id="branch-slug"
        label="Slug (URL identifier)"
        required
        value={form.slug}
        onChange={(e) => {
          setSlugEdited(true);
          setForm({ ...form, slug: slugify(e.target.value) });
        }}
        placeholder="yangon"
      />
      <p className="text-xs text-zinc-500">
        Used in menu URL: /menu?branch=<span className="text-amber-400">{form.slug || "slug"}</span>
      </p>

      <Input
        id="branch-address"
        label="Address"
        value={form.address ?? ""}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
        placeholder="Downtown Yangon"
      />

      <Input
        id="branch-phone"
        label="Phone"
        value={form.phone ?? ""}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        placeholder="+95 9 123 456 789"
      />

      <Input
        id="branch-opening-hours"
        label="Opening Hours"
        value={form.openingHours ?? ""}
        onChange={(e) => setForm({ ...form, openingHours: e.target.value })}
        placeholder="Daily, 11:00 AM - 10:00 PM"
      />

      <Input
        id="branch-map-url"
        label="Map URL"
        type="url"
        value={form.mapUrl ?? ""}
        onChange={(e) => setForm({ ...form, mapUrl: e.target.value })}
        placeholder="https://maps.google.com/..."
      />

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" className="flex-1" disabled={submitting}>
          {submitting ? "Saving..." : "Save Branch"}
        </Button>
      </div>
    </form>
  );
}

export function BranchForm({
  open,
  onClose,
  onSubmit,
  initialData,
  title = "Add Branch",
}: BranchFormProps) {
  const formKey = initialData?.slug ?? "new";

  return (
    <Modal open={open} onClose={onClose} title={title}>
      {open ? (
        <BranchFormBody
          key={formKey}
          initialData={initialData}
          onSubmit={onSubmit}
          onClose={onClose}
        />
      ) : null}
    </Modal>
  );
}
