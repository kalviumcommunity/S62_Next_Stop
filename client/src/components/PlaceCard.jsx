import { useState } from "react";
import { Stars, StatusBadge } from "./ui";

function Cover({ place }) {
  const [broken, setBroken] = useState(false);
  if (place.imageUrl && !broken) {
    return (
      <img
        src={place.imageUrl}
        alt={place.name}
        loading="lazy"
        onError={() => setBroken(true)}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-900 via-gray-800 to-teal-900">
      <span className="text-5xl font-bold text-white/20">{place.name.charAt(0).toUpperCase()}</span>
    </div>
  );
}

const STATUS_ACTIONS = {
  wishlist: [{ to: "visited", label: "Mark visited" }],
  visited: [{ to: "revisit", label: "Add to revisit" }],
  revisit: [
    { to: "visited", label: "Visited again" },
    { to: "wishlist", label: "Back to wishlist" },
  ],
};

export default function PlaceCard({ place, onOpen, onEdit, onDelete, onStatus, onFavorite }) {
  const reviews = place.reviews?.length || 0;
  const actions = STATUS_ACTIONS[place.status] || STATUS_ACTIONS.wishlist;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-gray-800/60 ring-1 ring-gray-700 transition hover:ring-gray-500">
      <button onClick={onOpen} className="relative aspect-[16/10] overflow-hidden text-left" aria-label={`Open ${place.name}`}>
        <Cover place={place} />
        <div className="absolute left-3 top-3">
          <StatusBadge status={place.status} />
        </div>
      </button>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold text-white">{place.name}</h3>
            <p className="truncate text-sm text-gray-400">{place.location}</p>
          </div>
          <button
            onClick={onFavorite}
            className={`shrink-0 rounded-md p-1 text-xl leading-none transition ${place.favorite ? "text-amber-400" : "text-gray-600 hover:text-gray-400"}`}
            aria-label={place.favorite ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={place.favorite}
          >
            {place.favorite ? "♥" : "♡"}
          </button>
        </div>

        {place.description && <p className="mt-2 line-clamp-2 text-sm text-gray-300">{place.description}</p>}

        <button onClick={onOpen} className="mt-3 flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200">
          <Stars value={place.averageRating || 0} size="text-sm" />
          <span>{reviews ? `${place.averageRating} · ${reviews} review${reviews > 1 ? "s" : ""}` : "No reviews yet"}</span>
        </button>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
          {actions.map((a) => (
            <button
              key={a.to}
              onClick={() => onStatus(a.to)}
              className="rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/30 hover:bg-emerald-500/25"
            >
              {a.label}
            </button>
          ))}
          <div className="ml-auto flex gap-1">
            <button onClick={onEdit} className="rounded-md px-2 py-1.5 text-xs font-medium text-gray-300 hover:bg-gray-700">Edit</button>
            <button onClick={onDelete} className="rounded-md px-2 py-1.5 text-xs font-medium text-rose-300 hover:bg-rose-500/15">Delete</button>
          </div>
        </div>
      </div>
    </article>
  );
}
