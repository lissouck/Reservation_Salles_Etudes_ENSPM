// models/Room.js
// Modèle Mongoose pour la collection "rooms"

const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: [true, 'Le nom de la salle est obligatoire.'],
        unique: true,
        trim: true,
    },

    capacity: {
        type: Number,
        required: [true, 'La capacité de la salle est obligatoire.'],
        min: [1, 'La capacité doit être au minimum 1.'],
    },

    features: {
        type: [String],
        default: [],
    },
},
{
    timestamps: true,
}
);

module.exports = mongoose.model('Room', RoomSchema);