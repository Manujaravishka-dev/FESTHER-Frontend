"use client";

import { useCallback, useMemo, useState } from "react";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "@/services/admin/comments.service";
import type {
  CommentInput,
  CommentStatus,
  ReviewComment,
} from "@/services/admin/comments.service";
import { useAdminData } from "../components/useAdminData";
import { useToast } from "../components/Toast";
import { AdminModal } from "../components/Modal";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Field } from "../components/Field";
import { EmptyState } from "../components/EmptyState";
import { AdminStars } from "../components/AdminStars";
import { SkeletonRow } from "../components/Skeleton";

type ModalState = { mode: "add" } | { mode: "edit"; item: ReviewComment } | null;

const statusOptions: CommentStatus[] = ["approved", "pending", "hidden"];

const statusLabels: Record<CommentStatus, string> = {
  approved: "Approved",
  pending: "Pending",
  hidden: "Hidden",
};

const emptyForm: CommentInput = {
  name: "",
  comment: "",
  rating: 5,
  date: new Date().toISOString().slice(0, 10),
  status: "pending",
};

export default function AdminComments() {
  const { data, status, reload } = useAdminData(useCallback(() => getComments(), []));
  const { toast } = useToast();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"ALL" | CommentStatus>("ALL");

  const [modal, setModal] = useState<ModalState>(null);
  const [form, setForm] = useState<CommentInput>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof CommentInput, string>>>({});
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<ReviewComment | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data ?? []).filter((c) => {
      const matchesFilter = filter === "ALL" || c.status === filter;
      const matchesQuery =
        q.length === 0 ||
        c.name.toLowerCase().includes(q) ||
        c.comment.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [data, query, filter]);

  const openAdd = () => {
    setForm(emptyForm);
    setErrors({});
    setModal({ mode: "add" });
  };

  const openEdit = (item: ReviewComment) => {
    setForm({
      name: item.name,
      comment: item.comment,
      rating: item.rating,
      date: item.date,
      status: item.status,
    });
    setErrors({});
    setModal({ mode: "edit", item });
  };

  const validate = () => {
    const next: Partial<Record<keyof CommentInput, string>> = {};
    if (!form.name.trim()) next.name = "Customer name is required.";
    if (!form.comment.trim()) next.comment = "Comment is required.";
    if (form.rating < 1 || form.rating > 5) next.rating = "Rating must be between 1 and 5.";
    if (!form.date) next.date = "Date is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (modal?.mode === "edit") {
        await updateComment(modal.item.id, form);
        toast("Comment updated.");
      } else {
        await createComment(form);
        toast("Comment added.");
      }
      setModal(null);
      reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not save the comment.", "error");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (item: ReviewComment) => {
    const nextStatus: CommentStatus = item.status === "approved" ? "hidden" : "approved";
    try {
      await updateComment(item.id, {
        name: item.name,
        comment: item.comment,
        rating: item.rating,
        date: item.date,
        status: nextStatus,
      });
      toast(
        `Comment ${nextStatus === "approved" ? "approved and published" : "hidden from guests"}.`
      );
      reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not update the comment.", "error");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteComment(deleteTarget.id);
      toast("Comment deleted.");
      setDeleteTarget(null);
      reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not delete the comment.", "error");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="adm-page-head">
        <div>
          <p className="adm-page-kicker">Guest feedback</p>
          <h1>Comments & Reviews</h1>
          <p>
            Review, moderate and publish the comments guests leave about their stay.
          </p>
        </div>
        <button type="button" className="adm-btn" onClick={openAdd}>
          + Add Comment
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
            placeholder="Search comments…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search comments"
          />
        </div>
        <div className="adm-toolbar-actions">
          <select
            className="adm-select"
            aria-label="Filter by status"
            value={filter}
            onChange={(e) => setFilter(e.target.value as "ALL" | CommentStatus)}
          >
            <option value="ALL">All statuses</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {statusLabels[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {status === "loading" ? (
        <div className="adm-list">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="adm-card" style={{ background: "transparent" }}>
          <EmptyState
            title={data && data.length === 0 ? "No comments yet" : "No matches found"}
            hint={
              data && data.length === 0
                ? "When guests leave feedback it will appear here for moderation."
                : "Try a different search term or status filter."
            }
          >
            {data && data.length === 0 && (
              <button type="button" className="adm-btn" onClick={openAdd}>
                + Add Comment
              </button>
            )}
          </EmptyState>
        </div>
      ) : (
        <div className="adm-list">
          <div className="adm-list-head adm-cols-comments">
            <span>Customer</span>
            <span>Comment</span>
            <span>Rating</span>
            <span>Date</span>
            <span>Status</span>
            <span style={{ textAlign: "right" }}>Actions</span>
          </div>
          {filtered.map((c) => (
            <div className="adm-list-row adm-cols-comments" key={c.id}>
              <div className="adm-comment-name">
                <span className="adm-row-label">Customer</span>
                {c.name}
              </div>
              <div className="adm-comment-text">
                <span className="adm-row-label">Comment</span>
                {c.comment}
              </div>
              <div>
                <span className="adm-row-label">Rating</span>
                <AdminStars value={c.rating} />
              </div>
              <div className="adm-mono">
                <span className="adm-row-label">Date</span>
                {c.date.replaceAll("-", ".")}
              </div>
              <div className="adm-status-cell">
                <span className="adm-row-label">Status</span>
                <span className={`adm-pill adm-pill--${c.status}`}>
                  {statusLabels[c.status]}
                </span>
              </div>
              <div className="adm-row-actions" style={{ justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className={`adm-btn--link ${c.status === "approved" ? "adm-toggle-off" : "adm-toggle-on"}`}
                  onClick={() => toggleStatus(c)}
                >
                  {c.status === "approved" ? "Hide" : "Approve"}
                </button>
                <button type="button" className="adm-btn--link" onClick={() => openEdit(c)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="adm-btn--link adm-btn--danger"
                  onClick={() => setDeleteTarget(c)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal
        open={modal !== null}
        onClose={() => !saving && setModal(null)}
        title={modal?.mode === "edit" ? "Edit comment" : "Add comment"}
        kicker={modal?.mode === "edit" ? "Update details" : "New feedback"}
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
              {saving ? "Saving…" : modal?.mode === "edit" ? "Save changes" : "Add comment"}
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
          <Field label="Customer name" htmlFor="c-name" error={errors.name} required>
            <input
              id="c-name"
              className={`adm-input${errors.name ? " adm-input-error" : ""}`}
              type="text"
              value={form.name}
              placeholder="e.g. Isabella Perera"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={saving}
            />
          </Field>
          <Field label="Date" htmlFor="c-date" error={errors.date} required>
            <input
              id="c-date"
              className={`adm-input${errors.date ? " adm-input-error" : ""}`}
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              disabled={saving}
            />
          </Field>
          <Field label="Rating" error={errors.rating} required full>
            <span className="adm-stars-field">
              <AdminStars value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} size={20} />
              <span className="adm-mono">{form.rating} / 5</span>
            </span>
          </Field>
          <Field label="Comment" htmlFor="c-comment" error={errors.comment} required full>
            <textarea
              id="c-comment"
              className={`adm-textarea${errors.comment ? " adm-input-error" : ""}`}
              value={form.comment}
              placeholder="What did the guest say?"
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              disabled={saving}
            />
          </Field>
          <Field label="Status" htmlFor="c-status" required>
            <select
              id="c-status"
              className="adm-select"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as CommentStatus })}
              disabled={saving}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {statusLabels[s]}
                </option>
              ))}
            </select>
          </Field>
        </form>
      </AdminModal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete comment"
        confirmLabel="Delete"
        busy={deleting}
        message={
          deleteTarget
            ? `The comment from ${deleteTarget.name} will be permanently removed. This cannot be undone.`
            : ""
        }
        onCancel={() => !deleting && setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}