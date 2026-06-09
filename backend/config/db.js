// config/db.js
// Gestion de la connexion MongoDB via Mongoose

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Options recommandées pour éviter les warnings Mongoose 7+
    });
    console.log(` MongoDB connecté : ${conn.connection.host}`);
  } catch (error) {
    console.error(` Erreur de connexion MongoDB : ${error.message}`);
    process.exit(1); // Arrêt du serveur si la BDD est inaccessible
  }
};

module.exports = connectDB;
