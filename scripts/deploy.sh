#!/bin/bash

echo "🚀 Déploiement de RatioMaster Web..."

# Vérifier Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé"
    exit 1
fi

# Créer les dossiers nécessaires
mkdir -p data/sessions data/logs nginx/ssl

# Arrêter les conteneurs existants
echo "🛑 Arrêt des conteneurs existants..."
docker-compose down

# Construire et démarrer
echo "🔨 Construction et démarrage des conteneurs..."
docker-compose up --build -d

# Attendre que les services soient prêts
echo "⏳ Attente du démarrage des services..."
sleep 30

# Vérifier l'état des services
echo "🔍 Vérification de l'état des services..."
docker-compose ps

# Tests de connectivité
echo "🧪 Test de connectivité..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend accessible sur http://localhost:3000"
else
    echo "❌ Erreur d'accès au frontend"
fi

if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    echo "✅ API accessible sur http://localhost:5000"
else
    echo "❌ Erreur d'accès à l'API"
fi

echo "🎉 Déploiement terminé !"
echo "📱 Interface web: http://localhost:3000"
echo "🔌 API: http://localhost:5000"
echo "📊 Logs: docker-compose logs -f"
