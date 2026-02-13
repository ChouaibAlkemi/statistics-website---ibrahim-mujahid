const express = require('express');
const Assessment = require('../models/Assessment');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware to protect admin routes
const admin = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role === 'admin') {
          req.user = decoded;
          next();
      } else {
        res.status(403).json({ message: 'Not authorized as admin' });
      }
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// GetAllAssessments
router.get('/assessments', admin, async (req, res) => {
  try {
    const assessments = await Assessment.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assessments', error: error.message });
  }
});

// GetStats
router.get('/stats', admin, async (req, res) => {
  try {
    const totalAssessments = await Assessment.countDocuments();
    const highRisk = await Assessment.countDocuments({ aggressionLevel: 'High' });
    const criticalRisk = await Assessment.countDocuments({ aggressionLevel: 'Critical' });
    const mediumRisk = await Assessment.countDocuments({ aggressionLevel: 'Medium' });
    const lowRisk = await Assessment.countDocuments({ aggressionLevel: 'Low' });

    res.json({
      total: totalAssessments,
      breakdown: {
        Low: lowRisk,
        Medium: mediumRisk,
        High: highRisk,
        Critical: criticalRisk,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

module.exports = router;
