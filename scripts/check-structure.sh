#!/bin/bash

echo "🔍 Vérification de la structure du projet RatioMaster Web..."

# Fonction pour vérifier l'existence d'un fichier/dossier
check_path() {
    if [ -e "$1" ]; then
        echo "✅ $1"
    else
        echo "❌ $1 (manquant)"
    fi
}

echo "📁 Structure principale:"
check_path "README.md"
check_path "LICENSE"
check_path ".gitignore"
check_path "docker-compose.yml"

echo ""
echo "🔧 Scripts:"
check_path "scripts/deploy.sh"
check_path "scripts/stop.sh"
check_path "scripts/logs.sh"

echo ""
echo "🖥️ Backend:"
check_path "Backend/RatioMasterAPI/Program.cs"
check_path "Backend/RatioMasterAPI/RatioMasterAPI.csproj"
check_path "Backend/RatioMasterAPI/Controllers/TorrentController.cs"
check_path "Backend/RatioMasterAPI/Controllers/SessionController.cs"
check_path "Backend/RatioMasterAPI/Hubs/TorrentHub.cs"
check_path "Backend/RatioMaster.Core/RatioMaster.Core.csproj"
check_path "Backend/RatioMaster.Core/Models/TorrentModels.cs"
check_path "Backend/Dockerfile"

echo ""
echo "🌐 Frontend:"
check_path "Frontend/package.json"
check_path "Frontend/src/App.js"
check_path "Frontend/src/pages/Dashboard.js"
check_path "Frontend/src/pages/TorrentList.js"
check_path "Frontend/src/contexts/TorrentContext.js"
check_path "Frontend/src/contexts/SignalRContext.js"
check_path "Frontend/src/services/torrentService.js"
check_path "Frontend/src/utils/formatters.js"
check_path "Frontend/Dockerfile"

echo ""
echo "🔧 Configuration:"
check_path "nginx/nginx.conf"
check_path "Backend/RatioMasterAPI/appsettings.json"

echo ""
echo "📖 Documentation:"
check_path "docs/INSTALLATION.md"

echo ""
echo "📊 Données:"
check_path "data/sessions/.gitkeep"
check_path "data/logs/.gitkeep"

echo ""
echo "🎉 Vérification terminée!"
echo ""
echo "📋 Prochaines étapes:"
echo "1. cd /Users/cedric/Nextcloud/Cednet/_Dev/ratiocool/ratiomaster-web"
echo "2. git init"
echo "3. git add ."
echo "4. git commit -m '🎉 Initial commit - RatioMaster Web'"
echo "5. git remote add origin https://github.com/nitroshady4000/ratiomaster-web.git"
echo "6. git push -u origin main"
echo ""
echo "🚀 Pour tester localement:"
echo "./scripts/deploy.sh"
