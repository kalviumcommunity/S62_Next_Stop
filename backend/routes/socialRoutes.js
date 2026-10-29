const express = require('express');
const router = express.Router();
const Place = require('../models/itemModel');
const User = require('../models/User');
const protect = require('../middleware/authMiddleware');

// POST /api/social/places/:id/like - toggle like
router.post('/places/:id/like', protect, async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: 'Place not found' });

    const alreadyLiked = place.likes.includes(req.userId);
    if (alreadyLiked) {
      place.likes = place.likes.filter(id => id.toString() !== req.userId);
    } else {
      place.likes.push(req.userId);
    }

    await place.save();
    res.json({ liked: !alreadyLiked, likeCount: place.likes.length });
  } catch (err) {
    console.error('Error toggling like:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST /api/social/places/:id/comments - add a comment
router.post('/places/:id/comments', protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: 'Place not found' });

    const user = await User.findById(req.userId).select('name');

    const comment = {
      user: req.userId,
      userName: user ? user.name : 'Traveler',
      text: text.trim(),
    };

    place.comments.push(comment);
    await place.save();

    const savedComment = place.comments[place.comments.length - 1];
    res.status(201).json({ message: 'Comment added', comment: savedComment });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE /api/social/places/:id/comments/:commentId - delete a comment
router.delete('/places/:id/comments/:commentId', protect, async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: 'Place not found' });

    const comment = place.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.user.toString() !== req.userId && place.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    place.comments = place.comments.filter(c => c._id.toString() !== req.params.commentId);
    await place.save();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
