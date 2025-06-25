const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { authMiddleware, blacklistStore } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);

// protected route
router.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: `Halo, ${req.user.name}` }); // gunakan .name sesuai token
});

router.post('/logout', authMiddleware, (req, res) => {
  const token = req.token;
  blacklistStore.add(token); // gunakan .add karena Set
  res.json({ message: `Logout berhasil untuk ${req.user.name}` });
});

module.exports = router;
///cek
