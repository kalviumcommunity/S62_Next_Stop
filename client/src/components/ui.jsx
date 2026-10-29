import { useEffect } from "react";

export const STATUS = {
  wishlist: { label: "Wishlist", badge: "bg-amber-400/15 text-amber-300 ring-amber-400/30" },
  visited: { label: "Visited", badge: "bg-emerald-400/15 text-emerald-300 ring-emerald-400/30" },
  revisit: { label: "Revisit", badge: "bg-indigo-400/15 text-indigo-300 ring-indigo-400/30" },
};

export function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.wishlist;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${s.badge}`}>
      {s.label}
    </span>
  );
}

export function Stars({ value, onChange, size = "text-base" }) {
  return (
    <span className={`inline-flex gap-0.5 ${size}`} aria-label={value ? `${value} out of 5 stars` : "No rating"}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = value >= n - 0.25;
        const cls = filled ? "text-amber-400" : "text-gray-600";
        return onChange ? (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`${cls} hover:scale-110 transition`}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
          >
            ★
          </button>
        ) : (
          <span key={n} className={cls}>★</span>
        );
      })}
    </span>
  );
}

export function Button({ variant = "primary", className = "", ...props }) {
  const styles = {
    primary: "bg-emerald-500 text-gray-900 hover:bg-emerald-400",
    secondary: "bg-gray-800 text-gray-100 ring-1 ring-gray-700 hover:bg-gray-700",
    ghost: "text-gray-300 hover:bg-gray-800 hover:text-white",
    danger: "bg-rose-500/90 text-white hover:bg-rose-500",
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]} ${className}`}
      {...props}
    />
  );
}

export function Modal({ title, onClose, children, wide = false }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`w-full ${wide ? "sm:max-w-2xl" : "sm:max-w-lg"} max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-gray-900 ring-1 ring-gray-700 shadow-2xl`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-800 bg-gray-900/95 px-5 py-4">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="rounded-md p-1 text-gray-400 hover:bg-gray-800 hover:text-white" aria-label="Close">
            ✕
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-300">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-rose-400">{error}</span>}
    </label>
  );
}

export const inputCls =
  "w-full rounded-lg bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 ring-1 ring-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500";

export function ConfirmDialog({ title, message, confirmLabel = "Delete", onConfirm, onCancel, busy }) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="text-sm text-gray-300">{message}</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={busy}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm} disabled={busy}>{busy ? "Deleting…" : confirmLabel}</Button>
      </div>
    </Modal>
  );
}

export function Toast({ toast }) {
  if (!toast) return null;
  const color = toast.type === "error" ? "bg-rose-500 text-white" : "bg-emerald-500 text-gray-900";
  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 px-4">
      <div className={`rounded-lg px-4 py-2.5 text-sm font-semibold shadow-lg ${color}`} role="status">
        {toast.message}
      </div>
    </div>
  );
}
