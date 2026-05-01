const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');

const generateTokens = (user) => {
  const accessToken = jwt.sign({ id: user.id, role: user.role}, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

exports.register = async (req, res) => {
  try {
    const { nama, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ nama, email, password: hashedPassword, role: role || 'user' });
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

    res.json({ ...tokens, user: { id: user.id, nama: user.nama, email: user.email, role: user.role} });
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

// untuk user ke github
exports.githubLogin = (req, res) => {
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}&scope=user:email`;
  res.redirect(url);
};

// fungsi callback untuk kode dari GitHub
exports.githubCallback = async (req, res) => {
  const { code } = req.query;
  try {
    // tukar code dengan access token gitHub
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: code
    }, { headers: { accept: 'application/json' } });

    const githubToken = tokenResponse.data.access_token;

    // ambil data user dari gitHub
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${githubToken}` }
    });

    const { login, email, avatar_url } = userResponse.data;

    // simpan nama, email, foto
    let user = await User.findOne({ where: { email: email || `${login}@github.com` } });

    if (!user) {
      user = await User.create({
        nama: login,
        email: email || `${login}@github.com`,
        foto_profil: avatar_url,
        oauth_provider: 'github' // Wajib ada flag ini [cite: 40]
      });
    }

    // fungsi generatetoken
    const tokens = generateTokens(user);
    user.refresh_token = tokens.refreshToken;
    await user.save();

    res.json({ message: "Login GitHub Berhasil", ...tokens, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
