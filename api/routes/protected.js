const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// @route   GET api/protected/me
// @desc    Get current user's data
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // User data is already attached by the auth middleware
    res.json({
      user: {
        id: req.user.id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        createdAt: req.user.createdAt
      },
      message: 'Protected content retrieved successfully'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
