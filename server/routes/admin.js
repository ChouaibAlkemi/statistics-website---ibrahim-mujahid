const express = require('express');
const Assessment = require('../models/Assessment');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// GetAllAssessments
router.get('/assessments', protect, admin, async (req, res) => {
  try {
    const assessments = await Assessment.findAll();
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assessments', error: error.message });
  }
});

// GetStats
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const stats = await Assessment.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

module.exports = router;
