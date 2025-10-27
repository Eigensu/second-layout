import { useEffect, useMemo, useState, useCallback } from "react";
import type { Sponsor } from "@/types/sponsor";
import { getSponsors } from "@/lib/api/sponsors";
import { createSponsor, uploadSponsorLogo, updateSponsor, deleteSponsor } from "@/lib/api/admin/sponsors";

export type SponsorFormState = {
  name: string;
  logo: string; // optional URL; file upload can replace this
  description: string;
  website: string;
  featured: boolean;
  active: boolean;
};

export function useSponsorsSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [form, setForm] = useState<SponsorFormState>({
    name: "",
    logo: "",
    description: "",
    website: "",
    featured: false,
    active: true,
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; description: string }>({ name: "", description: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchSponsors = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSponsors({ active: true });
      setSponsors(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load sponsors");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getSponsors({ active: true });
        if (mounted) setSponsors(data);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? "Failed to load sponsors");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    setDeletingId(id);
    try {
      await deleteSponsor(id);
      await fetchSponsors();
    } catch (e: any) {
      setDeleteError(e?.message ?? "Failed to delete sponsor");
    } finally {
      setDeletingId(null);
    }
  };

  const openEdit = (s: Sponsor) => {
    setEditError(null);
    setEditingId(s.id);
    setEditForm({ name: s.name ?? "", description: s.description ?? "" });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    setEditError(null);
    setEditing(true);
    try {
      await updateSponsor(editingId, {
        name: editForm.name.trim(),
        description: editForm.description.trim(),
      });
      await fetchSponsors();
      setIsEditOpen(false);
    } catch (e: any) {
      setEditError(e?.message ?? "Failed to update sponsor");
    } finally {
      setEditing(false);
    }
  };

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return sponsors;
    return sponsors.filter((s) =>
      [s.name, s.tier, s.description, s.website]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [sponsors, searchQuery]);

  const titleCase = (t: string) => (t ? t.charAt(0).toUpperCase() + t.slice(1) : t);

  const resetForm = () => {
    setForm({ name: "", logo: "", description: "", website: "", featured: false, active: true });
    setLogoFile(null);
  };

  const handleCreate = async () => {
    setCreateError(null);
    setCreating(true);
    try {
      const payload: any = {
        name: form.name.trim(),
        logo: form.logo.trim() || "pending",
        tier: "bronze",
        description: form.description.trim(),
        featured: form.featured,
        active: form.active,
      };
      const website = form.website.trim();
      if (website) payload.website = website;
      const created = await createSponsor(payload);
      if (logoFile) {
        await uploadSponsorLogo(created.id, logoFile);
      }
      await fetchSponsors();
      setIsAddOpen(false);
      resetForm();
    } catch (err: any) {
      setCreateError(err?.message || "Failed to create sponsor");
    } finally {
      setCreating(false);
    }
  };

  return {
    // state
    searchQuery,
    sponsors,
    loading,
    error,
    isAddOpen,
    creating,
    createError,
    form,
    logoFile,
    filtered,
    isEditOpen,
    editing,
    editError,
    editForm,
    editingId,
    deletingId,
    deleteError,
    // setters
    setSearchQuery,
    setIsAddOpen,
    setForm,
    setLogoFile,
    setIsEditOpen,
    setEditForm,
    // actions
    handleCreate,
    fetchSponsors,
    openEdit,
    handleUpdate,
    handleDelete,
    // helpers
    titleCase,
  };
}
