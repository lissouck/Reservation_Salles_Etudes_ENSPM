// routes/rooms.js 
const express  = require('express'); 
const router   = express.Router(); 
const Room     = require('../models/Room'); 
const Booking  = require('../models/Booking'); 
  
// GET /api/rooms — liste toutes les salles 
router.get('/', async (req, res, next) => { 
  try { 
    const rooms = await Room.find().sort({ name: 1 }); 
    res.status(200).json({ success: true, count: rooms.length, data: rooms }); 
  } catch (error) { next(error); } 
}); 
  
// GET /api/rooms/:id — une salle par son id 
router.get('/:id', async (req, res, next) => { 
  try { 
    const room = await Room.findById(req.params.id); 
    if (!room) { res.status(404); throw new Error('Salle introuvable.'); } 
    res.status(200).json({ success: true, data: room }); 
  } catch (error) { next(error); } 
}); 
  
// POST /api/rooms — crée une nouvelle salle 
router.post('/', async (req, res, next) => { 
  try { 
    const { name, capacity, features } = req.body; 
    if (!name || !capacity) { 
      res.status(400); 
      throw new Error('Les champs "name" et "capacity" sont obligatoires.'); 
    } 
    const room = await Room.create({ name, capacity, features: features || [] }); 
    res.status(201).json({ success: true, data: room }); 
  } catch (error) { next(error); } 
}); 
  
// GET /api/rooms/:id/bookings?date=YYYY-MM-DD 
router.get('/:id/bookings', async (req, res, next) => { 
  try { 
    const { id } = req.params; 
    const { date } = req.query; 
    const room = await Room.findById(id); 
    if (!room) { res.status(404); throw new Error('Salle introuvable.'); } 
    const filter = { roomId: id }; 
    if (date) {if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { 
        res.status(400); throw new Error('Format de date invalide.'); 
      } 
      filter.date = date; 
    } 
    const bookings = await Booking.find(filter).sort({ timeSlot: 1 }); 
    res.status(200).json({ success: true, count: bookings.length, data: bookings 
}); 
  } catch (error) { next(error); } 
}); 
  
module.exports = router; 