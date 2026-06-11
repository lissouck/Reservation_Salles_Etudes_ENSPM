// server.js
// Point d'entrée du serveur Express — Réservation de Salles d'Étude
// ENSP Maroua — Département Génie Informatique 2025-2026

require('dotenv').config(); // Charge les variables d'environnement depuis .env
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// ─── Connexion à MongoDB ──────────────────────────────────────────────────────
connectDB();

const app = express();

// ─── Middlewares globaux ──────────────────────────────────────────────────────

// Active CORS pour permettre au frontend React (port 5173) d'appeler l'API
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

// Parse automatiquement les corps de requête JSON
app.use(express.json());

// ─── Routes API ───────────────────────────────────────────────────────────────
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/bookings', require('./routes/bookings'));

// Route racine — vérification rapide que le serveur tourne
app.get('/', (req, res) => {
  res.json({
    message: '  API Réservation de Salles — ENSP Maroua',
    version: '1.0.0',
    status: 'opérationnel',
  });
});

// ─── Middleware de gestion des erreurs (doit être en dernier) ─────────────────
app.use(errorHandler);

// ─── Démarrage du serveur ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Serveur démarré sur http://localhost:${PORT}`);
  console.log(` Environnement : ${process.env.NODE_ENV || 'development'}`);
});