import { useState } from "react";
import { Button, Field, Modal, Stars, StatusBadge, inputCls } from "./ui";

const emptyReview = { author: "", rating: 0, comment: "" };

function ReviewForm({ initial = emptyReview, onSubmit, onCancel, submitLabel }) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.author.trim() || !form.comment.trim()) return setError("Name and review are required");
    if (!form.rating) return setError("Pick a rating");
    setSaving(true);
    setError("");
    try {
      await onSubmit({ author: form.author.trim(), rating: form.rating, comment: form.comment.trim() });
      setForm(emptyReview);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-xl bg-gray-800/60 p-4 ring-1 ring-gray-700" noValidate>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Field label="Your name">
            <input className={inputCls} value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} maxLength={60} />
          </Field>
        </div>
        <div>
          <span className="mb-1 block text-sm font-medium text-gray-300">Rating</span>
          <Stars value={form.rating} onChange={(rating) => setForm({ ...form, rating })} size="text-2xl" />
        </div>
      </div>
      <Field label="Review">
        <textarea
          className={`${inputCls} min-h-[72px]`}
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          placeholder="What was it like? Tips for others?"
          maxLength={1000}
        />
      </Field>
      {error && <p className="text-sm text-rose-400">{error}</p>}
      <div className="flex justify-end gap-2">
        {onCancel && <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>}
        <Button type="submit" disabled={saving}>{saving ? "Saving…" : submitLabel}</Button>
      </div>
    </form>
  );
}

export default function PlaceDetail({ place, onClose, onEdit, onAddReview, onUpdateReview, onDeleteReview }) {
  const [editingId, setEditingId] = useState(null);
  const reviews = [...(place.reviews || [])].reverse();

  return (
    <Modal title={place.name} onClose={onClose} wide>
      {place.imageUrl && (
        <img src={place.imageUrl} alt={place.name} className="mb-4 aspect-[16/7] w-full rounded-xl object-cover" />
      )}
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status={place.status} />
        <span className="text-sm text-gray-400">{place.location}</span>
        {place.status !== "wishlist" && place.visitedAt && (
          <span className="text-sm text-gray-500">Visited {new Date(place.visitedAt).toLocaleDateString()}</span>
        )}
        <Button variant="secondary" className="ml-auto" onClick={onEdit}>Edit place</Button>
      </div>
      {place.description && <p className="mt-3 text-gray-300">{place.description}</p>}

      <div className="mt-6 flex items-center justify-between">
        <h3 className="text-base font-semibold text-white">Reviews</h3>
        {place.averageRating && (
          <span className="flex items-center gap-2 text-sm text-gray-400">
            <Stars value={place.averageRating} size="text-sm" /> {place.averageRating} / 5
          </span>
        )}
      </div>

      <div className="mt-3">
        <ReviewForm submitLabel="Post review" onSubmit={onAddReview} />
      </div>

      <ul className="mt-4 space-y-3">
        {reviews.length === 0 && <li className="text-sm text-gray-500">No reviews yet. Be the first.</li>}
        {reviews.map((r) =>
          editingId === r._id ? (
            <li key={r._id}>
              <ReviewForm
                initial={{ author: r.author, rating: r.rating, comment: r.comment }}
                submitLabel="Save review"
                onCancel={() => setEditingId(null)}
                onSubmit={async (review) => {
                  await onUpdateReview(r._id, review);
                  setEditingId(null);
                }}
              />
            </li>
          ) : (
            <li key={r._id} className="rounded-xl bg-gray-800/40 p-4 ring-1 ring-gray-800">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{r.author}</span>
                  <Stars value={r.rating} size="text-sm" />
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditingId(r._id)} className="rounded px-2 py-1 text-xs text-gray-400 hover:bg-gray-700 hover:text-white">Edit</button>
                  <button onClick={() => onDeleteReview(r._id)} className="rounded px-2 py-1 text-xs text-rose-300 hover:bg-rose-500/15">Delete</button>
                </div>
              </div>
              <p className="mt-1.5 text-sm text-gray-300 whitespace-pre-line">{r.comment}</p>
              <p className="mt-1 text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</p>
            </li>
          )
        )}
      </ul>
    </Modal>
  );
}
