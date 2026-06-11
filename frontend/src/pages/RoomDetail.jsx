// src/pages/RoomDetail.jsx
// Page de détail d'une salle — calendrier, créneaux et formulaire de réservation
// C'est le cœur du projet : gestion des disponibilités en temps réel

import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRoomById, getBookingsByRoom } from '../services/api';
import TimeSlotPicker from '../components/TimeSlotPicker';
import BookingForm from '../components/BookingForm';
import './RoomDetail.css';

// Formate la date du jour en YYYY-MM-DD pour le champ <input type="date">
const getTodayString = () => new Date().toISOString().split('T')[0];

const RoomDetail = () => {
  const { id } = useParams();

  // ── État de la salle ──────────────────────────────────────────
  const [room, setRoom]           = useState(null);
  const [loadingRoom, setLoadingRoom] = useState(true);
  const [roomError, setRoomError] = useState('');

  // ── État de la sélection ──────────────────────────────────────
  const [selectedDate, setSelectedDate]   = useState(getTodayString());
  const [selectedSlot, setSelectedSlot]   = useState('');

  // ── État des réservations du jour sélectionné ─────────────────
  const [bookings, setBookings]           = useState([]);
  const [loadingSlots, setLoadingSlots]   = useState(false);

  // ── Contrôle du formulaire de confirmation ────────────────────
  const [showForm, setShowForm]           = useState(false);
  const [successMsg, setSuccessMsg]       = useState('');

  // ── Chargement des infos de la salle ─────────────────────────
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await getRoomById(id);
        setRoom(res.data.data);
      } catch (err) {
        setRoomError(err.message);
      } finally {
        setLoadingRoom(false);
      }
    };
    fetchRoom();
  }, [id]);

  // ── Chargement des réservations dès que date ou salle change ──
  // useCallback pour éviter la re-création inutile de la fonction
  const fetchBookings = useCallback(async () => {
    if (!id || !selectedDate) return;
    setLoadingSlots(true);
    setSelectedSlot(''); // Réinitialise la sélection quand la date change
    setSuccessMsg('');
    try {
      const res = await getBookingsByRoom(id, selectedDate);
      setBookings(res.data.data);
    } catch {
      setBookings([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [id, selectedDate]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // ── Extrait uniquement les timeSlot pour les passer au picker ─
  const takenSlots = bookings.map((b) => b.timeSlot);

  // ── Après réservation réussie ─────────────────────────────────
  const handleBookingSuccess = (booking) => {
    setShowForm(false);
    setSuccessMsg(`✅ Créneau ${booking.timeSlot} réservé avec succès pour ${booking.studentName} !`);
    setSelectedSlot('');
    fetchBookings(); // Recharge les réservations pour mettre à jour les créneaux
  };

  // ── Rendu ─────────────────────────────────────────────────────
  if (loadingRoom) {
    return <div className="spinner-wrapper"><div className="spinner" /></div>;
  }

  if (roomError) {
    return (
      <div className="page container">
        <p className="alert alert-error">{roomError}</p>
        <Link to="/" className="back-link">← Retour aux salles</Link>
      </div>
    );
  }

  return (
    <div className="page container">
      <Link to="/" className="back-link">← Retour aux salles</Link>

      {/* ── Fiche de la salle ─── */}
      <div className="room-detail-header card">
        <div className="room-detail-info">
          <h1 className="page-title">{room.name}</h1>
          <div className="room-detail-meta">
            <span className="meta-badge">👥 {room.capacity} places</span>
            {room.features && room.features.map((f) => (
              <span key={f} className="feature-tag">{f}</span>
            ))}
          </div>
        </div>
        <div className="room-detail-icon">🚪</div>
      </div>

      {/* ── Sélecteur de date ─── */}
      <div className="card booking-section">
        <h2 className="section-title">1. Choisissez une date</h2>
        <input
          type="date"
          className="date-input"
          value={selectedDate}
          min={getTodayString()}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* ── Sélecteur de créneau ─── */}
      <div className="card booking-section">
        <h2 className="section-title">
          2. Créneaux horaires pour le {selectedDate}
          {loadingSlots && <span className="loading-inline"> — chargement…</span>}
        </h2>

        {!loadingSlots && (
          <TimeSlotPicker
            takenSlots={takenSlots}
            selected={selectedSlot}
            onSelect={(slot) => {
              setSelectedSlot(slot);
              setSuccessMsg('');
            }}
          />
        )}
      </div>

      {/* ── Bouton de réservation ─── */}
      {selectedSlot && !showForm && (
        <div className="reserve-cta">
          <p className="reserve-hint">
            Créneau sélectionné : <strong>{selectedSlot}</strong>
          </p>
          <button
            className="btn btn-primary reserve-btn"
            onClick={() => setShowForm(true)}
          >
            Réserver ce créneau →
          </button>
        </div>
      )}

      {/* ── Message de succès ─── */}
      {successMsg && (
        <p className="alert alert-success" style={{ marginTop: '1rem' }}>
          {successMsg}
        </p>
      )}

      {/* ── Réservations existantes du jour ─── */}
      {bookings.length > 0 && (
        <div className="card booking-section">
          <h2 className="section-title">Réservations du {selectedDate}</h2>
          <div className="bookings-list">
            {bookings.map((b) => (
              <div key={b._id} className="booking-item">
                <span className="booking-slot">{b.timeSlot}</span>
                <div className="booking-info">
                  <strong>{b.studentName}</strong>
                  {b.studentGroup && <span className="booking-group"> — {b.studentGroup}</span>}
                  {b.purpose && <p className="booking-purpose">{b.purpose}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Formulaire de confirmation (modal) ─── */}
      {showForm && (
        <BookingForm
          room={room}
          date={selectedDate}
          timeSlot={selectedSlot}
          onSuccess={handleBookingSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default RoomDetail;
