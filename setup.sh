#!/bin/bash

set -e

echo "🚀 API Gateway Setup Script"
echo "============================"
echo ""

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

if [ ! -f .env ]; then
    echo "🔧 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created (update with your configuration)"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your configuration"
echo "2. Start development server: npm run dev"
echo "3. Access Swagger UI: http://localhost:5000/api-docs"
echo ""
