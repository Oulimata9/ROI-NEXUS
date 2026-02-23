# 🖋️ ROI NEXUS - Projet Nexus Sign

**Plateforme de signature électronique professionnelle conçue pour l’Afrique.** Nexus Sign est une application Fullstack hybride utilisant **Python (FastAPI)** pour la rigueur cryptographique du backend et **Vite/React** pour une interface frontend fluide, moderne et responsive.

---

## 📋 Table des matières
- [Vue d'ensemble](#-vue-densemble)
- [Architecture Technique](#-architecture-technique)
- [Prérequis](#-prérequis)
- [Installation & Démarrage (Docker - Recommandé)](#-installation--démarrage-docker)
- [Développement local (Sans Docker)](#-développement-local-sans-docker)
- [Structure du Projet](#-structure-du-projet)
- [Règles Métier & Sécurité](#-règles-métier--sécurité)
- [Processus de Contribution](#-processus-de-contribution)

---

## 🚀 Vue d'ensemble
Nexus Sign permet aux entreprises de dématérialiser leurs processus de signature (contrats RH, accords commerciaux, documents juridiques). La plateforme garantit la traçabilité et l'intégrité des documents grâce au hachage cryptographique et à un système de validation rigoureux.

---

## 🏗️ Architecture Technique
La plateforme repose sur une infrastructure de confiance :
* **Backend** : FastAPI (Python 3.11) — Choisi pour sa performance asynchrone et sa gestion native de la validation (Pydantic).
* **Frontend** : React + TypeScript + Tailwind CSS (via Vite) — Pour une interface utilisateur rapide et typée.
* **Base de données** : PostgreSQL — Garantit la persistance et l'intégrité relationnelle des données.
* **Sécurité** : 
    * Hachage **SHA-256** pour l'empreinte numérique des fichiers.
    * Tokens de **48 caractères** pour les accès signataires externes.
    * Hachage **Bcrypt** pour la protection des mots de passe.



---

## 💻 Prérequis
* **Docker & Docker Compose** (Installation fortement recommandée).
* **Node.js** (v18+) & **npm** (pour le développement frontend local).
* **Python 3.11+** (pour le développement backend local).
* **PostgreSQL** (si vous n'utilisez pas la version conteneurisée).

---

## 🐳 Installation & Démarrage (Docker)
C'est la méthode recommandée pour garantir un environnement identique pour toute l'équipe.

1.  **Cloner le dépôt** :
    ```bash
    git clone [url-du-repo]
    cd ROI-NEXUS
    ```
2.  **Lancer l'infrastructure** :
    ```bash
    docker-compose up --build
    ```
3.  **Accès aux services** :
    * **Frontend** : `http://localhost:80`
    * **Backend API** : `http://localhost:8000`
    * **Documentation API (Swagger)** : `http://localhost:8000/docs`

---

## 🛠️ Développement local sans Docker

### Backend
1.  Se placer dans le dossier : `cd backends`
2.  Créer l'environnement virtuel : `python -m venv signvenv`
3.  Activer l'environnement : 
    * Windows : `.\signvenv\Scripts\activate`
    * Linux/Mac : `source signvenv/bin/activate`
4.  Installer les dépendances : `pip install -r requirements.txt`
5.  Lancer le serveur : `uvicorn app.main:app --reload`

### Frontend
1.  Se placer dans le dossier : `cd frontend`
2.  Installer les dépendances : `npm install --legacy-peer-deps`
3.  Lancer le projet : `npm run dev` (disponible par défaut sur `http://localhost:3000`)

---

## 📁 Structure du Projet
```text
ROI-NEXUS/
├── backends/
│   ├── app/
│   │   ├── models/      # Modèles SQLModel (BDD)
│   │   ├── schemas/     # Validation Pydantic (API)
│   │   ├── routes/      # Endpoints (auth, documents, signatures)
│   │   ├── services/    # Logique métier (crypto, storage, pdf)
│   │   └── database.py  # Connexion PostgreSQL
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/             # Composants React et hooks
│   ├── Dockerfile
│   └── vite.config.ts   # Configuration du build (outDir: 'build')
└── docker-compose.yml   # Orchestration globale








Règles Métier & Sécurité
Isolation : Une entreprise ne peut accéder qu'à ses propres documents.

Immuabilité : Un document est haché dès l'upload. Toute modification post-upload invalide la preuve numérique.

Signataires Externes : Aucun compte requis. Accès via un lien unique sécurisé par un token cryptographique.

Cycle de vie : Un document passé au statut "Signé" est verrouillé (interdiction de suppression ou modification).