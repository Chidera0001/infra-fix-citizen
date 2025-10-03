# Citizn - Infrastructure Issue Management Platform

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.1-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.11-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.50.0-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> A modern, scalable platform that empowers citizens to report infrastructure issues and enables local authorities to respond efficiently through data-driven insights and streamlined workflows.

## 📹 Initial software product/solution demonstration

<div>
  <p>
    <strong>Click to view</strong><br>
    📺 <a href="https://screenrec.com/share/iQMIGsvWmp" target="_blank" rel="noopener noreferrer">Watch on ScreenRec (External Link)</a><br>
    🎨 <a href="https://www.figma.com/design/jI3bpZDQhj8dCYeMAURjwj/Citizn?node-id=0-1&t=b4hmPiuE346e53nT-1" target="_blank" rel="noopener noreferrer">View Figma Design</a>
  </p>
  
  <p>
    <strong>Video file location:</strong><br>
    📁 <code>public/Assets/Videos/Initial software product & solution demonstration.mp4</code>
  </p>
</div>

## 📸 Screenshots

### 🏠 Citizen Dashboard
<div align="center">
  <img src="/public/Assets/Screenshots/Citizn Dashboard.png" alt="Citizn Landing Page" width="800" style="border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
  <p><em>Modern, responsive landing page with hero section and key features</em></p>
</div>

### 📝 Issue Reporting
<div align="center">
  <img src="/public/Assets/Screenshots/Report-Issue.png" alt="Issue Reporting Interface" width="800" style="border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
  <p><em>Intuitive issue reporting form with step-by-step guidance</em></p>
</div>

### 👨‍💼 Admin Dashboard
<div align="center">
  <img src="/public/Assets/Screenshots/Admin-Dashboard.png" alt="Admin Dashboard" width="800" style="border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
  <p><em>Comprehensive admin dashboard with analytics and issue management</em></p>
</div>

### 👥 User Management
<div align="center">
  <img src="/public/Assets/Screenshots/Admin-User-Managament.png" alt="User Management Interface" width="800" style="border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
  <p><em>Advanced user management system for administrators</em></p>
</div>

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher (or yarn/pnpm)
- **Git** for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/Chidera0001/infra-fix-citizen.git
cd infra-fix-citizen

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run the setup script
npm run setup

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Architecture Guide](docs/ARCHITECTURE.md) | System architecture and design principles |
| [Development Guide](docs/DEVELOPMENT.md) | Development workflow and best practices |
| [API Reference](docs/API_REFERENCE.md) | Complete API documentation |
| [Deployment Guide](docs/DEPLOYMENT.md) | Production deployment instructions |
| [Getting Started](docs/GETTING_STARTED.md) | Quick start guide for new developers |

## 🌟 About

Citizn is a comprehensive civic engagement platform designed to streamline infrastructure issue reporting and management. By connecting citizens with local authorities through an intuitive, data-driven interface, we facilitate transparent communication and efficient problem resolution.

### 🎯 Mission Statement

To create stronger, more responsive communities by facilitating transparent communication between citizens and local authorities, ensuring infrastructure issues are addressed efficiently and effectively.

### 🎯 Vision

A world where every citizen has a voice in their community's development, and local authorities have the tools to respond effectively to infrastructure needs.

## ✨ Features

### 👥 Citizen Portal

| Feature | Description |
|---------|-------------|
| **Issue Reporting** | Submit detailed reports with photos, location data, and priority levels |
| **GPS Integration** | Precise location tracking for accurate issue mapping |
| **Personal Dashboard** | Track submitted reports and community impact |
| **Real-time Updates** | Stay informed about report progress and status changes |
| **Community Engagement** | Upvote issues and participate in community discussions |
| **Impact Analytics** | View personal contribution metrics and community impact |

### 👨‍💼 Administrator Portal

| Feature | Description |
|---------|-------------|
| **Comprehensive Dashboard** | Overview of all reported issues with key performance metrics |
| **Priority Management** | Automatic categorization and urgent issue alert system |
| **Advanced Analytics** | Data-driven insights with detailed reporting and trends |
| **Workflow Management** | Streamlined issue resolution tracking and team coordination |
| **Team Collaboration** | Multi-department coordination and assignment tools |
| **Performance Monitoring** | Resolution time tracking and success rate analytics |

### 🛠️ Supported Issue Categories

- **🕳️ Road Infrastructure**: Potholes, road damage, and traffic hazards
- **💡 Street Lighting**: Broken or malfunctioning streetlights
- **💧 Water Systems**: Supply disruptions, leaks, and quality issues
- **🚦 Traffic Management**: Malfunctioning traffic lights and signals
- **🌊 Drainage Systems**: Blocked drains and flooding problems
- **🏗️ Public Facilities**: Sidewalks, public buildings, and amenities

## 🛠️ Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | Modern component-based UI framework |
| **TypeScript** | 5.5.3 | Type-safe development and enhanced DX |
| **Vite** | 5.4.1 | Lightning-fast build tool and dev server |
| **React Router** | 6.26.2 | Client-side routing and navigation |
| **Tailwind CSS** | 3.4.11 | Utility-first CSS framework |
| **shadcn/ui** | Latest | Modern, accessible component library |

### Backend & Database

| Technology | Version | Purpose |
|------------|---------|---------|
| **Supabase** | 2.50.0 | Backend-as-a-service with PostgreSQL |
| **TanStack Query** | 5.56.2 | Powerful data fetching and state management |
| **PostgreSQL** | 15+ | Robust relational database |
| **Row Level Security** | Built-in | Database-level security policies |

