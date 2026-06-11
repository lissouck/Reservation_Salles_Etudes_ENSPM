// src/pages/AdminDashboard.jsx
// Vue administrateur : toutes les réservations du jour en cours

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTodayBookings } from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    const fetchToday = async () => {
      try {
        const res = await getTodayBookings();
        setData(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchToday();
  }, []);

  if (loading) {
    return <div className="spinner-wrapper"><div className="spinner" /></div>;
  }

  return (
    <div className="page container">
      {/* En-tête */}
      <div className="admin-header">
        <div>
          <h1 className="page-title">Tableau de bord Admin</h1>
          <p className="page-subtitle">
            Réservations du jour — {data?.date || new Date().toISOString().split('T')[0]}
          </p>
        </div>
        <Link to="/admin/add-room" className="btn btn-primary">
          + Ajouter une salle
        </Link>
      </div>

      {error && <p className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</p>}

      {/* Compteur */}
      {data && (
        <div className="stats-row">
          <div className="stat-card card">
            <span className="stat-value">{data.count}</span>
            <span className="stat-label">Réservation(s) aujourd'hui</span>
          </div>
        </div>
      )}

      {/* Liste des réservations du jour */}
      {data && data.count === 0 && (
        <div className="alert alert-info" style={{ marginTop: '1rem' }}>
          Aucune réservation enregistrée pour aujourd'hui.
        </div>
      )}

      {data && data.count > 0 && (
        <div className="admin-bookings card">
          <h2 className="section-title">Planning du jour</h2>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Salle</th>
                  <th>Créneau</th>
                  <th>Étudiant</th>
                  <th>Groupe</th>
                  <th>Motif</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((booking) => (
                  <tr key={booking._id}>
                    <td className="cell-room">
                      {booking.roomId?.name || '—'}
                    </td>
                    <td>
                      <span className="slot-chip">{booking.timeSlot}</span>
                    </td>
                    <td>{booking.studentName}</td>
                    <td className="cell-muted">{booking.studentGroup || '—'}</td>
                    <td className="cell-muted cell-purpose">{booking.purpose || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
