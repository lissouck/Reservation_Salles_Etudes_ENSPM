# Reservation_Salles_Etudes_ENSPM
Application Full-Stack de reservation de salles d'etude ou de reunion developpee avec React, Node.js, Express et MongoDB dans le cadre du projet ENSPM 2025-2026.
## Membres du groupe

- Chef de groupe : Lissouck Calice Horus
- Membre 2 : Alhadji Nassourou
- Membre 3 : Brou kouassi
- Membre 4 : Eyenga owona claire leslie
- Membre 5 : Laoudje leonel
##  Structure du projet

```
reservation-salles/
│
├── backend/
│   ├── config/
│   │   └── db.js                  # Connexion MongoDB
│   ├── middleware/
│   │   └── errorHandler.js        # Gestion centralisée des erreurs
│   ├── models/
│   │   ├── Room.js                # Modèle Salle (Mongoose)
│   │   └── Booking.js             # Modèle Réservation + index unique
│   ├── routes/
│   │   ├── rooms.js               # Routes /api/rooms
│   │   └── bookings.js            # Routes /api/bookings
│   ├── .env.example               # Template des variables d'environnement
│   ├── .gitignore
│   ├── package.json
│   └── server.js                  # Point d'entrée Express
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx          # Barre de navigation
    │   │   ├── Navbar.css
    │   │   ├── TimeSlotPicker.jsx  # Sélecteur de créneaux (core)
    │   │   ├── TimeSlotPicker.css
    │   │   ├── BookingForm.jsx     # Formulaire de confirmation (modal)
    │   │   └── BookingForm.css
    │   ├── pages/
    │   │   ├── RoomList.jsx        # Liste des salles
    │   │   ├── RoomList.css
    │   │   ├── RoomDetail.jsx      # Détail + réservation
    │   │   ├── RoomDetail.css
    │   │   ├── AdminDashboard.jsx  # Planning du jour (admin)
    │   │   ├── AdminDashboard.css
    │   │   ├── AddRoom.jsx         # Formulaire ajout salle (admin)
    │   │   └── AddRoom.css
    │   ├── services/
    │   │   └── api.js              # Instance Axios + toutes les requêtes
    │   ├── App.jsx                 # Routage React Router
    │   ├── main.jsx                # Point d'entrée React
    │   └── index.css               # Design system global
    ├── .env
    ├── .gitignore
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

##  Partie 1 — Installation et lancement du Backend

### Prérequis
- Node.js ≥ 18
- MongoDB installé et démarré localement (port 27017 par défaut)
- npm

### Étape 1 — Installer les dépendances

```powershell
cd reservation-salles/backend
npm install
```

### Étape 2 — Créer le fichier d'environnement

Copier `.env.example` en `.env` :

```powershell
copy .env.example .env
```

Contenu de `.env` :

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/reservation_salles
NODE_ENV=development
```

### Étape 3 — Démarrer le serveur

**Mode développement (avec rechargement automatique) :**
```powershell
npm run dev
```

**Mode production :**
```powershell
npm start
```

 Le serveur démarre sur `http://localhost:5000`

---

## ⚙️ Partie 2 — Installation et lancement du Frontend

### Étape 1 — Installer les dépendances

```powershell
cd reservation-salles/frontend
npm install
```

### Étape 2 — Vérifier le fichier .env

Le fichier `.env` est déjà présent avec :

```env
VITE_API_BASE_URL=http://localhost:5000
```

> Le proxy Vite (configuré dans `vite.config.js`) redirige automatiquement
> les requêtes `/api/*` vers le backend. Le `.env` est utilisé en production.

### Étape 3 — Démarrer le frontend

```powershell
npm run dev
```

 L'application s'ouvre sur `http://localhost:5173`

---

##  Partie 3 — Tests de l'API avec PowerShell

Démarrez le backend, puis testez chaque route :

## Authentification administrateur

L’acces a l’espace administrateur est protege par JWT.

- URL de connexion : http://localhost:5173/login
- Email : admin@enspm.cm
- Mot de passe : Admin1234
Le token est stocke dans le navigateur et envoye automatiquement
a chaque requete vers les routes protegees.

Sans connexion, toute tentative d’acces a /admin redirige vers /login.

###  Créer une salle (POST /api/rooms)

```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:5000/api/rooms" `
  -ContentType "application/json" `
  -Body '{"name":"Salle Polyvalente 1","capacity":30,"features":["Projecteur","Climatisation"]}'
```

```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:5000/api/rooms" `
  -ContentType "application/json" `
  -Body '{"name":"Salle TD-101","capacity":20,"features":["Tableau blanc"]}'
```

###  Lister toutes les salles (GET /api/rooms)

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/rooms"
```

###  Créer une réservation (POST /api/bookings)

Remplacez `ROOM_ID` par l'`_id` retourné lors de la création de salle.

```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:5000/api/bookings" `
  -ContentType "application/json" `
  -Body '{"roomId":"ROOM_ID","studentName":"NJOYA Aminatou","studentGroup":"GI3","date":"2026-06-09","timeSlot":"08:00-10:00","purpose":"Préparation Projet React"}'
```

###  Tester le rejet d'un doublon (même roomId + date + timeSlot)

```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:5000/api/bookings" `
  -ContentType "application/json" `
  -Body '{"roomId":"ROOM_ID","studentName":"MBAH Didier","studentGroup":"GI3","date":"2026-06-09","timeSlot":"08:00-10:00","purpose":"Doublon test"}'
```

>  Réponse attendue : `409 Conflict` avec le message d'erreur explicite.

###  Réservations d'une salle pour une date donnée

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/rooms/ROOM_ID/bookings?date=2026-06-09"
```

###  Planning du jour (Admin)

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/bookings/today"
```

---

##  Règle métier critique — Anti-doublon

La protection contre les doubles réservations est assurée à **deux niveaux** :

| Niveau | Mécanisme |
|--------|-----------|
| **Application** | `Booking.findOne({ roomId, date, timeSlot })` avant insertion → erreur 409 explicite |
| **Base de données** | Index unique Mongoose `{ roomId: 1, date: 1, timeSlot: 1 }` → filet de sécurité final |

---

##  Parcours utilisateur

| Rôle | Action | Route |
|------|--------|-------|
| Étudiant | Voir les salles | `/` |
| Étudiant | Vérifier disponibilités | `/rooms/:id` |
| Étudiant | Réserver un créneau | `/rooms/:id` (modal) |
| Admin | Planning du jour | `/admin` |
| Admin | Ajouter une salle | `/admin/add-room` |

---

##  Technologies utilisées

| Couche | Stack |
|--------|-------|
| Backend | Node.js, Express.js, Mongoose, CORS, dotenv |
| Frontend | React 18, React Router v6, Axios, Vite |
| Base de données | MongoDB |
| Dev tools | nodemon, VS Code |
