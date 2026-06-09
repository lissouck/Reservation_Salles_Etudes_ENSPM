// middleware/errorHandler.js
// Middleware centralisé de gestion des erreurs Express

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Erreur serveur interne.';

  // Erreur Mongoose : ObjectId invalide (ex: /:id malformé)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Ressource introuvable : identifiant invalide.';
  }

  // Erreur Mongoose : violation de contrainte unique (index unique)
  if (err.code === 11000) {
    statusCode = 409; // Conflict
    message =
      'Ce créneau est déjà réservé pour cette salle à cette date. Veuillez choisir un autre créneau.';
  }

  // Erreur Mongoose : validation des champs requis ou enum
  if (err.name === 'ValidationError') {
    statusCode = 400;
    // Concatène tous les messages de validation en une seule chaîne lisible
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(' | ');
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Affiche la pile d'erreurs uniquement en développement
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
