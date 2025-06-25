const jwt = require('jsonwebtoken');

// Buat objek blacklist tersendiri yang bisa diakses konsisten
const blacklistStore = new Set();

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Token tidak ditemukan' });
  }

  // Cek apakah token sudah di-blacklist
  if (blacklistStore.has(token)) {
    return res.status(401).json({ message: 'Token sudah logout (ter-blacklist)' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.token = token; // simpan untuk digunakan saat logout
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token tidak valid' });
  }
}

// Ekspor fungsi dan akses ke store blacklist
module.exports = {
  authMiddleware,
  blacklistStore,
};
