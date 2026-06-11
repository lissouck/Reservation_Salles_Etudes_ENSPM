// src/components/BookingForm.jsx
// Formulaire de confirmation de réservation

import { useState } from 'react';
import { createBooking } from '../services/api';
import './BookingForm.css';

/**
 * @param {object}   room       - Objet salle (id, name)
 * @param {string}   date       - Date sélectionnée (YYYY-MM-DD)
 * @param {string}   timeSlot   - Créneau sélectionné
 * @param {function} onSuccess  - Callback après réservation réussie
 * @param {function} onCancel   - Callback pour annuler
 */
const BookingForm = ({ room, date, timeSlot, onSuccess, onCancel }) => {
  const [studentName, setStudentName] = useState('');
  const [studentGroup, setStudentGroup] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    // Validation côté client
    if (!studentName.trim()) {
      setError('Le nom est obligatoire.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        roomId: room._id,
        studentName: studentName.trim(),
        studentGroup: studentGroup.trim(),
        date,
        timeSlot,
        purpose: purpose.trim(),
      };

      const res = await createBooking(payload);
      onSuccess(res.data.data); // Passe la réservation créée au parent
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-form-overlay">
      <div className="booking-form card">
        {/* En-tête */}
        <div className="booking-form-header">
          <h3 className="booking-form-title">Confirmer la réservation</h3>
          <button className="close-btn" onClick={onCancel} aria-label="Fermer">✕</button>
        </div>

        {/* Récapitulatif */}
        <div className="booking-summary">
          <div className="summary-item">
            <span className="summary-label"> Salle</span>
            <span className="summary-value">{room.name}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Date</span>
            <span className="summary-value">{date}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label"> Créneau</span>
            <span className="summary-value highlight">{timeSlot}</span>
          </div>
        </div>

        {/* Champs de saisie */}
        <div className="form-group">
          <label htmlFor="studentName">
            Nom complet 
            <span style={{ color: 'red' }}>*</span>
            </label>
          <input
            id="studentName"
            type="text"
            placeholder="Ex : Alhadj Nassourou"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            disabled={loading}
            autoFocus
          />
        </div>

        <div className="form-group">
          <label htmlFor="studentGroup">Groupe / Filière</label>
          <input
            id="studentGroup"
            type="text"
            placeholder="Ex : GLO3 — Génie Logiciel"
            value={studentGroup}
            onChange={(e) => setStudentGroup(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="purpose">Motif (facultatif)</label>
          <textarea
            id="purpose"
            rows={2}
            placeholder="Ex : Préparation Projet React"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Message d'erreur */}
        {error && <p className="alert alert-error">{error}</p>}

        {/* Actions */}
        <div className="booking-form-actions">
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Réservation…' : 'Confirmer la réservation'}
          </button>
          <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
