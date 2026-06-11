// src/components/TimeSlotPicker.jsx
// Composant d'affichage et de sélection des créneaux horaires
// Logique clé : désactiver visuellement les créneaux déjà réservés

import './TimeSlotPicker.css';

// Créneaux définis dans le cahier des charges
const ALL_SLOTS = ['08:00-10:00', '10:00-12:00', '13:00-15:00', '15:00-17:00'];

/**
 * @param {string[]}  takenSlots   - Créneaux déjà réservés (extraits des bookings du jour)
 * @param {string}    selected     - Créneau actuellement sélectionné
 * @param {function}  onSelect     - Callback appelé avec le créneau choisi
 * @param {boolean}   disabled     - Désactive tous les boutons (ex: pendant la soumission)
 */
const TimeSlotPicker = ({ takenSlots = [], selected, onSelect, disabled = false }) => {
  return (
    <div className="timeslot-picker">
      <p className="timeslot-legend">
        <span className="legend-dot free" /> Disponible &nbsp;
        <span className="legend-dot taken" /> Occupé &nbsp;
        <span className="legend-dot selected" /> Sélectionné
      </p>

      <div className="timeslot-grid">
        {ALL_SLOTS.map((slot) => {
          const isTaken = takenSlots.includes(slot);
          const isSelected = selected === slot;

          // Détermine la classe CSS selon l'état du créneau
          let className = 'slot-btn';
          if (isTaken) className += ' slot-taken';
          else if (isSelected) className += ' slot-selected';
          else className += ' slot-free';

          return (
            <button
              key={slot}
              className={className}
              onClick={() => !isTaken && !disabled && onSelect(slot)}
              disabled={isTaken || disabled}
              title={isTaken ? `Créneau ${slot} — déjà réservé` : `Réserver ${slot}`}
              aria-pressed={isSelected}
            >
              <span className="slot-time">{slot}</span>
              {isTaken && <span className="slot-badge">Occupé</span>}
              {isSelected && <span className="slot-badge selected-badge">Sélectionné</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotPicker;
