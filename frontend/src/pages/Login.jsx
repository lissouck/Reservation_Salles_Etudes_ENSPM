// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      // Sauvegarde le token dans localStorage
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Espace Administrateur</h1>
          <p className="login-sub">Reservations de Salles — ENSPM Maroua</p>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="admin@enspm.cm"
            value={email} onChange={(e) => setEmail(e.target.value)}
            disabled={loading} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} />
        </div>

        <div className="form-group">
          <label>Mot de passe</label>
          <input type="password" placeholder="••••••••"
            value={password} onChange={(e) => setPassword(e.target.value)}
            disabled={loading} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} />
        </div>

        {error && <p className="alert alert-error">{error}</p>}

        <button className="btn btn-primary login-btn"
          onClick={handleSubmit} disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </div>
    </div>
  );
};

export default Login;