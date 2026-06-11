// models/Booking.js
// Modèle Mongoose pour la collection "bookings"

const mongoose = require('mongoose');

const TIME_SLOTS = [
    '08:00-10:00',
    '10:00-12:00',
    '13:00-15:00',
    '15:00-17:00'
];

const BookingSchema = new mongoose.Schema(
{
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: [true, "L'identifiant de la salle est obligatoire."],
    },

    studentName: {
        type: String,
        required: [true, "Le nom de l'étudiant est obligatoire."],
        trim: true,
    },

    studentGroup: {
        type: String,
        trim: true,
        default: '',
    },

    date: {
        type: String,
        required: [true, 'La date est obligatoire.'],
        match: [
            /^\d{4}-\d{2}-\d{2}$/,
            'Format invalide. Utilisez YYYY-MM-DD.'
        ],
    },

    timeSlot: {
        type: String,
        required: [true, 'Le créneau horaire est obligatoire.'],
        enum: {
            values: TIME_SLOTS,
            message: 'Créneau invalide.'
        },
    },

    purpose: {
        type: String,
        trim: true,
        default: '',
    },
},
{
    timestamps: true,
}
);

// Empêche les doubles réservations
BookingSchema.index(
    {
        roomId: 1,
        date: 1,
        timeSlot: 1
    },
    {
        unique: true
    }
);

module.exports = mongoose.model('Booking', BookingSchema);