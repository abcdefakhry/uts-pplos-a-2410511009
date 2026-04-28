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

exports.login = async (req, res) => {
};
