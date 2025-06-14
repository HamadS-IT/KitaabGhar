#!/bin/bash

echo "🚀 Starting deployment..."

# --- FASTAPI ---
echo "🔁 Starting FastAPI..."
cd ~/KitabGhar-BackEnd/FastApi

# Ensure the script is executable
chmod +x start_fastapi.sh

# Start FastAPI with PM2
pm2 delete FastApi > /dev/null 2>&1
pm2 start ./start_fastapi.sh --name FastApi


# --- NODE.JS ---
echo "🌐 Starting Node.js API..."
cd ~/KitabGhar-BackEnd/Express

# Install dependencies (optional: remove if already installed)
npm install

# Start Node.js API with PM2
pm2 delete Express > /dev/null 2>&1
pm2 start server.js --name Express


# --- SAVE PM2 STATE ---
pm2 save

echo "✅ Deployment complete!"
pm2 list

