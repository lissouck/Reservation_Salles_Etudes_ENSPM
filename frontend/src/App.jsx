// src/App.jsx
// Composant racine — configuration du routage React Router v6

import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import RoomList from './pages/RoomList';
import RoomDetail from './pages/RoomDetail';
import AdminDashboard from './pages/AdminDashboard';
import AddRoom from './pages/AddRoom';

const App = () => {
  return (
    <div className="app">
      {/* Barre de navigation persistante */}
      <Navbar />

      {/* Définition des routes */}
      <Routes>
        {/* Page principale : liste des salles */}
        <Route path="/" element={<RoomList />} />

        {/* Détail d'une salle : disponibilités + réservation */}
        <Route path="/rooms/:id" element={<RoomDetail />} />

        {/* Administration */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/add-room" element={<AddRoom />} />

        {/* Route 404 — page non trouvée */}
        <Route
          path="*"
          element={
            <div className="page container">
              <h1 className="page-title">Page introuvable</h1>
              <p className="page-subtitle">La page demandée n'existe pas.</p>
            </div>
          }
        />
      </Routes>
    </div>
  );
};

export default App;

