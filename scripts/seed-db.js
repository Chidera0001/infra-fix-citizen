#!/usr/bin/env node

/**
 * Database seeding script
 * Seeds the Supabase database with initial data
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const seedData = {
  categories: [
    { name: 'pothole', description: 'Road potholes and surface damage', icon: 'construction', color: '#ef4444' },
    { name: 'street_lighting', description: 'Broken or malfunctioning street lights', icon: 'lightbulb', color: '#f59e0b' },
    { name: 'water_supply', description: 'Water supply disruptions and leaks', icon: 'droplets', color: '#3b82f6' },
    { name: 'traffic_signal', description: 'Malfunctioning traffic lights and signals', icon: 'traffic-light', color: '#10b981' },
    { name: 'drainage', description: 'Blocked drains and flooding issues', icon: 'waves', color: '#6366f1' },
    { name: 'sidewalk', description: 'Sidewalk damage and accessibility issues', icon: 'footprints', color: '#8b5cf6' },
    { name: 'other', description: 'Other infrastructure issues', icon: 'alert-triangle', color: '#6b7280' },
  ],
};

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Check if categories exist
    const { data: existingCategories, error: checkError } = await supabase
      .from('categories')
      .select('id')
      .limit(1);

    if (checkError) {
      throw checkError;
    }

    if (existingCategories && existingCategories.length > 0) {
      console.log('✅ Database already has data, skipping seed');
      return;
    }

    // Insert categories
    console.log('📂 Inserting categories...');
    const { error: categoriesError } = await supabase
      .from('categories')
      .insert(seedData.categories);

    if (categoriesError) {
      throw categoriesError;
    }

    console.log(`✅ Inserted ${seedData.categories.length} categories`);
    console.log('\n🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

// Run the seeding
seedDatabase();
