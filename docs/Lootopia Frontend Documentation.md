# Lootopia Frontend Documentation

## Table des matières

1. [Introduction](#Introduction)
2. [Commencement](#commençons)

- [Prérequis](#prérequis)
- [Installation](#installation)

3. [Configuration](#Configuration)

4. [Exécution de l'application](#exécution-de-lapplication)
5. [Structure du projet](#structure-du-projet)
6. [Composants Principaux](#composants-principaux)
   - [Header Component](#header-component)
   - [Footer Component](#footer-component)
   - [Home Component](#home-component)
   - [User Profile Component](#user-profile-component)
   - [Chasse List Component](#chasse-list-component)
   - [Chasse Detail Component](#chasse-detail-component)
   - [Organisation de chasses](#organisation-de-chasses)
7. [Services et State Management](#services-et-state-management)
   - [Services](#services)
   - [State Management](#state-management)
8. [Routing et Navigation](#routing-et-navigation)
   - [Routes Principales](#routes-principales)
   - [Lazy Loading](#lazy-loading)
9. [Intégration de PrimeNG](#intégration-de-primeng)
   - [Installation de PrimeNG](#installation-de-primeng)
   - [Configuration de PrimeNG](#configuration-de-primeng)
   - [Composants PrimeNG Utilisés](#composants-primeng-utilisés)
10. [Bonnes Pratiques](#bonnes-pratiques)

- [Responsive Design](#responsive-design)
- [Gestion des Erreurs](#gestion-des-erreurs)
- [Performance](#performance)

11. [Conclusion](#conclusion)
    [Annexes](#annexes)

---

## 1. Introduction

Lootopia Frontend est l'application côté client de Lootopia, responsable de l'interface utilisateur et de l'expérience utilisateur. Cette documentation fournit une vue d'ensemble du projet, des instructions pour configurer l'environnement de développement.
Développé avec Angular, un framework moderne et robuste pour les applications web. Pour accélérer le développement et assurer une interface utilisateur cohérente, nous utilisons PrimeNG, une bibliothèque de composants UI riche et personnalisable.

## Commençons

### Prérequis

Avant de commencer, assurez-vous que les éléments suivants sont installés sur votre machine locale :

- Node.js (version 20.x ou supérieure)
- npm (version 8.x ou supérieure)

### Installation

Clonez le repository et accédez au répertoire du projet:

```bash
git clone https://github.com/RicoAlv16/lootopia.git
cd lootopia/lootopia-front
```

Install des dépendances:

```bash
npm install
```

---

## 3. Configuration

Créez un fichier `.env` dans le répertoire racine du projet et configurez les variables d'environnement suivantes :

```plaintext
APP_API_URL=http://adresse_api
APP_API_KEY=clé_api
```

## 4. Exécution de l'application

Démarrez le serveur de développement :

```bash
ng serve
```

L'application démarrera sur `http://localhost:4200`

---

## 5. Structure du projet

La structure du projet est organisée comme suit :

```
lootopia-front/
│
├── public/
│   ├── index.html
│   ├── favicon.ico
│
├── src/
│   ├── app/
│     ├── assets/
│     ├── components/
│     ├── pages/
│     ├── services/
│     ├── styles/
│     ├── index.js
│
├── .env
├── .gitignore
├── package.json
├── README.md
```

- **public/**: Static files such as HTML, favicon, etc.
- **src/**: Source files for the angular application.
- **app/**: Files for the angular application.
  - **assets/**: Images, fonts, and other static assets.
  - **components/**: Reusable UI components.
  - **pages/**: Page components.
  - **services/**: API service functions.
  - **styles/**: CSS and styling files.
  - **App.js**: Main application component.
  - **index.js**: Entry point of the application.

---

### **6. Composants Principaux**

#### **Header Component**

- **Rôle** : Barre de navigation supérieure avec le logo, les liens de navigation, et le menu utilisateur.
- **Technologies** : PrimeNG `Menubar`, `Button`.

#### **Footer Component**

- **Rôle** : Pied de page avec les liens utiles (CGU, contact, etc.).
- **Technologies** : PrimeNG `Panel`.

#### **Home Component**

- **Rôle** : Page d'accueil avec une présentation de la plateforme et un carrousel de chasses populaires.
- **Technologies** : PrimeNG `Carousel`, `Card`.

#### **User Profile Component**

- **Rôle** : Permet à l'utilisateur de gérer son profil (informations, préférences, récompenses).
- **Technologies** : PrimeNG `InputText`, `FileUpload`.

#### **Chasse List Component**

- **Rôle** : Affiche une liste de chasses disponibles avec des filtres et une pagination.
- **Technologies** : PrimeNG `DataTable`, `Dropdown`.

#### **Chasse Detail Component**

- **Rôle** : Affiche les détails d'une chasse spécifique (description, étapes, récompenses).
- **Technologies** : PrimeNG `TabView`, `Accordion`.

#### **Organisation de chasses**

- **Rôle** : Affiche les détails d'une organisation spécifique de chasse (description, étapes, récompenses).
- **Technologies** : PrimeNG `TabView`, `Forms`, `Button`.

---

### **7. Services et State Management**

#### **Services**

- **AuthService** : Gère l'authentification des utilisateurs (login, logout, token management).
- **ChasseService** : Gère les données des chasses (récupération, création, mise à jour).
- **UserService** : Gère les données des utilisateurs (profil, récompenses).

#### **State Management**

- **NgRx** : Pour une gestion avancée de l'état de l'application (ex: état des chasses, état de l'utilisateur).
- **Store** : Centralise les données de l'application et permet une gestion réactive des états.

---

### **8. Routing et Navigation**

#### **Routes Principales**

```typescript
const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "login", component: LoginComponent},
  {path: "profil", component: UserProfileComponent, canActivate: [AuthGuard]},
  {path: "chasses", component: ChasseListComponent},
  {path: "chasses/:id", component: ChasseDetailComponent},
  {path: "organise_chasse", component: OrganiseChasseComponent},
  {path: "**", redirectTo: ""}, // Redirection pour les routes inconnues
]
```

#### **Lazy Loading**

- Les modules fonctionnels (ex: `ChassesModule`, `UtilisateursModule`) sont chargés de manière asynchrone pour optimiser les performances.

---

## **9. Intégration de PrimeNG**

### **Installation de PrimeNG**

```bash
npm install primeng primeicons primeflex
```

### **Configuration de PrimeNG**

- **Styles** : Importer le thème CSS de PrimeNG dans `angular.json`.

```json
"styles": [
  "node_modules/primeng/resources/themes/saga-blue/theme.css",
  "node_modules/primeng/resources/primeng.min.css",
  "node_modules/primeicons/primeicons.css",
  "src/styles.scss"
]
```

- **Modules** : Importer les modules PrimeNG nécessaires dans `app.module.ts`.

```typescript
import {ButtonModule} from "primeng/button"
import {MenubarModule} from "primeng/menubar"
import {DataTableModule} from "primeng/datatable"

@NgModule({
  imports: [
    ButtonModule,
    MenubarModule,
    DataTableModule,
    // Autres modules
  ],
})
export class AppModule {}
```

### **Composants PrimeNG Utilisés**

- **Menubar** : Pour la barre de navigation.
- **DataTable** : Pour afficher les listes de chasses avec pagination et filtres.
- **Card** : Pour les vignettes de chasses.
- **Dialog** : Pour les modales (ex: confirmation de participation).
- **Toast** : Pour les notifications utilisateur.

---

## **10. Bonnes Pratiques**

### **Responsive Design**

- Utiliser **PrimeFlex** (bibliothèque CSS de PrimeNG) pour créer des layouts responsives.
- Exemple :

```html
<div class="p-grid">
  <div class="p-col-12 p-md-6 p-lg-4">Colonne 1</div>
  <div class="p-col-12 p-md-6 p-lg-4">Colonne 2</div>
</div>
```

### **Gestion des Erreurs**

- Intercepter les erreurs HTTP avec un **HttpInterceptor**.
- Afficher des messages d'erreur conviviaux avec le composant **Toast** de PrimeNG.

### **Performance**

- Utiliser le **Lazy Loading** pour charger les modules uniquement lorsqu'ils sont nécessaires.
- Minimiser les bundles avec **Tree Shaking** et **AOT Compilation**.

## **11. Conclusion**

Cette documentation fournit une vue d'ensemble de l'architecture frontend de Lootopia, basée sur Angular et PrimeNG. Elle sert de guide pour les développeurs et garantit une cohérence dans le développement de l'application. Pour toute question ou suggestion, contactez l'équipe sur contact-dev@lootopia.fr

---

### **Annexes**

- **Liens utiles** :
  - [Documentation Angular](https://angular.io/docs)
  - [Documentation PrimeNG](https://www.primefaces.org/primeng/showcase/)
  - [PrimeFlex Documentation](https://www.primefaces.org/primeflex/)
