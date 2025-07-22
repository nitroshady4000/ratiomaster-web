#!/bin/bash

echo "🧪 Test rapide sans Docker"
echo "=========================="

# Vérifier si .NET est installé
if command -v dotnet &> /dev/null; then
    echo "✅ .NET SDK trouvé: $(dotnet --version)"
else
    echo "❌ .NET SDK non trouvé"
    echo "   Installer depuis: https://dotnet.microsoft.com/download"
    exit 1
fi

# Vérifier si Node.js est installé
if command -v node &> /dev/null; then
    echo "✅ Node.js trouvé: $(node --version)"
else
    echo "❌ Node.js non trouvé"
    echo "   Installer depuis: https://nodejs.org/"
    exit 1
fi

echo ""
echo "🔧 Configuration de la base de données en mémoire..."

# Modifier temporairement appsettings.json pour utiliser SQLite
cat > Backend/RatioMasterAPI/appsettings.Development.json << 'EOF'
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=:memory:",
    "Redis": "localhost:6379"
  },
  "RatioMaster": {
    "SessionPath": "./data/sessions",
    "LogPath": "./data/logs",
    "DefaultUpdateInterval": 1800,
    "MaxTorrentsPerUser": 100
  }
}
EOF

echo "✅ Configuration de développement créée"

echo ""
echo "🚀 Démarrage de l'API..."
echo "Ouvrez un nouveau terminal et exécutez:"
echo "cd Backend/RatioMasterAPI && dotnet run"
echo ""
echo "🌐 Démarrage du Frontend..."
echo "Ouvrez un autre terminal et exécutez:"
echo "cd Frontend && npm install && npm start"
echo ""
echo "📱 Une fois démarré, accédez à:"
echo "- Frontend: http://localhost:3000"
echo "- API: http://localhost:5000"
echo "- Documentation: http://localhost:5000/swagger"
