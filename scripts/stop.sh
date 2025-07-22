#!/bin/bash

echo "🛑 Arrêt de RatioMaster Web..."
docker-compose down

echo "🧹 Nettoyage des images inutilisées..."
docker image prune -f

echo "✅ Arrêt terminé !"
