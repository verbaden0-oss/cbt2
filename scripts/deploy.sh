#!/bin/bash

# ===================
# Quick Deploy/Update Script
# ===================
# Use this script to update your application after code changes

set -e

echo "🚀 Deploying CBT App..."

# Pull latest changes (if using git)
if [ -d .git ]; then
    echo "📥 Pulling latest code..."
    git pull
fi

# Build and restart containers
echo "🔨 Building containers..."
docker-compose -f docker-compose.prod.yml build

echo "♻️ Restarting services..."
docker-compose -f docker-compose.prod.yml up -d

echo ""
echo "✅ Deployment complete!"
echo ""

# Show running containers
docker-compose -f docker-compose.prod.yml ps
