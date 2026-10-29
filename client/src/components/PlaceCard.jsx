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
import { Link } from "react-router-dom";
import apiClient from "../services/api";

const catEmoji = { beach:"🏖️", mountain:"🏔️", city:"🏙️", historical:"🏛️", nature:"🌿", cultural:"🎭", adventure:"🧗", other:"📍" };

const catImages = {
  beach:      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=240&fit=crop&auto=format",
  mountain:   "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=240&fit=crop&auto=format",
  city:       "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=240&fit=crop&auto=format",
  historical: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&h=240&fit=crop&auto=format",
  nature:     "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=240&fit=crop&auto=format",
  cultural:   "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&h=240&fit=crop&auto=format",
  adventure:  "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=240&fit=crop&auto=format",
  other:      "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&h=240&fit=crop&auto=format",
};

const PlaceCard = ({
  id, name, description, location, category, visited, rating,
  favorite, likes = [], comments = [],
  onToggleFavorite, showFavorite = true, showActions = true,
  onUpdate, onDelete, linkTo = null,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [likeCount, setLikeCount] = useState(likes.length);
  const [liked, setLiked] = useState(false);
  const [localComments, setLocalComments] = useState(comments);
  const [commenting, setCommenting] = useState(false);

  const emoji = catEmoji[category] || "📍";
  const stars = "⭐".repeat(Math.max(1, Math.ceil((rating || 0) / 2)));

  const handleLike = async (e) => {
    e.preventDefault(); e.stopPropagation();
    try {
      const res = await apiClient.post(`/social/places/${id}/like`);
      setLiked(res.data.liked);
      setLikeCount(res.data.likeCount);
    } catch (err) { console.error(err); }
  };

  const handleAddComment = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!newComment.trim()) return;
    setCommenting(true);
    try {
      const res = await apiClient.post(`/social/places/${id}/comments`, { text: newComment });
      setLocalComments([...localComments, res.data.comment]);
      setNewComment("");
    } catch (err) { console.error(err); }
    finally { setCommenting(false); }
  };

  const handleDelComment = async (cid) => {
    try {
      await apiClient.delete(`/social/places/${id}/comments/${cid}`);
      setLocalComments(localComments.filter((c) => c._id !== cid));
    } catch (err) { console.error(err); }
  };

  const cardImg = (typeof imageUrl === "string" && imageUrl.trim()) ? imageUrl : (catImages[category] || catImages.other);

  const CardContent = () => (
    <div className="group glass-card-hover flex flex-col h-full overflow-hidden">
      {/* Cover image */}
      <div className="relative h-40 overflow-hidden rounded-t-2xl">
        <img
          src={cardImg}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = catImages.other; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/80 to-transparent" />
        <span className="absolute bottom-2 right-3 text-xl">{emoji}</span>
        {visited && (
          <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-semibold bg-emerald-500/80 text-white rounded-full">
            ✓ Visited
          </span>
        )}
      </div>

      {/* Header */}
      <div className="flex items-start justify-between p-5 pb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-lg leading-snug group-hover:text-cyan-300 transition-colors truncate">
            {name}
          </h3>
          <p className="text-blue-300/50 text-xs mt-0.5 flex items-center gap-1 truncate">
            <span>📍</span> {location}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-2 shrink-0">
          <span className="text-xl" title={category}>{emoji}</span>
          {showFavorite && onToggleFavorite && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite(id); }}
              className={`text-lg hover:scale-125 transition-transform ${favorite ? "text-pink-500" : "text-blue-800 hover:text-pink-400"}`}
            >
              {favorite ? "❤️" : "🤍"}
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-blue-200/60 text-sm px-5 line-clamp-2 flex-grow">{description || "No description."}</p>

      {/* Chips */}
      <div className="flex flex-wrap gap-2 px-5 mt-3">
        {rating && (
          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs">
            {stars} {rating}/10
          </span>
        )}
        {!visited && (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-blue-500/10 border-blue-500/25 text-blue-300">
            ☐ Wishlist
          </span>
        )}
      </div>

      {/* Social row */}
      <div className="flex items-center gap-4 px-5 mt-3 pb-3">
        <button onClick={handleLike}
          className={`flex items-center gap-1 text-xs transition-colors ${liked ? "text-cyan-400" : "text-blue-500/60 hover:text-cyan-400"}`}>
          <span>{liked ? "💙" : "🤍"}</span> {likeCount}
        </button>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowComments(!showComments); }}
          className="flex items-center gap-1 text-xs text-blue-500/60 hover:text-cyan-400 transition-colors">
          <span>💬</span> {localComments.length}
        </button>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = `/memories?place=${id}`; }}
          className="flex items-center gap-1 text-xs text-blue-500/60 hover:text-cyan-400 transition-colors">
          <span>📸</span> Memories
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="px-5 pb-4 border-t border-blue-500/10 pt-3 space-y-2">
          <p className="text-blue-400/50 text-xs font-semibold uppercase tracking-wide">Comments</p>
          {localComments.length === 0 && <p className="text-blue-500/40 text-xs italic">No comments yet.</p>}
          <div className="space-y-1.5 max-h-28 overflow-y-auto">
            {localComments.map((c) => (
              <div key={c._id} className="flex items-start gap-2 text-xs">
                <span className="text-cyan-400 font-semibold shrink-0">{c.userName}:</span>
                <span className="text-blue-200/70 flex-1">{c.text}</span>
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelComment(c._id); }}
                  className="text-red-400/40 hover:text-red-400 shrink-0">✕</button>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-1.5 bg-blue-950/50 border border-blue-500/20 rounded-lg text-xs text-white placeholder-blue-500/40 focus:outline-none focus:border-blue-500/40"
              onClick={(e) => e.stopPropagation()}
            />
            <button type="submit" disabled={commenting}
              className="px-3 py-1.5 bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-lg text-xs hover:bg-blue-600/50 transition-colors disabled:opacity-50">
              Send
            </button>
          </form>
        </div>
      )}

      {/* Actions */}
      {showActions && (onUpdate || onDelete) && (
        <div className="flex gap-2 px-5 pb-5 pt-2 border-t border-blue-500/10 mt-auto">
          {onUpdate && (
            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onUpdate(id); }}
              className="flex-1 py-2 text-xs bg-blue-600/15 border border-blue-500/25 text-blue-300 rounded-xl hover:bg-blue-600/30 transition-colors font-medium">
              Edit
            </button>
          )}
          {onDelete && (
            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(id); }}
              className="flex-1 py-2 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors font-medium">
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );

  if (linkTo) return <Link to={linkTo} className="block h-full"><CardContent /></Link>;
  return <CardContent />;
};

export default PlaceCard;
