const express = require('express');
const router = express.Router();
const { register, login, update } = require('../controllers/authController');
const { authMiddleware, blacklistStore } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: `Halo, ${req.user.name}` });
});

router.post('/logout', authMiddleware, (req, res) => {
  const token = req.token;
  blacklistStore.add(token);
  res.json({ message: `Logout berhasil untuk ${req.user.name}` });
});

// Update profile route (authenticated)
router.put('/update', authMiddleware, update);

module.exports = router;
