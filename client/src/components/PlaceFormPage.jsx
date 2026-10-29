import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import NavBar from "./NavBar";
import { Button, Field, inputCls, STATUS } from "./ui";

const empty = { name: "", location: "", description: "", imageUrl: "", status: "wishlist", favorite: false };

// Shared by AddEntityPage (no id) and UpdateEntityPage (with id).
export default function PlaceFormPage({ id }) {
  const navigate = useNavigate();
  const editing = Boolean(id);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(editing);
  const [loadError, setLoadError] = useState("");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (!editing) return;
    let cancelled = false;
    api
      .getPlace(id)
      .then((p) => {
        if (cancelled) return;
        setForm({
          name: p.name || "",
          location: p.location || "",
          description: p.description || "",
          imageUrl: p.imageUrl || "",
          status: p.status || "wishlist",
          favorite: Boolean(p.favorite),
        });
      })
      .catch((err) => !cancelled && setLoadError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id, editing]);

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const validate = () => {
    const errs = {};
    if (form.name.trim().length < 2) errs.name = "Name must be at least 2 characters";
    if (form.location.trim().length < 2) errs.location = "Location must be at least 2 characters";
    if (form.description.length > 500) errs.description = "Description can be at most 500 characters";
    if (form.imageUrl && !/^https?:\/\//i.test(form.imageUrl.trim())) errs.imageUrl = "Must start with http:// or https://";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setServerError("");
    const payload = {
      ...form,
      name: form.name.trim(),
      location: form.location.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim(),
    };
    try {
      const saved = editing ? await api.updatePlace(id, payload) : await api.createPlace(payload);
      navigate(`/places?saved=${editing ? "updated" : "added"}&tab=${saved?.status || "all"}`);
    } catch (err) {
      setServerError(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavBar />
      <main className="mx-auto max-w-xl px-4 py-8">
        <Link to="/places" className="text-sm text-gray-400 hover:text-white">← Back to places</Link>
        <h1 className="mt-3 text-2xl font-bold">{editing ? "Update place" : "Add a new place"}</h1>

        {loading ? (
          <div className="mt-6 h-96 animate-pulse rounded-xl bg-gray-800/60" />
        ) : loadError ? (
          <div className="mt-6 rounded-xl bg-rose-500/10 p-6 text-center ring-1 ring-rose-500/30">
            <p className="text-rose-300">{loadError}</p>
            <Link to="/places" className="mt-3 inline-block text-sm text-gray-300 underline">Back to places</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4 rounded-xl bg-gray-800/40 p-5 ring-1 ring-gray-700" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name *" error={errors.name}>
                <input name="name" className={inputCls} value={form.name} onChange={set("name")} placeholder="Kyoto" autoFocus maxLength={100} />
              </Field>
              <Field label="Location *" error={errors.location}>
                <input name="location" className={inputCls} value={form.location} onChange={set("location")} placeholder="Japan" maxLength={100} />
              </Field>
            </div>
            <Field label={`Description (${form.description.length}/500)`} error={errors.description}>
              <textarea
                name="description"
                className={`${inputCls} min-h-[96px]`}
                value={form.description}
                onChange={set("description")}
                placeholder="Why do you want to go? What's it like?"
              />
            </Field>
            <Field label="Image URL" error={errors.imageUrl}>
              <input name="imageUrl" className={inputCls} value={form.imageUrl} onChange={set("imageUrl")} placeholder="https://…" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2 sm:items-end">
              <Field label="List">
                <select name="status" className={inputCls} value={form.status} onChange={set("status")}>
                  {Object.entries(STATUS).map(([value, { label }]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </Field>
              <label className="flex items-center gap-2 pb-2 text-sm text-gray-300">
                <input type="checkbox" checked={form.favorite} onChange={set("favorite")} className="h-4 w-4 accent-amber-400" />
                Add to favorites
              </label>
            </div>
            {serverError && <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{serverError}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => navigate("/places")} disabled={saving}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? "Saving…" : editing ? "Save changes" : "Add place"}</Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
