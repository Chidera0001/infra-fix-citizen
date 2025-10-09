import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type IssueInsert = Database['public']['Tables']['issues']['Insert'];

// Seed data for development/testing
export const seedIssues: Omit<IssueInsert, 'reporter_id'>[] = [
  {
    title: "Large pothole on Victoria Island Road",
    description: "There's a dangerous pothole near the Tafawa Balewa Square that's causing damage to vehicles. It's been there for weeks and is getting worse with the rain.",
    category: "pothole",
    status: "open",
    severity: "high",
    location_lat: 6.4530,
    location_lng: 3.3958,
    address: "Victoria Island Road, Lagos",
    image_urls: []
  },
  {
    title: "Street light not working on Ikoyi Bridge",
    description: "The street light at the entrance of Ikoyi Bridge has been out for over a month, making it dangerous for pedestrians at night.",
    category: "street_lighting",
    status: "in_progress",
    severity: "medium",
    location_lat: 6.4474,
    location_lng: 3.4126,
    address: "Ikoyi Bridge, Lagos",
    image_urls: []
  },
  {
    title: "Water supply disruption in Surulere",
    description: "Residents in Surulere have been without water supply for 3 days. The main pipe seems to be damaged near the Adeniran Ogunsanya Shopping Mall.",
    category: "water_supply",
    status: "open",
    severity: "critical",
    location_lat: 6.5056,
    location_lng: 3.3565,
    address: "Surulere, Lagos",
    image_urls: []
  },
  {
    title: "Traffic light malfunction at Ojuelegba",
    description: "The traffic light at Ojuelegba intersection is not working properly, causing major traffic congestion during rush hours.",
    category: "traffic_signal",
    status: "resolved",
    severity: "high",
    location_lat: 6.5074,
    location_lng: 3.3518,
    address: "Ojuelegba, Lagos",
    image_urls: []
  },
  {
    title: "Blocked drainage causing flooding",
    description: "The drainage system on Allen Avenue is completely blocked, causing flooding whenever it rains. This needs immediate attention.",
    category: "drainage",
    status: "open",
    severity: "high",
    location_lat: 6.6018,
    location_lng: 3.3515,
    address: "Allen Avenue, Ikeja",
    image_urls: []
  },
  {
    title: "Damaged sidewalk near National Theatre",
    description: "The sidewalk near the National Theatre has large cracks and missing sections, making it unsafe for pedestrians.",
    category: "sidewalk",
    status: "in_progress",
    severity: "medium",
    location_lat: 6.4649,
    location_lng: 3.3841,
    address: "National Theatre, Lagos",
    image_urls: []
  },
  {
    title: "Broken street light in Lekki Phase 1",
    description: "Multiple street lights along Admiralty Way are not functioning, making the area poorly lit at night.",
    category: "street_lighting",
    status: "open",
    severity: "medium",
    location_lat: 6.4281,
    location_lng: 3.5118,
    address: "Admiralty Way, Lekki",
    image_urls: []
  },
  {
    title: "Road surface damage on Lagos-Ibadan Expressway",
    description: "Several potholes and road surface damage on the Lagos-Ibadan Expressway near Berger bus stop are causing traffic delays.",
    category: "pothole",
    status: "open",
    severity: "critical",
    location_lat: 6.6516,
    location_lng: 3.3439,
    address: "Lagos-Ibadan Expressway, Berger",
    image_urls: []
  },
  {
    title: "Water leakage on Eko Bridge",
    description: "There's a major water pipe leakage under Eko Bridge causing water wastage and potential structural issues.",
    category: "water_supply",
    status: "in_progress",
    severity: "high",
    location_lat: 6.4641,
    location_lng: 3.3912,
    address: "Eko Bridge, Lagos",
    image_urls: []
  },
  {
    title: "Faulty traffic signal at CMS",
    description: "The traffic signal at CMS junction is showing wrong timing, causing confusion and near-accidents.",
    category: "traffic_signal",
    status: "open",
    severity: "high",
    location_lat: 6.4585,
    location_lng: 3.3890,
    address: "CMS, Lagos Island",
    image_urls: []
  }
];

// Function to seed the database with sample data
export async function seedDatabase() {
  try {
    // Starting database seeding...
    
    // First, check if we already have data
    const { data: existingIssues, error: checkError } = await supabase
      .from('issues')
      .select('id')
      .limit(1);
    
    if (checkError) {
      // Error checking existing data
      return;
    }
    
    if (existingIssues && existingIssues.length > 0) {
      // Database already has data, skipping seed
      return;
    }
    
    // Create a default admin profile for seeding
    const { data: adminProfile, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        clerk_user_id: 'seed-admin',
        email: 'admin@citizn.ng',
        full_name: 'System Administrator',
        role: 'admin'
      })
      .select()
      .single();
    
    if (profileError) {
      // Error creating admin profile
      return;
    }
    
    // Insert seed issues
    const issuesWithReporter = seedIssues.map(issue => ({
      ...issue,
      reporter_id: adminProfile.id
    }));
    
    const { error: issuesError } = await supabase
      .from('issues')
      .insert(issuesWithReporter);
    
    if (issuesError) {
      // Error inserting seed issues
      return;
    }
    
    // Successfully seeded issues
    
  } catch (error) {
    // Error seeding database
  }
}

// Function to clear all data (for development)
export async function clearDatabase() {
  try {
    // Clearing database...
    
    // Delete in order due to foreign key constraints
    await supabase.from('notifications').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('issue_comments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('issue_upvotes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('issue_updates').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('issues').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Database cleared successfully
  } catch (error) {
    // Error clearing database
  }
}
