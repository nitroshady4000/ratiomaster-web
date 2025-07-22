# 🎯 Test rapide de RatioMaster Web

## ✅ Projet prêt pour les tests !

Votre projet RatioMaster Web est maintenant prêt. Voici comment le tester :

## 🚀 Option 1: Test local (recommandé)

### Prérequis
- .NET 8 SDK : https://dotnet.microsoft.com/download
- Node.js 18+ : https://nodejs.org/

### Étapes de test

1. **Préparer l'environnement** :
```bash
cd /Users/cedric/Nextcloud/Cednet/_Dev/ratiocool/ratiomaster-web
./scripts/test-local.sh
```

2. **Démarrer l'API** (Terminal 1) :
```bash
cd Backend/RatioMasterAPI
dotnet restore
dotnet run
```
→ API accessible sur http://localhost:5000

3. **Démarrer le Frontend** (Terminal 2) :
```bash
cd Frontend
npm install
npm start
```
→ Interface web sur http://localhost:3000

### 🧪 Tests à effectuer

1. **Accès à l'interface** : http://localhost:3000
2. **API Documentation** : http://localhost:5000/swagger
3. **Health Check** : http://localhost:5000/health
4. **Ajouter un torrent** : Utiliser l'interface pour tester l'ajout
5. **Démarrer/Arrêter** : Tester les actions sur les torrents

## 🐳 Option 2: Test avec Docker

Si Docker est installé et fonctionne :
```bash
./scripts/deploy.sh
```

## 🔧 Dépannage

### Erreurs courantes

**Port 5000 occupé** :
```bash
lsof -ti:5000 | xargs kill -9
```

**Erreur npm** :
```bash
cd Frontend
rm -rf node_modules package-lock.json
npm install
```

**Erreur .NET** :
```bash
cd Backend/RatioMasterAPI
dotnet clean
dotnet restore
```

## 🎉 Étapes suivantes

Une fois les tests réussis :

1. **Publier sur GitHub** :
```bash
git init
git add .
git commit -m "🎉 Initial commit - RatioMaster Web"
git remote add origin https://github.com/nitroshady4000/ratiomaster-web.git
git push -u origin main
```

2. **Améliorer** le projet avec la logique complète du RatioMaster original

3. **Déployer** en production avec Docker

## 📋 Checklist de test

- [ ] API démarre sans erreur
- [ ] Frontend charge correctement
- [ ] Interface responsive fonctionne
- [ ] Peut ajouter un torrent de test
- [ ] Actions démarrer/arrêter fonctionnent
- [ ] SignalR connecté (badge vert dans l'header)
- [ ] Pages Dashboard, Torrents, Sessions, Settings accessibles

## 🏆 Félicitations !

Si tous les tests passent, vous avez réussi à créer une version web moderne de RatioMaster.NET ! 🚀

**Prêt pour GitHub et la communauté !**