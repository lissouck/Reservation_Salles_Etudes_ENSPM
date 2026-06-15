// routes/bookings.js
// Routes liées à la gestion des réservations

const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const protect = require('../middleware/authMiddleware');


// ─── GET /api/bookings/today ──────────────────────────────────────────────────
// Vue administrateur : toutes les réservations du jour en cours
// IMPORTANT : cette route DOIT être déclarée AVANT /:id pour éviter
// qu'Express interprète "today" comme un ObjectId.
router.get('/today', protect, async (req, res, next) => {
  try {
    // Calcule la date du jour au format YYYY-MM-DD (sans dépendance externe)
    const today = new Date().toISOString().split('T')[0];

    const bookings = await Booking.find({ date: today })
      .populate('roomId', 'name capacity features') // Jointure avec la collection Room
      .sort({ timeSlot: 1 });

    res.status(200).json({
      success: true,
      date: today,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/bookings ───────────────────────────────────────────────────────
// Crée une nouvelle réservation
// Règle métier : roomId + date + timeSlot doivent être uniques (doublon interdit)
router.post('/', async (req, res, next) => {
  try {
    const { roomId, studentName, studentGroup, date, timeSlot, purpose } = req.body;

    // ── Validation des champs obligatoires ──
    if (!roomId || !studentName || !date || !timeSlot) {
      res.status(400);
      throw new Error(
        'Champs obligatoires manquants : roomId, studentName, date, timeSlot.'
      );
    }

    // ── Vérifie que la salle référencée existe bien ──
    const room = await Room.findById(roomId);
    if (!room) {
      res.status(404);
      throw new Error('La salle spécifiée est introuvable.');
    }

    // ── Vérification applicative du doublon AVANT l'insertion ──
    // (la contrainte d'index MongoDB constitue le filet de sécurité final)
    const existingBooking = await Booking.findOne({ roomId, date, timeSlot });
    if (existingBooking) {
      res.status(409);
      throw new Error(
        `Le créneau ${timeSlot} est déjà réservé pour la salle "${room.name}" le ${date}.`
      );
    }

    // ── Création de la réservation ──
    const booking = await Booking.create({
      roomId,
      studentName,
      studentGroup: studentGroup || '',
      date,
      timeSlot,
      purpose: purpose || '',
    });

    // Retourne la réservation enrichie avec les infos de la salle
    const populated = await booking.populate('roomId', 'name capacity');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
});

module.exports = router;