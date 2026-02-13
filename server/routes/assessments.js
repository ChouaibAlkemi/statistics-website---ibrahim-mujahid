const express = require('express');
const Assessment = require('../models/Assessment');
const { appendToSheet } = require('../utils/googleSheets');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware to protect routes
const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    // If no token, we can allow anonymous submission if desired, but user history won't work
    // For now, let's allow it but set req.user to null
    req.user = null;
    next();
  }
};

// Submit Assessment
router.post('/', protect, async (req, res) => {
  const { answers, totalScore, aggressionLevel } = req.body;
  
  if (!answers || answers.length !== 50) {
      return res.status(400).json({ message: 'Invalid answers format. Must be 50 questions.' });
  }

  try {
    const assessment = await Assessment.create({
      userId: req.user ? req.user.id : null,
      answers,
      totalScore,
      aggressionLevel,
    });

    // Append to Google Sheet (Async, don't block response)
    // We can fetch user details if req.user exists, but for now lets keep it simple or async fetch
    appendToSheet([
      new Date().toISOString(),
      req.user ? req.user.id : 'Anonymous', // Ideally fetch name, but ID is what we have in token
      req.user ? req.user.email : 'N/A', // We need to fetch user to get email if not in token
      totalScore,
      aggressionLevel,
      // Add section scores if needed, for now just basic data
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
    const assessments = await Assessment.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assessments', error: error.message });
  }
});

module.exports = router;
