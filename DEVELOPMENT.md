# 🛠️ Guide de développement local (sans Docker)

Si Docker n'est pas disponible, vous pouvez tester l'application en mode développement :

## Backend (API ASP.NET Core)

```bash
cd Backend/RatioMasterAPI

# Installer .NET 8 SDK si nécessaire
# https://dotnet.microsoft.com/download

# Restaurer les packages
dotnet restore

# Démarrer l'API en mode développement
dotnet run

# L'API sera accessible sur : http://localhost:5000
```

## Frontend (React)

```bash
cd Frontend

# Installer Node.js si nécessaire
# https://nodejs.org/

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start

# L'interface sera accessible sur : http://localhost:3000
```

## Base de données

Pour le développement local, vous pouvez :

1. **Utiliser SQLite** (modifier appsettings.json) :
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=ratiomaster.db"
  }
}
```

2. **Installer SQL Server Express** localement

3. **Utiliser Docker uniquement pour la base** :
```bash
docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=YourPassword123!' \
  -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest
```

## Prérequis pour Docker

Si vous souhaitez utiliser Docker plus tard :

### macOS
```bash
# Installer Docker Desktop
# https://docs.docker.com/desktop/mac/install/

# Vérifier l'installation
docker --version
docker-compose --version
```

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install docker.io docker-compose
sudo usermod -aG docker $USER
```

### Windows
```bash
# Installer Docker Desktop
# https://docs.docker.com/desktop/windows/install/
```

## Test rapide sans Docker

1. **Vérifier la structure** :
```bash
./scripts/check-structure.sh
```

2. **Démarrer l'API** :
```bash
cd Backend/RatioMasterAPI
dotnet run
```

3. **Démarrer le frontend** (dans un autre terminal) :
```bash
cd Frontend
npm install
npm start
```

4. **Accéder à l'application** :
- Frontend : http://localhost:3000
- API : http://localhost:5000
- Documentation API : http://localhost:5000/swagger

## Prochaines étapes

Une fois que vous avez testé localement :

1. **Installer Docker** pour le déploiement complet
2. **Publier sur GitHub** le code source
3. **Déployer en production** avec Docker

## Dépannage

### Erreurs courantes

**Port 5000 occupé** :
```bash
# Tuer le processus sur le port 5000
lsof -ti:5000 | xargs kill -9
```

**Erreur de compilation .NET** :
```bash
# Nettoyer et reconstruire
dotnet clean
dotnet restore
dotnet build
```

**Erreur npm** :
```bash
# Nettoyer le cache npm
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```