### Authentication & Security

| Technology | Purpose |
|------------|---------|
| **Clerk** | Complete user management and authentication |
| **JWT Tokens** | Secure API authentication |
| **Role-based Access Control** | Granular permission management |
| **HTTPS** | Encrypted data transmission |

### Development Tools

| Technology | Purpose |
|------------|---------|
| **ESLint** | Code quality and consistency |
| **Prettier** | Code formatting |
| **TypeScript ESLint** | TypeScript-specific linting rules |
| **Vitest** | Unit testing framework |
| **React Hook Form** | Form handling and validation |
| **Zod** | Schema validation |

## 🏗️ Project Structure

```
infra-fix-citizen/
├── public/                     # Static assets
│   ├── Assets/                # Images and videos
│   └── api-spec.yaml          # OpenAPI specification
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # shadcn/ui component library
│   │   ├── sections/         # Page sections (Hero, Stats, etc.)
│   │   ├── layout/           # Layout components
│   │   ├── admin/            # Admin-specific components
│   │   ├── AuthGuard.tsx     # Authentication protection
│   │   ├── ReportForm.tsx    # Issue reporting form
│   │   ├── IssueCard.tsx     # Individual issue display
│   │   ├── IssueMap.tsx      # Interactive map component
│   │   └── CitiznLogo.tsx    # Brand logo component
│   ├── pages/                # Main application pages
│   │   ├── Index.tsx         # Landing page
│   │   ├── Auth.tsx          # Authentication page
│   │   ├── CitizenDashboard.tsx  # Citizen interface
│   │   ├── AdminDashboard.tsx    # Administrator interface
│   │   ├── ReportIssue.tsx   # Issue reporting page
│   │   └── NotFound.tsx      # 404 error page
│   ├── features/             # Feature-based modules
│   │   ├── auth/            # Authentication features
│   │   ├── issues/          # Issue management features
│   │   └── maps/            # Map-related features
│   ├── hooks/               # Custom React hooks
│   │   ├── use-stats.ts     # Statistics data hook
│   │   ├── use-issues.ts    # Issue management hook
│   │   └── use-profile.ts   # User profile hook
│   ├── lib/                 # Utility functions and configurations
│   │   ├── supabase-api.ts  # Supabase API client
│   │   ├── utils.ts         # General utilities
│   │   └── constants.ts     # Application constants
│   ├── integrations/        # External service integrations
│   │   └── supabase/        # Database configuration and types
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
├── docs/                    # Documentation
├── supabase/               # Supabase configuration
│   └── migrations/         # Database migrations
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
   - Clerk authentication keys
   - Supabase database connection
   - Google Maps API key (optional)

4. **Start development server**
        ```bash
    npm run dev
```

5. **Open your browser**
   Navigate to `http://localhost:3000` to view the application

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run build:dev` | Build for development environment |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |
| `npm run lint:fix` | Fix ESLint errors automatically |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Run TypeScript type checking |
| `npm run test` | Run test suite |
| `npm run setup` | Run project setup script |

## 📖 Usage Guide

### 👥 For Citizens

1. **Account Setup**: Create an account or sign in using Clerk authentication
2. **Role Selection**: Choose "I'm a Citizen" on the landing page
3. **Issue Reporting**: 
   - Click "Report New Issue" 
   - Fill out the detailed form with photos and location
   - Submit for review
4. **Progress Tracking**: Monitor your reports through the personal dashboard
5. **Community Engagement**: Upvote issues and participate in discussions

### 👨‍💼 For Administrators

1. **Admin Access**: Sign in and select "I'm an Administrator"
2. **Dashboard Overview**: View system-wide metrics and priority alerts
3. **Issue Management**: 
   - Review and categorize reported issues
   - Assign issues to appropriate teams
   - Update issue status and progress
4. **Analytics & Reporting**: Use data insights to optimize response strategies
5. **Team Coordination**: Manage workflow and team assignments

## 📊 Project Status

| Component | Status | Description |
|-----------|--------|-------------|
| **Core Features** | ✅ Complete | Issue reporting, user management, dashboards |
| **Authentication** | ✅ Complete | Clerk integration with role-based access |
| **Database** | ✅ Complete | Supabase integration with real-time updates |
| **UI/UX** | ✅ Complete | Responsive design with accessibility features |
| **API Integration** | ✅ Complete | RESTful API with comprehensive endpoints |
| **Testing** | 🔄 In Progress | Unit and integration test coverage |
| **Documentation** | ✅ Complete | Comprehensive documentation suite |

## 🗺️ Development Roadmap

### Phase 1: Foundation ✅
- [x] Core issue reporting functionality
- [x] Role-based dashboards (Citizen & Admin)
- [x] Authentication system (Clerk)
- [x] Responsive UI/UX design
- [x] Database integration (Supabase)
- [x] Real-time updates

### Phase 2: Enhancement 🔄
- [ ] Advanced mapping features
- [ ] Email notifications and alerts
- [ ] Enhanced analytics and reporting
- [ ] Performance optimization
- [ ] Comprehensive testing suite

### Phase 3: Expansion 📋
- [ ] Mobile app development (React Native)
- [ ] AI-powered issue categorization
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
- **Clerk** - For robust authentication solutions
- **Supabase** - For backend infrastructure
- **Open Source Community** - For the amazing tools and libraries

