const express = require('express');
const router = express.Router();
const { register, login, update, getProfile } = require('../controllers/authController'); // Tambah getProfile
const { authMiddleware, blacklistStore } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);

// Perubahan di sini: Ganti dengan fungsi controller
router.get('/profile', authMiddleware, getProfile); 

router.post('/logout', authMiddleware, (req, res) => {
  const token = req.token;
  blacklistStore.add(token);
  res.json({ message: `Logout berhasil untuk ${req.user.name}` });
});

router.put('/update', authMiddleware, update);

module.exports = router;