// utils/auth.js — fonctions utilitaires pour le token

export const getToken = () => localStorage.getItem('adminToken');

export const isAuthenticated = () => !!getToken();

export const logout = () => {
  localStorage.removeItem('adminToken');
  window.location.href = '/login';
};