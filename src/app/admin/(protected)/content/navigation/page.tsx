"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import type { NavLinkContent, NavLinkFormData } from "@/lib/types";
import { adminHeaders } from "@/lib/admin-fetch";

const emptyForm: NavLinkFormData = {
  labelEn: "",
  labelMy: "",
  href: "/",
  sortOrder: 0,
  isVisible: true,
};

export default function AdminNavigationPage() {
  const [links, setLinks] = useState<NavLinkContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<NavLinkContent | null>(null);
  const [form, setForm] = useState<NavLinkFormData>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const refresh = () =>
    fetch("/api/nav-links")
      .then((res) => res.json())
      .then((data: NavLinkContent[]) => {
        setLinks(data);
        setLoading(false);
      });

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/nav-links")
      .then((res) => res.json())
      .then((data: NavLinkContent[]) => {
        if (!cancelled) {
          setLinks(data);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (link: NavLinkContent) => {
    setEditing(link);
    setForm({
      labelEn: link.labelEn,
      labelMy: link.labelMy ?? "",
      href: link.href,
      sortOrder: link.sortOrder,
      isVisible: link.isVisible,
    });
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(editing ? `/api/nav-links/${editing.id}` : "/api/nav-links", {
        method: editing ? "PUT" : "POST",
        headers: adminHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setFormOpen(false);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this nav link?")) return;
    setError(null);
    const res = await fetch(`/api/nav-links/${id}`, {
      method: "DELETE",
      headers: adminHeaders(),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Delete failed");
      return;
    }
    await refresh();
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Navigation</h1>
            <p className="text-sm text-zinc-500">Manage public navbar and footer links</p>
          </div>
          <Button variant="primary" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add Link
          </Button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-zinc-500">Loading...</div>
        ) : links.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-12 text-center text-zinc-500">
            No navigation links yet.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/50 text-left text-zinc-400">
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Label</th>
                  <th className="px-4 py-3 font-medium">Href</th>
                  <th className="px-4 py-3 font-medium">Visible</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {links.map((link) => (
                  <tr key={link.id} className="bg-zinc-950/50">
                    <td className="px-4 py-3 text-zinc-400">{link.sortOrder}</td>
                    <td className="px-4 py-3 text-white">{link.labelEn}</td>
                    <td className="px-4 py-3">
                      <Badge variant="gold">{link.href}</Badge>
                    </td>
                    <td className="px-4 py-3 text-zinc-300">
                      {link.isVisible ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(link)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:text-red-400"
                          onClick={() => handleDelete(link.id)}
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
        )}

        <Modal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          title={editing ? "Edit Nav Link" : "Add Nav Link"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="labelEn"
              label="Label (EN)"
              required
              value={form.labelEn}
              onChange={(e) => setForm({ ...form, labelEn: e.target.value })}
            />
            <Input
              id="labelMy"
              label="Label (MY)"
              value={form.labelMy ?? ""}
              onChange={(e) => setForm({ ...form, labelMy: e.target.value })}
            />
            <Input
              id="href"
              label="Href"
              required
              value={form.href}
              onChange={(e) => setForm({ ...form, href: e.target.value })}
              placeholder="/#about"
            />
            <Input
              id="sortOrder"
              label="Sort Order"
              type="number"
              value={form.sortOrder}
              onChange={(e) =>
                setForm({ ...form, sortOrder: parseInt(e.target.value, 10) || 0 })
              }
            />
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={form.isVisible ?? true}
                onChange={(e) => setForm({ ...form, isVisible: e.target.checked })}
              />
              Visible
            </label>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => setFormOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1" disabled={submitting}>
                {submitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}
