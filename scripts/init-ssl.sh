#!/bin/bash

# ===================
# SSL Certificate Initialization Script
# ===================
# This script obtains initial SSL certificates from Let's Encrypt
# Run this ONCE when first deploying to a new server

set -e

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | xargs)
fi

# Check required variables
if [ -z "$DOMAIN" ] || [ -z "$LETSENCRYPT_EMAIL" ]; then
    echo "Error: DOMAIN and LETSENCRYPT_EMAIL must be set in .env"
    exit 1
fi

echo "🔐 Initializing SSL certificates for: $DOMAIN"

# Create directories
mkdir -p certbot/www certbot/conf

# Step 1: Start nginx with initial config
echo "📦 Starting nginx with initial config..."
cp nginx/nginx-init.conf nginx/nginx.conf.bak
cp nginx/nginx-init.conf nginx/nginx.conf

docker-compose -f docker-compose.prod.yml up -d nginx

# Wait for nginx to start
sleep 5

# Step 2: Get certificates
echo "📜 Requesting certificates from Let's Encrypt..."
docker-compose -f docker-compose.prod.yml run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $LETSENCRYPT_EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN \
    -d www.$DOMAIN

# Step 3: Restore production nginx config
echo "🔄 Switching to production nginx config..."
mv nginx/nginx.conf.bak nginx/nginx.conf

# Replace domain placeholder in nginx config
sed -i "s/\${DOMAIN}/$DOMAIN/g" nginx/nginx.conf

# Step 4: Restart all services
echo "🚀 Starting all services..."
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d

echo ""
echo "✅ SSL setup complete!"
echo "🌐 Your app is now available at: https://$DOMAIN"
echo ""
echo "📝 SSL certificates will auto-renew via certbot container"
