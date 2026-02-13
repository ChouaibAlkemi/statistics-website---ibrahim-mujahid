const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback'); // Now uses our PG wrapper
const { protect, admin } = require('../middleware/authMiddleware');

// Submit Feedback (Anonymous)
router.post('/submit', async (req, res) => {
  const { totalScore, aggressionLevel, feedbackText, answers } = req.body;

  if (!feedbackText) {
    return res.status(400).json({ message: 'Feedback text is required.' });
  }

  try {
    const count = await Feedback.countDocuments();
    const anonymousName = `مجهول ${count + 1}`;

    const feedback = await Feedback.create({
      anonymousName,
      totalScore,
      aggressionLevel,
      feedbackText,
      answers
    });

    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting feedback', error: error.message });
  }
});

// Get Public Feedback
router.get('/public', async (req, res) => {
  try {
    // Basic "find" handles approved filter, but sorting/limit is hacky in the model wrapper
    // Ideally we write raw SQL here or enhance the model
    const feedbacks = await Feedback.find({ approved: true });
    // Sort manually for now since our basic wrapper returns all
    feedbacks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(feedbacks.slice(0, 10));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback', error: error.message });
  }
});

// Stats
router.get('/stats', async (req, res) => {
  try {
    const data = await Feedback.getStats();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
});

// Admin All
router.get('/admin/all', protect, admin, async (req, res) => {
  try {
    const feedbacks = await Feedback.find(); 
    feedbacks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback', error: error.message });
  }
});

// Admin Approve
router.put('/admin/:id/approve', protect, admin, async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, { approved: true });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error approving feedback', error: error.message });
  }
});

// Admin Delete
router.delete('/admin/:id', protect, admin, async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: 'Feedback deleted' });
  } catch (error) {
     res.status(500).json({ message: 'Error deleting feedback', error: error.message });
  }
});

module.exports = router;
