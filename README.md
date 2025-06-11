# Citizn - Infrastructure Issue Reporting Platform

<div align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.5.3-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-5.4.1-purple?style=for-the-badge&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind-3.4.11-cyan?style=for-the-badge&logo=tailwindcss" alt="Tailwind">
  <img src="https://img.shields.io/badge/Supabase-2.50.0-green?style=for-the-badge&logo=supabase" alt="Supabase">
</div>

## 🌟 Overview

**Citizn** is a comprehensive civic engagement platform that bridges the gap between citizens and local government through efficient infrastructure issue reporting and management. Our platform empowers communities to report, track, and resolve infrastructure problems while providing administrators with powerful tools to coordinate responses and analyze trends.

### 🎯 Mission

To create stronger, more responsive communities by facilitating transparent communication between citizens and local authorities, ensuring infrastructure issues are addressed efficiently and effectively.

## ✨ Key Features

### 👥 For Citizens

-   **📱 Easy Issue Reporting**: Submit detailed reports with photos, location data, and priority levels
-   **📍 GPS Integration**: Precise location tracking for accurate issue mapping
-   **📊 Personal Dashboard**: Track your submitted reports and community impact
-   **🔄 Real-time Updates**: Stay informed about the progress of your reports
-   **🏆 Community Engagement**: Upvote issues and engage with your local community
-   **📈 Impact Metrics**: See your contribution to community improvement

### 👨‍💼 For Administrators

-   **📋 Comprehensive Dashboard**: Overview of all reported issues with key metrics
-   **🚨 Priority Management**: Automatic categorization and urgent issue alerts
-   **📊 Analytics & Insights**: Data-driven decision making with detailed reporting
-   **⚡ Workflow Management**: Efficient issue resolution tracking and coordination
-   **👥 Team Collaboration**: Coordinate with response teams and departments
-   **📈 Performance Monitoring**: Track resolution times and success rates

### 🛠️ Infrastructure Issue Types

-   **🕳️ Potholes & Road Damage**: Report dangerous road conditions
-   **💡 Street Lighting**: Broken or malfunctioning streetlights
-   **💧 Water Supply Issues**: Disruptions, leaks, and quality problems
-   **🚦 Traffic Systems**: Malfunctioning traffic lights and signals
-   **🌊 Drainage Problems**: Blocked drains and flooding issues
-   **🏗️ General Infrastructure**: Sidewalks, public facilities, and more

## 🚀 Technology Stack

### Frontend

-   **React 18.3.1** - Modern component-based UI framework
-   **TypeScript 5.5.3** - Type-safe development
-   **Vite 5.4.1** - Lightning-fast build tool and dev server
-   **React Router 6.26.2** - Client-side routing
-   **Tailwind CSS 3.4.11** - Utility-first CSS framework
-   **shadcn/ui + Radix UI** - Modern, accessible component library

### Backend & Database

-   **Supabase** - Backend-as-a-service with PostgreSQL
-   **TanStack React Query** - Powerful data fetching and state management
-   **Real-time subscriptions** - Live updates for issue status changes

### Authentication & Security

-   **Clerk** - Complete user management and authentication
-   **Role-based access control** - Separate citizen and admin interfaces
-   **Secure API endpoints** - Protected routes and data access

### Additional Tools

-   **Lucide React** - Beautiful, customizable icons
-   **React Hook Form + Zod** - Form handling with validation
-   **Date-fns** - Date manipulation and formatting
-   **ESLint + TypeScript ESLint** - Code quality and consistency

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui component library
│   ├── AuthGuard.tsx    # Authentication protection
│   ├── ReportForm.tsx   # Issue reporting form
│   ├── IssueCard.tsx    # Individual issue display
│   ├── IssueMap.tsx     # Interactive map component
│   └── CitiznLogo.tsx   # Brand logo component
├── pages/               # Main application pages
│   ├── Index.tsx        # Landing page with role selection
│   ├── Auth.tsx         # Authentication page
│   ├── CitizenDashboard.tsx   # Citizen interface
│   ├── AdminDashboard.tsx     # Administrator interface
│   └── NotFound.tsx     # 404 error page
├── integrations/        # External service integrations
│   └── supabase/        # Database configuration and types
├── lib/                 # Utility functions and data
│   └── mockData.ts      # Development data
├── hooks/               # Custom React hooks
└── App.tsx             # Main application component
```

## 🚀 Getting Started

### Prerequisites

-   **Node.js** 18+ and npm (or yarn/pnpm)
-   **Git** for version control

### Installation

1. **Clone the repository**

    ```bash
    git clone <your-git-url>
    cd infra-fix-citizen
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Environment Setup**

    - Configure Clerk authentication keys
    - Set up Supabase database connection
    - Add environment variables as needed

