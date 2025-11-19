#!/bin/bash

# Deployment script for Next.js on Azure App Service

echo "Starting deployment..."

# Install dependencies
echo "Installing dependencies..."
npm install --production=false

# Build the Next.js app
echo "Building Next.js application..."
npm run build

echo "Deployment complete!"