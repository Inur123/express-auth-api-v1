const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const supabase = require('../lib/supabase');

// REGISTER
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Cek apakah email sudah terdaftar
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (existingUser)
    return res.status(400).json({ message: 'Email sudah terdaftar' });

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert ke database
  const { error } = await supabase
    .from('users')
    .insert([{ name, email, password: hashedPassword }]);

  if (error)
    return res.status(500).json({ message: 'Gagal mendaftar', error });

  res.status(201).json({ message: 'Registrasi berhasil' });
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user)
    return res.status(401).json({ message: 'Email tidak ditemukan' });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid)
    return res.status(401).json({ message: 'Password salah' });

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
};
