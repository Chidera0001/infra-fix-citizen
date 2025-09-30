#!/usr/bin/env node

/**
 * Setup script for Infrastructure Fix Citizen
 * This script helps developers set up the project quickly
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Infrastructure Fix Citizen...\n');

// Check if .env exists, if not create from template
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  console.log('📄 Creating .env file from template...');
  fs.copyFileSync(envExamplePath, envPath);
  console.log('✅ .env file created. Please update it with your actual values.\n');
} else if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists.\n');
}

// Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully.\n');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Check if Supabase CLI is installed
console.log('🗄️ Checking Supabase setup...');
try {
  execSync('supabase --version', { stdio: 'pipe' });
  console.log('✅ Supabase CLI is installed.\n');
} catch (error) {
  console.log('⚠️ Supabase CLI not found. Install it with: npm install -g supabase\n');
}

// Setup Git hooks (if using Husky)
console.log('🎣 Setting up Git hooks...');
try {
  if (fs.existsSync(path.join(__dirname, '..', '.husky'))) {
    execSync('npx husky install', { stdio: 'inherit' });
    console.log('✅ Git hooks installed.\n');
  }
} catch (error) {
  console.log('⚠️ Git hooks setup failed. You may need to install Husky.\n');
}

console.log('🎉 Setup complete! You can now run:');
console.log('   npm run dev     - Start development server');
console.log('   npm run build   - Build for production');
console.log('   npm run test    - Run tests');
console.log('   npm run lint    - Lint code');
console.log('\n📖 Check the README.md for more information.');