4. **Start development server**

    ```bash
    npm run dev
    ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Available Scripts

-   `npm run dev` - Start development server with hot reload
-   `npm run build` - Build for production
-   `npm run build:dev` - Build for development environment
-   `npm run preview` - Preview production build locally
-   `npm run lint` - Run ESLint for code quality checks

## 🎯 Usage Guide

### For Citizens

1. **Sign Up/Login**: Create an account or sign in using Clerk authentication
2. **Select Role**: Choose "I'm a Citizen" on the landing page
3. **Report Issues**: Click "Report New Issue" and fill out the detailed form
4. **Track Progress**: Monitor your reports through the personal dashboard
5. **Engage**: Upvote other issues and contribute to community discussions

### For Administrators

1. **Admin Access**: Sign in and select "I'm an Administrator"
2. **Monitor Dashboard**: View system-wide metrics and priority alerts
3. **Manage Issues**: Review, categorize, and assign reported issues
4. **Track Performance**: Use analytics to optimize response strategies
5. **Coordinate Teams**: Manage workflow and team assignments

## 📊 Current Status & Metrics

-   **🏗️ Development Stage**: Active development with core features implemented
-   **👥 Mock Data**: Currently using sample data for development and testing
-   **🔄 Real-time Features**: Supabase integration for live updates
-   **📱 Responsive Design**: Optimized for desktop and mobile devices
-   **♿ Accessibility**: Built with accessibility-first principles using Radix UI

## 🗺️ Roadmap

### Phase 1 (Current)

-   ✅ Core issue reporting functionality
-   ✅ Role-based dashboards
-   ✅ Authentication system
-   ✅ Responsive UI/UX design

### Phase 2 (Upcoming)

-   🔄 Live Supabase database integration
-   📍 Advanced mapping features
-   📧 Email notifications and alerts
-   📊 Enhanced analytics and reporting

### Phase 3 (Future)

-   📱 Mobile app development
-   🤖 AI-powered issue categorization
-   🔗 Government API integrations
-   🌍 Multi-language support
-   📈 Advanced community features

## 🤝 Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, or improving documentation, your help makes Citizn better for everyone.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

-   Follow TypeScript best practices
-   Maintain consistent code formatting with ESLint
-   Write descriptive commit messages
-   Test your changes thoroughly
-   Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

-   📧 **Email**: [your-email@example.com]
-   🐛 **Issues**: [GitHub Issues](link-to-issues)
-   💬 **Discussions**: [GitHub Discussions](link-to-discussions)

## 🙏 Acknowledgments

-   **Lovable Platform** - For providing the development environment
-   **shadcn/ui** - For the beautiful component library
-   **Clerk** - For robust authentication solutions
-   **Supabase** - For backend infrastructure
-   **Open Source Community** - For the amazing tools and libraries

---

<div align="center">
  <p><strong>Built with ❤️ for stronger communities</strong></p>
  <p>Making civic engagement accessible, transparent, and effective</p>
</div>

## Mission Statement

To address the negative effects of digital systems on human interaction by creating technology that facilitates empathetic, transparent, and effective communication between citizens and their local governments.

## Problem Statement

Local infrastructure issues often go unresolved due to inefficient reporting channels, lack of transparency, and minimal citizen involvement. This leads to poor community trust, deteriorating infrastructure, and reduced civic engagement.
