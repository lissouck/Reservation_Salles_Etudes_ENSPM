// src/pages/RoomList.jsx
// Page principale : liste de toutes les salles disponibles

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRooms } from '../services/api';
import './RoomList.css';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await getRooms();
        setRooms(res.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) {
    return (
      <div className="spinner-wrapper">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="page container">
      {/* En-tête */}
      <div className="rooms-header">
        <div>
          <h1 className="page-title">Salles disponibles</h1>
          <p className="page-subtitle">
            Sélectionnez une salle pour consulter les disponibilités et réserver un créneau.
          </p>
        </div>
        <Link to="/admin/add-room" className="btn btn-primary">
          + Ajouter une salle
        </Link>
      </div>

      {/* Message d'erreur */}
      {error && <p className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</p>}

      {/* Liste vide */}
      {!error && rooms.length === 0 && (
        <div className="empty-state card">
          <span className="empty-icon">🏫</span>
          <h3>Aucune salle enregistrée</h3>
          <p>Commencez par ajouter des salles depuis l'interface administrateur.</p>
          <Link to="/admin/add-room" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Ajouter la première salle
          </Link>
        </div>
      )}

      {/* Grille des salles */}
      <div className="rooms-grid">
        {rooms.map((room) => (
          <RoomCard key={room._id} room={room} />
        ))}
      </div>
    </div>
  );
};

// ─── Sous-composant : carte d'une salle ──────────────────────────────────────
const RoomCard = ({ room }) => {
  return (
    <Link to={`/rooms/${room._id}`} className="room-card card">
      {/* Icône et capacité */}
      <div className="room-card-header">
        <span className="room-icon">🚪</span>
        <span className="room-capacity">{room.capacity} places</span>
      </div>

      {/* Nom */}
      <h2 className="room-name">{room.name}</h2>

      {/* Équipements */}
      {room.features && room.features.length > 0 ? (
        <div className="room-features">
          {room.features.map((f) => (
            <span key={f} className="feature-tag">{f}</span>
          ))}
        </div>
      ) : (
        <p className="no-features">Aucun équipement renseigné</p>
      )}

      <div className="room-card-footer">
        <span className="btn btn-secondary room-cta">Voir les disponibilités →</span>
      </div>
    </Link>
  );
};

export default RoomList;
