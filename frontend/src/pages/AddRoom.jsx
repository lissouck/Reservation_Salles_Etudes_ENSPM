// src/pages/AddRoom.jsx
// Page administrateur : formulaire d'ajout d'une nouvelle salle

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createRoom } from '../services/api';
import './AddRoom.css';

// Équipements prédéfinis — l'admin peut cocher ceux disponibles
const PRESET_FEATURES = [
  'Projecteur',
  'Climatisation',
  'Tableau blanc',
  'Tableau noir',
  'Prises électriques',
  'Connexion Wi-Fi',
  'Sonorisation',
];

const AddRoom = () => {
  const navigate = useNavigate();

  const [name, setName]                 = useState('');
  const [capacity, setCapacity]         = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [customFeature, setCustomFeature] = useState('');
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');

  // Gestion des équipements prédéfinis par case à cocher
  const toggleFeature = (feature) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  // Ajout d'un équipement personnalisé
  const addCustomFeature = () => {
    const trimmed = customFeature.trim();
    if (trimmed && !selectedFeatures.includes(trimmed)) {
      setSelectedFeatures((prev) => [...prev, trimmed]);
      setCustomFeature('');
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Le nom de la salle est obligatoire.');
      return;
    }
    if (!capacity || isNaN(capacity) || Number(capacity) < 1) {
      setError('La capacité doit être un nombre entier supérieur à 0.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createRoom({
        name: name.trim(),
        capacity: Number(capacity),
        features: selectedFeatures,
      });
      navigate('/'); // Redirige vers la liste après création
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page container">
      <Link to="/admin" className="back-link">← Tableau de bord</Link>

      <h1 className="page-title">Ajouter une salle</h1>
      <p className="page-subtitle">Renseignez les informations de la nouvelle salle.</p>

      <div className="add-room-form card">
        {/* Nom */}
        <div className="form-group">
          <label htmlFor="name">Nom de la salle *</label>
          <input
            id="name"
            type="text"
            placeholder="Ex : Salle Polyvalente 1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Capacité */}
        <div className="form-group">
          <label htmlFor="capacity">Capacité (nombre de places) *</label>
          <input
            id="capacity"
            type="number"
            min={1}
            placeholder="Ex : 20"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Équipements */}
        <div className="form-group">
          <label>Équipements disponibles</label>
          <div className="features-grid">
            {PRESET_FEATURES.map((f) => (
              <label key={f} className="feature-checkbox">
                <input
                  type="checkbox"
                  checked={selectedFeatures.includes(f)}
                  onChange={() => toggleFeature(f)}
                  disabled={loading}
                />
                <span>{f}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Équipement personnalisé */}
        <div className="custom-feature-row">
          <input
            type="text"
            placeholder="Équipement personnalisé…"
            value={customFeature}
            onChange={(e) => setCustomFeature(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustomFeature()}
            disabled={loading}
            className="custom-feature-input"
          />
          <button
            className="btn btn-secondary"
            onClick={addCustomFeature}
            disabled={loading || !customFeature.trim()}
          >
            Ajouter
          </button>
        </div>

        {/* Tags des équipements sélectionnés */}
        {selectedFeatures.length > 0 && (
          <div className="selected-features">
            {selectedFeatures.map((f) => (
              <span key={f} className="feature-tag-removable">
                {f}
                <button
                  className="remove-feature"
                  onClick={() => toggleFeature(f)}
                  aria-label={`Retirer ${f}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Erreur */}
        {error && <p className="alert alert-error">{error}</p>}

        {/* Actions */}
        <div className="add-room-actions">
          <Link to="/" className="btn btn-secondary">Annuler</Link>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Enregistrement…' : 'Créer la salle'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRoom;
