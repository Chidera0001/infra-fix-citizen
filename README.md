# Citizn - Infrastructure Issue Management Platform

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.1-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.11-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.50.0-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> A modern, scalable platform that empowers citizens to report infrastructure issues and enables local authorities to respond efficiently through data-driven insights and streamlined workflows.

## 📹 Initial software product/solution demonstration

**Click to view**

📺 [Final Project Video Demo](https://youtu.be/8_3Sh-eyAHI)  
🎨 [View Figma Design](https://www.figma.com/design/jI3bpZDQhj8dCYeMAURjwj/Citizn?node-id=0-1&t=b4hmPiuE346e53nT-1)  
📋 [Detailed Testing, Analysis, Discussion & Recommendation Document](https://docs.google.com/document/d/1p4GKG4_Rh4DISLj9Kdwq7-Q0VvOKgMwtzhlGqfLjakU/edit?usp=sharing)

## 🌐 Live Platform

**🚀 Try the application:**

[https://infra-fix-citizen.vercel.app/](https://infra-fix-citizen.vercel.app/)

_⚠️ **Note:** This is currently hosted on Vercel. The URL will change when a custom domain is purchased._

## 📸 Screenshots

### 🏠 Citizen Dashboard

![Citizn Landing Page](/public/Assets/Screenshots/Citizn%20Dashboard.png)
_Modern, responsive landing page with hero section and key features_

### 📝 Issue Reporting

![Issue Reporting Interface](/public/Assets/Screenshots/Report-Issue.png)
_Intuitive issue reporting form with step-by-step guidance_

### 👨‍💼 Admin Dashboard

![Admin Dashboard](/public/Assets/Screenshots/Admin-Dashboard.png)
_Comprehensive admin dashboard with analytics and issue management_

### 👥 User Management

![User Management Interface](/public/Assets/Screenshots/Admin-User-Management.png)
_Advanced user management system for administrators_

## 🧪 Testing

### Comprehensive Testing Documentation

Visit detailed testing, analysis, discussion and recommendation document for detailed testing results or watch demo video.

### 🔧 Unit Testing

![Unit Testing Results](/public/Assets/Screenshots/Unit%20Testing.png)
_Component-level testing using Vitest framework_

### 🔗 Integration Testing

| Integration Testing 1                                                 | Integration Testing 2                                                 |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| ![Integration Testing 1](/public/Assets/Screenshots/Integration1.png) | ![Integration Testing 2](/public/Assets/Screenshots/Integration2.png) |
| _End-to-end workflow testing - Part 1_                                | _End-to-end workflow testing - Part 2_                                |

### 🖥️ System Testing

| System Testing 1                                                         | System Testing 2                                                         | System Testing 3                                                         |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| ![System Testing 1](/public/Assets/Screenshots/System%20Testing%201.png) | ![System Testing 2](/public/Assets/Screenshots/System%20Testing%202.png) | ![System Testing 3](/public/Assets/Screenshots/System%20Testing%203.png) |
| _Production environment testing_                                         | _Cross-browser compatibility_                                            | _Mobile responsiveness testing_                                          |

### 🔐 Authentication Testing

![Authentication Testing](/public/Assets/Screenshots/Authentication%20data.png)
_Authentication system testing with various scenarios_

### 📊 Data Validation Testing

| Data Values Testing                                                  | Form Validation Testing                                                      |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| ![Data Values Testing](/public/Assets/Screenshots/Data%20values.png) | ![Form Validation Testing](/public/Assets/Screenshots/Form%20validation.png) |
| _Testing with different data values and edge cases_                  | _Form validation and error handling testing_                                 |

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher (or yarn/pnpm)
- **Git** for version control
- **Supabase Account** ([Sign up free](https://supabase.com))
- **Geoapify API Key** ([Get one here](https://geoapify.com))

### Installation

#### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/Chidera0001/infra-fix-citizen.git
cd infra-fix-citizen

# Install dependencies
npm install
```

#### Step 2: Environment Setup

Create a `.env.local` file in the project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Geoapify API (for geocoding and reverse geocoding)
VITE_GEOAPIFY_API_KEY=your_geoapify_api_key
```

#### Step 3: Database Setup

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select an existing one
3. Go to **SQL Editor**
4. Run the SQL script from `supabase/setup-storage.sql` to set up:
   - Database tables
   - Row Level Security policies
   - Storage bucket for images
   - Database functions

#### Step 4: Start Development Server

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

#### Step 5: Verify Setup

1. Open `http://localhost:5173` in your browser
2. Try creating an account and reporting an issue
3. Check that photos upload successfully
4. Verify location detection works

## 📚 Documentation

| Document                                   | Description                               |
| ------------------------------------------ | ----------------------------------------- |
| [Architecture Guide](docs/ARCHITECTURE.md) | System architecture and design principles |
| [Development Guide](docs/DEVELOPMENT.md)   | Development workflow and best practices   |
| [API Reference](docs/API_REFERENCE.md)     | Complete API documentation                |
| [Deployment Guide](docs/DEPLOYMENT.md)     | Production deployment instructions        |
| [Getting Started](docs/GETTING_STARTED.md) | Quick start guide for new developers      |

## 🌟 About

Citizn is a comprehensive civic engagement platform designed to streamline infrastructure issue reporting and management. By connecting citizens with local authorities through an intuitive, data-driven interface, we facilitate transparent communication and efficient problem resolution.

### 🎯 Mission Statement

To create stronger, more responsive communities by facilitating transparent communication between citizens and local authorities, ensuring infrastructure issues are addressed efficiently and effectively.

### 🎯 Vision

A world where every citizen has a voice in their community's development, and local authorities have the tools to respond effectively to infrastructure needs.

## ✨ Features

### 👥 Citizen Portal

| Feature                  | Description                                                             |
| ------------------------ | ----------------------------------------------------------------------- |
| **Issue Reporting**      | Submit detailed reports with photos, location data, and priority levels |
| **GPS Integration**      | Precise location tracking for accurate issue mapping                    |
| **Personal Dashboard**   | Track submitted reports and community impact                            |
| **Real-time Updates**    | Stay informed about report progress and status changes                  |
| **Community Engagement** | Upvote issues and participate in community discussions                  |
| **Impact Analytics**     | View personal contribution metrics and community impact                 |

### 👨‍💼 Administrator Portal

| Feature                     | Description                                                  |
| --------------------------- | ------------------------------------------------------------ |
| **Comprehensive Dashboard** | Overview of all reported issues with key performance metrics |
| **Priority Management**     | Automatic categorization and urgent issue alert system       |
| **Advanced Analytics**      | Data-driven insights with detailed reporting and trends      |
| **Workflow Management**     | Streamlined issue resolution tracking and team coordination  |
| **Team Collaboration**      | Multi-department coordination and assignment tools           |
| **Performance Monitoring**  | Resolution time tracking and success rate analytics          |

### 🛠️ Supported Issue Categories

- **🕳️ Road Infrastructure**: Potholes, road damage, and traffic hazards
- **💡 Street Lighting**: Broken or malfunctioning streetlights
- **💧 Water Systems**: Supply disruptions, leaks, and quality issues
- **🚦 Traffic Management**: Malfunctioning traffic lights and signals
- **🌊 Drainage Systems**: Blocked drains and flooding problems
- **🏗️ Public Facilities**: Sidewalks, public buildings, and amenities

## 🛠️ Technology Stack

### Frontend Technologies

| Technology       | Version | Purpose                                  |
| ---------------- | ------- | ---------------------------------------- |
| **React**        | 18.3.1  | Modern component-based UI framework      |
| **TypeScript**   | 5.5.3   | Type-safe development and enhanced DX    |
| **Vite**         | 5.4.1   | Lightning-fast build tool and dev server |
| **React Router** | 6.26.2  | Client-side routing and navigation       |
| **Tailwind CSS** | 3.4.11  | Utility-first CSS framework              |
| **shadcn/ui**    | Latest  | Modern, accessible component library     |

### Backend & Database

| Technology             | Version  | Purpose                                     |
| ---------------------- | -------- | ------------------------------------------- |
| **Supabase**           | 2.50.0   | Backend-as-a-service with PostgreSQL        |
| **TanStack Query**     | 5.56.2   | Powerful data fetching and state management |
| **PostgreSQL**         | 15+      | Robust relational database                  |
| **Row Level Security** | Built-in | Database-level security policies            |

### Authentication & Security

| Technology             | Purpose                                     |
| ---------------------- | ------------------------------------------- |
| **Supabase Auth**      | Complete user management and authentication |
| **JWT Tokens**         | Secure API authentication                   |
| **Row Level Security** | Database-level security policies            |
| **HTTPS**              | Encrypted data transmission                 |

### Maps & Location Services

| Technology          | Purpose                         |
| ------------------- | ------------------------------- |
| **Leaflet**         | Interactive map library         |
| **Geoapify API**    | Geocoding and reverse geocoding |
| **OpenStreetMap**   | Map tiles and data              |
| **GPS Integration** | Location detection from photos  |

### Development Tools

| Technology            | Purpose                           |
| --------------------- | --------------------------------- |
| **ESLint**            | Code quality and consistency      |
| **Prettier**          | Code formatting                   |
| **TypeScript ESLint** | TypeScript-specific linting rules |
| **Vitest**            | Unit testing framework            |
| **React Hook Form**   | Form handling and validation      |
| **Zod**               | Schema validation                 |

## 🏗️ Project Structure

```
infra-fix-citizen/
├── public/                     # Static assets
│   ├── Assets/                # Images and videos
│   └── api-spec.yaml          # OpenAPI specification
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # shadcn/ui component library
│   │   ├── admin/            # Admin-specific components
│   │   ├── citizen/          # Citizen-specific components
│   │   ├── forms/            # Form components
│   │   ├── InstantReport/    # Camera and instant reporting
│   │   ├── maps/             # Leaflet map components
│   │   ├── offline/          # Offline functionality
│   │   ├── sections/         # Page sections (Hero, Stats, etc.)
│   │   ├── shared/           # Shared components
│   │   └── Navbar.tsx        # Main navigation
│   ├── pages/                # Main application pages
│   │   ├── Index.tsx         # Landing page
│   │   ├── Auth.tsx          # Authentication page
│   │   ├── CitizenDashboard.tsx  # Citizen interface
│   │   ├── AdminDashboard.tsx    # Administrator interface
│   │   ├── ReportIssue.tsx   # Issue reporting page
│   │   ├── ReportNow.tsx     # Instant reporting
│   │   └── NotFound.tsx      # 404 error page
│   ├── features/             # Feature-based modules
│   │   ├── auth/            # Authentication features
│   │   ├── issues/          # Issue management features
│   │   └── maps/            # Map-related features
│   ├── hooks/               # Custom React hooks
│   │   ├── use-issues.ts    # Issue management hook
│   │   ├── use-stats.ts     # Statistics data hook
│   │   ├── use-separate-issues.ts  # Online/offline issue handling
│   │   └── use-online-status.ts   # Network status detection
│   ├── lib/                 # Utility functions and configurations
│   │   ├── supabase-api.ts  # Supabase API client
│   │   ├── utils.ts         # General utilities
│   │   └── googleSheetsExport.ts  # Data export functionality
│   ├── integrations/        # External service integrations
│   │   └── supabase/        # Database configuration and types
│   ├── utils/               # Utility functions
│   │   ├── geocoding.ts     # Geoapify API integration
│   │   ├── exifExtractor.ts # GPS data from photos
│   │   ├── offlineStorage.ts # Offline data management
│   │   └── syncService.ts   # Data synchronization
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx  # Authentication state
│   ├── types/               # TypeScript type definitions
│   └── constants/           # Application constants
├── docs/                    # Documentation
├── supabase/               # Supabase configuration
│   └── setup-storage.sql   # Database setup script
├── scripts/                # Build and setup scripts
└── tests/                  # Test files
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher (or yarn/pnpm)
- **Git** for version control

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/infra-fix-citizen.git
   cd infra-fix-citizen
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration:
   - Supabase database connection
   - Geoapify API key for geocoding

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Available Scripts

| Script               | Description                              |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Start development server with hot reload |
| `npm run build`      | Build for production                     |
| `npm run build:dev`  | Build for development environment        |
| `npm run preview`    | Preview production build locally         |
| `npm run lint`       | Run ESLint for code quality checks       |
| `npm run lint:fix`   | Fix ESLint errors automatically          |
| `npm run format`     | Format code with Prettier                |
| `npm run type-check` | Run TypeScript type checking             |
| `npm run test`       | Run test suite                           |
| `npm run setup`      | Run project setup script                 |

## 📖 Usage Guide

### 👥 For Citizens

1. **Account Setup**: Create an account or sign in using Supabase authentication
2. **Role Selection**: Choose "I'm a Citizen" on the landing page
3. **Issue Reporting**:
   - **Instant Report**: Use camera to capture and report issues instantly
   - **Detailed Report**: Fill out comprehensive form with photos and location
   - **Location Detection**: GPS coordinates automatically extracted from photos
   - **Offline Support**: Report issues even without internet connection
4. **Progress Tracking**: Monitor your reports through the personal dashboard
5. **Community Engagement**: View community issues and track resolution progress

### 👨‍💼 For Administrators

1. **Admin Access**: Sign in and select "I'm an Administrator"
2. **Dashboard Overview**: View system-wide metrics and priority alerts
3. **Issue Management**:
   - Review and categorize reported issues
   - Update issue status and progress
   - Export data to Excel/CSV for analysis
   - Generate comprehensive reports
4. **Analytics & Reporting**: Use data insights to optimize response strategies
5. **User Management**: Monitor citizen engagement and system usage

## 📊 Project Status

| Component            | Status      | Description                                   |
| -------------------- | ----------- | --------------------------------------------- |
| **Core Features**    | ✅ Complete | Issue reporting, user management, dashboards  |
| **Authentication**   | ✅ Complete | Supabase Auth with role-based access          |
| **Database**         | ✅ Complete | Supabase integration with real-time updates   |
| **Maps Integration** | ✅ Complete | Leaflet maps with Geoapify geocoding          |
| **Offline Support**  | ✅ Complete | Offline issue reporting and sync              |
| **Photo Upload**     | ✅ Complete | 4MB limit with GPS extraction                 |
| **UI/UX**            | ✅ Complete | Responsive design with accessibility features |
| **API Integration**  | ✅ Complete | RESTful API with comprehensive endpoints      |
| **Testing**          | ✅ Complete | Unit, integration, and system tests           |
| **Documentation**    | ✅ Complete | Comprehensive documentation suite             |

## 🗺️ Development Roadmap

### Phase 1: Foundation ✅

- [x] Core issue reporting functionality
- [x] Role-based dashboards (Citizen & Admin)
- [x] Authentication system (Supabase Auth)
- [x] Responsive UI/UX design
- [x] Database integration (Supabase)
- [x] Real-time updates
- [x] Leaflet maps integration
- [x] Geoapify geocoding services
- [x] Offline functionality
- [x] Photo upload with GPS extraction

### Phase 2: Enhancement ✅

- [x] Advanced mapping features
- [x] Comprehensive testing suite
- [x] Performance optimization
- [x] Data export functionality
- [x] Enhanced analytics and reporting
- [x] Error handling and validation

### Phase 3: Expansion 📋

- [ ] Mobile app development (React Native)
- [ ] AI-powered issue categorization
- [ ] Email notifications and alerts
- [ ] Government API integrations
- [ ] Multi-language support
- [ ] Advanced community features
- [ ] Third-party integrations

## 🤝 Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, or improving documentation, your help makes Citizn better for everyone.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Maintain consistent code formatting with ESLint
- Write descriptive commit messages
- Test your changes thoroughly
- Update documentation as needed
- Follow the existing code style and patterns

### Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

- 📧 **Email**: [c.anele@alustudent.com]
- 🐛 **Issues**: [GitHub Issues](https://github.com/Chidera0001/infra-fix-citizen/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Chidera0001/infra-fix-citizen/discussions)

## 🙏 Acknowledgments

- **shadcn/ui** - For the beautiful component library
- **Supabase** - For backend infrastructure & authentication solutions
- **Open Source Community** - For the amazing tools and libraries

```

```
