"use client";

import { useCallback, useMemo, useState } from "react";
import {
  createGalleryImage,
  deleteGalleryImage,
  getGalleryImages,
  updateGalleryImage,
} from "@/services/admin/gallery.service";
import type {
  AdminGalleryImage,
  GalleryCategory,
  GalleryImageInput,
} from "@/services/admin/gallery.service";
import { galleryCategories } from "@/lib/admin/mock-data";
import { useAdminData } from "../components/useAdminData";
import { useToast } from "../components/Toast";
import { AdminModal } from "../components/Modal";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Field } from "../components/Field";
import { EmptyState } from "../components/EmptyState";
import { SkeletonCard } from "../components/Skeleton";

type ModalState = { mode: "add" } | { mode: "edit"; item: AdminGalleryImage } | null;

const emptyForm: GalleryImageInput = {
  src: "",
  title: "",
  alt: "",
  category: "ROOMS",
  description: "",
};

const isValidUrl = (v: string) =>
  /^(https?:\/\/|\/)/.test(v.trim()) && v.trim().length > 4;

export default function AdminGallery() {
  const { data, status, reload } = useAdminData(useCallback(() => getGalleryImages(), []));
  const { toast } = useToast();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"ALL" | GalleryCategory>("ALL");

  const [modal, setModal] = useState<ModalState>(null);
  const [form, setForm] = useState<GalleryImageInput>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof GalleryImageInput, string>>>({});
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<AdminGalleryImage | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data ?? []).filter((img) => {
      const matchesCategory = category === "ALL" || img.category === category;
      const matchesQuery =
        q.length === 0 ||
        img.title.toLowerCase().includes(q) ||
        img.alt.toLowerCase().includes(q) ||
        img.category.toLowerCase().includes(q) ||
        img.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [data, query, category]);

  const openAdd = () => {
    setForm(emptyForm);
    setErrors({});
    setModal({ mode: "add" });
  };

  const openEdit = (item: AdminGalleryImage) => {
    setForm({
      src: item.src,
      title: item.title,
      alt: item.alt,
      category: item.category,
      description: item.description,
    });
    setErrors({});
    setModal({ mode: "edit", item });
  };

  const validate = () => {
    const next: Partial<Record<keyof GalleryImageInput, string>> = {};
    if (!form.src.trim()) next.src = "Image URL is required.";
    else if (!isValidUrl(form.src)) next.src = "Enter a valid URL (https://…) or path.";
    if (!form.title.trim()) next.title = "Title is required.";
    if (!form.alt.trim()) next.alt = "Alt text is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (modal?.mode === "edit") {
        await updateGalleryImage(modal.item.id, form);
        toast(`“${form.title}” updated.`);
      } else {
        await createGalleryImage(form);
        toast(`“${form.title}” added to the gallery.`);
      }
      setModal(null);
      reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not save the image.", "error");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteGalleryImage(deleteTarget.id);
      toast(`“${deleteTarget.title}” was deleted.`);
      setDeleteTarget(null);
      reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not delete the image.", "error");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const showPreview = isValidUrl(form.src) || form.src.trim().length > 4;

  return (
    <div>
      <div className="adm-page-head">
        <div>
          <p className="adm-page-kicker">Media</p>
          <h1>Gallery</h1>
          <p>
            Manage the imagery that tells the FESTHER story — every photo on the public
            journey page lives here.
          </p>
        </div>
        <button type="button" className="adm-btn" onClick={openAdd}>
          + Add Image
        </button>
      </div>

      <div className="adm-toolbar">
        <span className="adm-count">
          {status === "ready" ? `${filtered.length} of ${data?.length ?? 0}` : "Loading…"}
        </span>
        <div className="adm-search">
          <svg
            className="adm-search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            className="adm-search-input"
            type="search"
            placeholder="Search images…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search images"
          />
        </div>
        <div className="adm-toolbar-actions">
          <select
            className="adm-select"
            aria-label="Filter by category"
            value={category}
            onChange={(e) => setCategory(e.target.value as "ALL" | GalleryCategory)}
          >
            <option value="ALL">All categories</option>
            {galleryCategories.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0) + c.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {status === "loading" ? (
        <div className="adm-gallery-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="adm-card" style={{ background: "transparent" }}>
          <EmptyState
            title={data && data.length === 0 ? "The gallery is empty" : "No images found"}
            hint={
              data && data.length === 0
                ? "Add your first image to start building the collection."
                : "Try a different search term or category."
            }
          >
            {data && data.length === 0 && (
              <button type="button" className="adm-btn" onClick={openAdd}>
                + Add Image
              </button>
            )}
          </EmptyState>
        </div>
      ) : (
        <div className="adm-gallery-grid">
          {filtered.map((img) => (
            <article className="adm-card adm-gallery-card" key={img.id}>
              <div className="adm-gallery-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt={img.alt} loading="lazy" />
                <span className={`adm-pill adm-pill--active`}>{img.category}</span>
              </div>
              <div className="adm-gallery-card-body">
                <h3 className="adm-gallery-card-title">{img.title}</h3>
                <p className="adm-gallery-card-desc">{img.description || "\u00a0"}</p>
                <div className="adm-gallery-card-foot">
                  <span className="adm-gallery-card-date">
                    {img.createdAt.replaceAll("-", ".")}
                  </span>
                  <div className="adm-gallery-actions">
                    <button
                      type="button"
                      className="adm-btn--link"
                      onClick={() => openEdit(img)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="adm-btn--link adm-btn--danger"
                      onClick={() => setDeleteTarget(img)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <AdminModal
        open={modal !== null}
        onClose={() => !saving && setModal(null)}
        title={modal?.mode === "edit" ? "Edit image" : "Add image"}
        kicker={modal?.mode === "edit" ? "Update details" : "New upload"}
        subtitle="The image URL may point to the estate's media library or a hosted asset."
        wide
        footer={
          <div className="adm-form-actions adm-form-actions--right">
            <button
              type="button"
              className="adm-btn adm-btn--ghost"
              onClick={() => setModal(null)}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="button" className="adm-btn" onClick={save} disabled={saving}>
              {saving ? "Saving…" : modal?.mode === "edit" ? "Save changes" : "Add image"}
            </button>
          </div>
        }
      >
        <form
          className="adm-form"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <Field
            label="Image URL"
            htmlFor="g-img-src"
            error={errors.src}
            required
            full
          >
            <input
              id="g-img-src"
              className={`adm-input${errors.src ? " adm-input-error" : ""}`}
              type="text"
              value={form.src}
              placeholder="https://… or /images/…"
              onChange={(e) => setForm({ ...form, src: e.target.value })}
              disabled={saving}
            />
            {showPreview && (
              <span className={`adm-img-preview${showPreview ? " adm-img-preview--show" : ""}`}>
                <span className="adm-img-preview-frame">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.src} alt="Preview" />
                </span>
              </span>
            )}
          </Field>
          <Field label="Title" htmlFor="g-img-title" error={errors.title} required>
            <input
              id="g-img-title"
              className={`adm-input${errors.title ? " adm-input-error" : ""}`}
              type="text"
              value={form.title}
              placeholder="A room made for unhurried mornings"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              disabled={saving}
            />
          </Field>
          <Field label="Alt text" htmlFor="g-img-alt" error={errors.alt} required>
            <input
              id="g-img-alt"
              className={`adm-input${errors.alt ? " adm-input-error" : ""}`}
              type="text"
              value={form.alt}
              placeholder="Describe the image for accessibility"
              onChange={(e) => setForm({ ...form, alt: e.target.value })}
              disabled={saving}
            />
          </Field>
          <Field label="Category" htmlFor="g-img-cat" required>
            <select
              id="g-img-cat"
              className="adm-select"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value as GalleryCategory })
              }
              disabled={saving}
            >
              {galleryCategories.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0) + c.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label="Description"
            htmlFor="g-img-desc"
            full
          >
            <textarea
              id="g-img-desc"
              className="adm-textarea"
              value={form.description}
              placeholder="A short caption shown with the image…"
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              disabled={saving}
            />
          </Field>
        </form>
      </AdminModal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete image"
        confirmLabel="Delete"
        busy={deleting}
        message={
          deleteTarget
            ? `“${deleteTarget.title}” will be permanently removed from the gallery. This cannot be undone.`
            : ""
        }
        onCancel={() => !deleting && setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}