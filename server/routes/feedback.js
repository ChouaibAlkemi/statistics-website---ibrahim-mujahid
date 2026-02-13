const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { protect, admin } = require('../middleware/authMiddleware');

// Submit Feedback (Anonymous)
router.post('/submit', async (req, res) => {
  const { totalScore, aggressionLevel, feedbackText } = req.body;

  if (!feedbackText) {
    return res.status(400).json({ message: 'Feedback text is required.' });
  }

  try {
    // Generate Anonymous Name (e.g., 'مجهول 123')
    const count = await Feedback.countDocuments();
    const anonymousName = `مجهول ${count + 1}`;

    const feedback = new Feedback({
      anonymousName,
      totalScore,
      aggressionLevel,
      feedbackText,
    });

    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting feedback', error: error.message });
  }
});

// Get Public Feedback (Approved only)
router.get('/public', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ approved: true })
      .sort({ createdAt: -1 })
      .limit(10); // Limit to latest 10 for performance
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback', error: error.message });
  }
});

// Get Statistics (For Landing Page)
router.get('/stats', async (req, res) => {
  try {
    const totalCount = await Feedback.countDocuments();
    
    // Aggregate counts by aggression level
    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: '$aggressionLevel',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({ totalCount, stats });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
});

// Admin: Get All Feedback
router.get('/admin/all', protect, admin, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback', error: error.message });
  }
});

// Admin: Approve Feedback
router.put('/admin/:id/approve', protect, admin, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    feedback.approved = true;
    await feedback.save();
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error approving feedback', error: error.message });
  }
});

// Admin: Delete Feedback
router.delete('/admin/:id', protect, admin, async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.json({ message: 'Feedback deleted' });
  } catch (error) {
     res.status(500).json({ message: 'Error deleting feedback', error: error.message });
  }
});

module.exports = router;
