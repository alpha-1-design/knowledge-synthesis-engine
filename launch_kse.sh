#!/bin/bash

# --- KSE Institutional Launch Script ---

echo "🚀 Knowledge Synthesis Engine: Initializing Institutional Research Lab..."

# 1. Check for Docker
if ! [ -x "$(command -v docker)" ]; then
  echo "❌ Error: Docker is not installed. Please install Docker and try again."
  exit 1
fi

# 2. Check for .env file
if [ ! -f .env ]; then
  echo "⚠️ Warning: .env file not found. Creating one from template..."
  cp .env.example .env
  echo "🛑 PLEASE EDIT THE .env FILE AND ADD YOUR API KEYS BEFORE CONTINUING."
  exit 1
fi

# 3. Build and Launch
echo "📦 Building Research Environment (this may take a few minutes on first run)..."
docker-compose up --build -d

# 4. Final Instructions
echo "--------------------------------------------------------"
echo "✅ KSE RESEARCH LAB IS NOW LIVE!"
echo "--------------------------------------------------------"
echo "🌐 ACCESS THE 3D COMMAND CENTER AT: http://localhost:3000"
echo "🔭 READ THE PROTOCOL: RESEARCHER_GUIDE.md"
echo "--------------------------------------------------------"
echo "To stop the lab, run: docker-compose down"
