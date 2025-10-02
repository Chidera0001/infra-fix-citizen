#!/usr/bin/env node

/**
 * Supabase Backend Setup Script
 * This script helps set up the complete backend for Infrastructure Fix Citizen
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`)
};

async function checkSupabaseCLI() {
  log.title('🔍 Checking Prerequisites');
  
  try {
    execSync('supabase --version', { stdio: 'ignore' });
    log.success('Supabase CLI is installed');
    return true;
  } catch (error) {
    log.error('Supabase CLI is not installed');
    log.info('Install it with: npm install -g supabase');
    return false;
  }
}

async function checkSupabaseLogin() {
  try {
    execSync('supabase projects list', { stdio: 'ignore' });
    log.success('Logged in to Supabase');
    return true;
  } catch (error) {
    log.warning('Not logged in to Supabase');
    log.info('Please run: supabase login');
    return false;
  }
}

async function setupEnvironment() {
  log.title('⚙️  Environment Setup');
  
  const envPath = path.join(process.cwd(), '.env');
  const envExample = path.join(process.cwd(), '.env.example');
  
  if (fs.existsSync(envPath)) {
    log.warning('.env file already exists');
    const overwrite = await question('Do you want to update it? (y/n): ');
    if (overwrite.toLowerCase() !== 'y') {
      log.info('Skipping environment setup');
      return;
    }
  }
  
  log.info('Please provide your Supabase credentials:');
  log.info('(You can find these in your Supabase Dashboard → Settings → API)');
  
  const supabaseUrl = await question('Supabase Project URL: ');
  const supabaseAnonKey = await question('Supabase Anon Key: ');
  const clerkKey = await question('Clerk Publishable Key (optional): ');
  
  const envContent = `# Supabase Configuration
VITE_SUPABASE_URL=${supabaseUrl}
VITE_SUPABASE_ANON_KEY=${supabaseAnonKey}

# Clerk Configuration
VITE_CLERK_PUBLISHABLE_KEY=${clerkKey}

# Environment
NODE_ENV=development
`;
  
  fs.writeFileSync(envPath, envContent);
  log.success('.env file created successfully');
}

async function linkProject() {
  log.title('🔗 Linking Supabase Project');
  
  try {
    const projectRef = await question('Enter your Supabase Project Reference ID: ');
    log.info('Linking project...');
    
    execSync(`supabase link --project-ref ${projectRef}`, { stdio: 'inherit' });
    log.success('Project linked successfully');
    return true;
  } catch (error) {
    log.error('Failed to link project');
    log.info('You can find your project ref at: https://app.supabase.com/project/_/settings/general');
    return false;
  }
}

async function runMigrations() {
  log.title('🚀 Running Database Migrations');
  
  try {
    log.info('Pushing database migrations...');
    execSync('supabase db push', { stdio: 'inherit' });
    log.success('Migrations completed successfully');
    return true;
  } catch (error) {
    log.error('Migration failed');
    log.warning('You may need to reset your database with: supabase db reset');
    return false;
  }
}

async function verifySetup() {
  log.title('✅ Verifying Setup');
  
  try {
    log.info('Checking database status...');
    execSync('supabase db status', { stdio: 'inherit' });
    log.success('Database is ready!');
    return true;
  } catch (error) {
    log.error('Verification failed');
    return false;
  }
}

async function displayNextSteps() {
  log.title('🎉 Setup Complete!');
  
  console.log(`
${colors.green}Your backend is now fully set up!${colors.reset}

${colors.bright}Next Steps:${colors.reset}

1. ${colors.cyan}View Your Data:${colors.reset}
   → Go to https://app.supabase.com
   → Select your project
   → Click on "Table Editor" to view all tables

2. ${colors.cyan}Access Your Tables:${colors.reset}
   • profiles - User accounts
   • issues - Infrastructure reports
   • categories - Issue categories
   • issue_comments - User comments
   • notifications - System notifications

3. ${colors.cyan}Test Your API:${colors.reset}
   → Start your app: npm run dev
   → Visit: http://localhost:3000/api-docs
   → Test endpoints in Swagger UI

4. ${colors.cyan}Run Sample Queries:${colors.reset}
   → Open SQL Editor in Supabase
   → Run: SELECT * FROM issues;
   → Run: SELECT * FROM get_issue_statistics();

5. ${colors.cyan}Monitor Your Database:${colors.reset}
   → Dashboard → Database → Monitoring
   → View performance metrics and logs

${colors.bright}Useful Commands:${colors.reset}
• supabase db status        - Check database status
• supabase db reset         - Reset database (WARNING: deletes all data)
• supabase migration list   - View migration history
• npm run dev              - Start development server

${colors.bright}Documentation:${colors.reset}
• SUPABASE_DEPLOYMENT.md   - Complete deployment guide
• docs/API.md              - API documentation
• SWAGGER_INTEGRATION.md   - Swagger UI guide

${colors.green}Happy coding! 🚀${colors.reset}
`);
}

async function main() {
  console.clear();
  log.title('🏗️  Infrastructure Fix Citizen - Backend Setup');
  
  log.info('This script will help you set up your Supabase backend');
  log.warning('Make sure you have a Supabase account and project ready');
  
  const proceed = await question('\nDo you want to proceed? (y/n): ');
  if (proceed.toLowerCase() !== 'y') {
    log.info('Setup cancelled');
    rl.close();
    return;
  }
  
  // Step 1: Check prerequisites
  const hasCLI = await checkSupabaseCLI();
  if (!hasCLI) {
    log.error('Please install Supabase CLI first');
    rl.close();
    return;
  }
  
  const isLoggedIn = await checkSupabaseLogin();
  if (!isLoggedIn) {
    log.error('Please login to Supabase first: supabase login');
    rl.close();
    return;
  }
  
  // Step 2: Setup environment
  await setupEnvironment();
  
  // Step 3: Link project
  const linked = await linkProject();
  if (!linked) {
    rl.close();
    return;
  }
  
  // Step 4: Run migrations
  const migrated = await runMigrations();
  if (!migrated) {
    rl.close();
    return;
  }
  
  // Step 5: Verify setup
  await verifySetup();
  
  // Step 6: Display next steps
  await displayNextSteps();
  
  rl.close();
}

// Run the script
main().catch((error) => {
  log.error('An error occurred:');
  console.error(error);
  rl.close();
  process.exit(1);
});
