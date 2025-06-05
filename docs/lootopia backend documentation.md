# Lootopia Backend Documentation

## Table des matières

1. [Introduction](#introduction)
2. [Commencement](#getting-started)
   - [Préréquis](#prerequisites)
   - [Installation](#installation)
3. [Configuration](#configuration)
4. [Exécution de l'application](#running-the-application)
5. [Structure du projet](#project-structure)
6. [API Endpoints](#api-endpoints)
7. [Tests](#testing)
8. [Contribution](#contributing)
9. [Licencee](#license)
10. [Contact](#contact)

---

## Introduction

Lootopia Backend est le composant côté serveur de l'application Lootopia, responsable du traitement des requêtes API, de la gestion des données et de l'intégration avec divers services. Cette documentation fournit une vue d'ensemble du projet, des instructions pour configurer l'environnement de développement, et des détails sur la façon de contribuer.

---

## Commencement

### Préréquis

Avant de commencer, assurez-vous que les éléments suivants sont installés sur votre machine locale :

- Node.js (version 14.x ou supérieure)
- npm (version 6.x ou supérieure)
- Postgres (version 4.x ou supérieure)

### Installation

Clonez le dépôt et naviguez jusqu'au répertoire du projet :

```bash
git clone https://github.com/Lootopia/instamint.git
cd lootopia/lootopia-back
```

Installez les dépendances :

```bash
npm install
```

---

## Configuration

Créez un fichier `.env` dans le répertoire racine du projet et configurez les variables d'environnement suivantes :

```plaintext
PORT=3000
POSTGRES_URI=postgres://localhost:5432/lootopia
JWT_SECRET=votre_secret_jwt
```

---

## Exécution de l'application

Démarrez le serveur de développement :

```bash
npm run dev
```

Le serveur démarrera sur `http://localhost:3000`.

Pour démarrer le serveur de production :

```bash
npm start

```

---

## Project Structure

Le projet est structurée comme suit:

```

lootopia-back/
│
├── src/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── services/
│ ├── utils/
│ ├── index.js
│
├── .env
├── .gitignore
├── package.json
├── README.md

```

- **contrôleurs/** : Traite les demandes et les réponses entrantes.
- **modèles/** : Définissent les schémas et les modèles de Postgres.
- **routes/** : Définissent les routes de l'application.
- **services/** : Contiennent la logique commerciale et les fonctions de service.
- **utils/** : Fonctions utilitaires et aides.
- **index.js** : Point d'entrée de l'application.

---

## API Endpoints

Le backend expose plusieurs endpoints d'API. En voici quelques exemples :

### Points d'accès utilisateur

- **POST /api/users/register** : Enregistrer un nouvel utilisateur.
- **POST /api/users/login** : Authentifie un utilisateur et renvoie un jeton.

### Points d'accès à la chasse

- **POST /api/chasses** : Créer une nouvelle chasse.
- **GET /api/chasses** : Récupère une liste de toutes les chasses.
- **GET /api/chasses/:id** : Récupère les détails d'une chasse spécifique.

### Exemple d'utilisation

#### Enregistrer un utilisateur

```bash
curl -X POST http://localhost:3000/api/users/register
-H "Content-Type : application/json"
-d '{« username » : « testuser », “password” : « password123"}'

```

#### Créer une chasse

```Bash
curl -X POST http://localhost:3000/api/chasses
-H "Content-Type : application/json"
-H "Authorization : Bearer your_jwt_token"
-d '{"name" : « nouvel chasse", “description” : "Description de la chasse"}'
```

---

## Test

Exécutez la suite de tests en utilisant :

```bash
npm test

```

---

## Contribuer

Les contributions sont les bienvenues ! Veuillez suivre les étapes suivantes pour contribuer :

1. Ouvrez le dépôt.
2. Créez une nouvelle branche (`git checkout -b feature-branch`).
3. Livrez vos changements (`git commit -m 'Add new feature'`).
4. Poussez vers la branche (`git push origin feature-branch`).
5. Créez une demande d'extraction.

---

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## Contact

Pour toute question ou commentaire, veuillez contacter le propriétaire du dépôt à contact.groupe1@lootopia.fr.

---

Cette documentation fournit un guide complet pour utiliser et contribuer au backend Instamint. Le contenu sera basé sur des détails spécifiques ou des mises à jour liées au projet.
