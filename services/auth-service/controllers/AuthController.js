const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateTokens = (user) => {
  const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

exports.register = async (req, res) => {
  try {
    const { nama, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ nama, email, password: hashedPassword });
    res.status(201).json({ message: "User berhasil dibuat", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// untuk login manual
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const tokens = generateTokens(user);

    // refresh token ke database
    user.refresh_token = tokens.refreshToken;
    await user.save();

    res.json({ ...tokens, user: { id: user.id, nama: user.nama, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// endpoint refresh token
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: "Refresh token diperlukan" });

  try {
    const user = await User.findOne({ where: { refresh_token: refreshToken } });
    if (!user) return res.status(403).json({ message: "Refresh token tidak valid" });

    // verifi token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Refresh token kadaluarsa" });

      const newTokens = generateTokens(user);
      user.refresh_token = newTokens.refreshToken;
      user.save();

      res.json(newTokens);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// endpoint logout
exports.logout = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user) {
      user.refresh_token = null;
      await user.save();
    }
    res.json({ message: "Logout berhasil" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
