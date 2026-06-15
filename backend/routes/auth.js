// routes/auth.js
const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Vérifie les credentials depuis le .env
  if (
    email    !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({
      success: false,
      message: 'Email ou mot de passe incorrect.'
    });
  }

  // Génère le token JWT valable 8 heures
  const token = jwt.sign(
    { role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.status(200).json({ success: true, token });
});

module.exports = router;