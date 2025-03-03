## **1. Contexte**

Lootopia est une plateforme innovante dédiée à l'organisation et à la participation à des chasses au trésor virtuelles et semi-virtuelles. La plateforme combine des technologies modernes pour offrir une expérience utilisateur immersive, avec des fonctionnalités de Réalité Augmentée (RA), de géolocalisation, et de gamification. L'objectif est de créer une application web et mobile performante, scalable, et facile à maintenir.

---

## **2. Membres de l'équipe**

- Derrick ALAVO (github: RicoAlv16)
- Yann WULFMAN (github: YannWulfman)

---

## **3. Installation**

Suivez ces étapes pour installer lootopia:

### **3-1. lootopia-front**

- Clonez le repository et accédez au répertoire du projet:

```bash
git clone https://github.com/RicoAlv16/lootopia.git
cd lootopia/lootopia-front
```

```bash
npm install
```

- Créez un fichier `.env` dans le répertoire racine du projet et configurez les variables d'environnement suivantes :

```plaintext
APP_API_URL=http://adresse_api
APP_API_KEY=clé_api
```

- Exécution de l'application

Démarrez le serveur de développement :

```bash
ng serve
```

L'application démarrera sur `http://localhost:4200`

### **3-2. lootopia-back**
