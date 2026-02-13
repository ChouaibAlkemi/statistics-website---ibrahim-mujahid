const express = require('express');
const Assessment = require('../models/Assessment');
const { appendToSheet } = require('../utils/googleSheets');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Submit Assessment
router.post('/', async (req, res) => {
  // Check token manually if not using protect middleware for optional auth
  // But for consistency let's handle optional auth logic here or rely on protect if token present?
  // The logic in original file seemed to allow anonymous if no token.
  // We can replicate that logic or use a custom middleware.
  
  let user = null;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Use protect logic manually or separate middleware
      // For simplicity, let's assume if token is passed, it must be valid.
      // But verify token first.
      try {
           const jwt = require('jsonwebtoken');
           const token = req.headers.authorization.split(' ')[1];
           const decoded = jwt.verify(token, process.env.JWT_SECRET);
           user = { id: decoded.id, email: 'user@example.com' }; // Mock email or fetch user
      } catch (e) {
          // invalid token
      }
  }

  const { answers, totalScore, aggressionLevel } = req.body;
  
  if (!answers || answers.length !== 50) {
      return res.status(400).json({ message: 'Invalid answers format. Must be 50 questions.' });
  }

  try {
    const assessment = await Assessment.create({
      userId: user ? user.id : null,
      answers,
      totalScore,
      aggressionLevel,
    });

    // Append to Google Sheet
    appendToSheet([
      new Date().toISOString(),
      user ? user.id : 'Anonymous', 
      user ? user.email : 'N/A', 
      totalScore,
      aggressionLevel,
    ]).catch(err => console.error("Google Sheets Error:", err));

    res.status(201).json(assessment);
  } catch (error) {
    res.status(400).json({ message: 'Error submitting assessment', error: error.message });
  }
});

// Get User's Assessments
router.get('/my-assessments', protect, async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Not authorized' });
  try {
    const assessments = await Assessment.find({ userId: req.user.id });
    // Already sorted in SQL
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assessments', error: error.message });
  }
});

module.exports = router;
