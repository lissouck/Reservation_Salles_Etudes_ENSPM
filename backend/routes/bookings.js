// routes/bookings.js 
const express = require('express'); 
const router  = express.Router(); 
const Booking = require('../models/Booking'); 
const Room    = require('../models/Room'); 
  
// GET /api/bookings/today — toutes les réservations du jour 
// IMPORTANT : déclaré AVANT /:id pour éviter le conflit de route 
router.get('/today', async (req, res, next) => { 
  try { 
    const today = new Date().toISOString().split('T')[0]; 
    const bookings = await Booking.find({ date: today }) 
      .populate('roomId', 'name capacity features') 
      .sort({ timeSlot: 1 }); 
    res.status(200).json({ success: true, date: today, count: bookings.length, 
data: bookings }); 
  } catch (error) { next(error); } 
}); 
  
// POST /api/bookings — crée une réservation 
router.post('/', async (req, res, next) => { 
  try { 
    const { roomId, studentName, studentGroup, date, timeSlot, purpose } = 
req.body; 
    if (!roomId || !studentName || !date || !timeSlot) { 
      res.status(400); 
      throw new Error('Champs obligatoires manquants : roomId, studentName, date, 
timeSlot.'); 
    } 
    const room = await Room.findById(roomId); 
    if (!room) { res.status(404); throw new Error('Salle introuvable.'); } 
    const existing = await Booking.findOne({ roomId, date, timeSlot }); 
    if (existing) { 
      res.status(409); 
      throw new Error(`Le créneau ${timeSlot} est déjà réservé pour "${room.name}" 
le ${date}.`); 
    } 
    const booking = await Booking.create({ roomId, studentName, studentGroup: 
studentGroup || '', date, timeSlot, purpose: purpose || '' }); 
    const populated = await booking.populate('roomId', 'name capacity'); 
    res.status(201).json({ success: true, data: populated }); 
  } catch (error) { next(error); } 
}); 
  
module.exports = router; 