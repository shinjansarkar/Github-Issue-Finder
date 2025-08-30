# GitHub Issues Explorer

## Overview

This is a full-stack web application built to search, filter, and manage GitHub issues. The application provides a clean interface for discovering open source issues to contribute to, with advanced filtering capabilities and the ability to save issues for later reference. It integrates with the GitHub API to fetch real-time issue data and provides a modern, responsive user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React Framework**: Built with React 18 using TypeScript for type safety
- **Routing**: Client-side routing implemented with Wouter for lightweight navigation
- **State Management**: TanStack React Query for server state management and caching
- **UI Components**: Shadcn/ui component library built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with CSS variables for theming and dark mode support
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Server Framework**: Express.js with TypeScript for the REST API
- **Database Layer**: Drizzle ORM with PostgreSQL for type-safe database operations
- **Storage Strategy**: Dual storage implementation with in-memory storage for development and PostgreSQL for production
- **API Design**: RESTful endpoints for issues, saved issues, and search filters management
- **Middleware**: Custom logging middleware for API request tracking

### Database Schema
- **Issues Table**: Stores GitHub issue data including metadata, labels, and difficulty classification
- **Saved Issues Table**: Tracks user-saved issues with timestamps
- **Search Filters Table**: Persists user filter preferences across sessions

### Data Flow Pattern
- Issues are fetched from GitHub API and processed server-side
- Client-side caching with React Query reduces API calls
- Filter state is managed locally and synchronized with the server
- Real-time updates through optimistic UI updates

### Component Structure
- **Layout Components**: Header with search, sidebar with filters
- **Data Components**: Issue cards with rich metadata display
- **UI Components**: Reusable Shadcn components for consistent design
- **Hook Abstractions**: Custom hooks for issues fetching and mobile responsiveness

## External Dependencies

### GitHub Integration
- **GitHub API**: Primary data source for issue information
- **Authentication**: GitHub API token for rate limit management
- **Data Processing**: Server-side transformation of GitHub issue data with difficulty classification

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting for production
- **Connection Pooling**: Built-in connection management through Neon serverless driver

### Development Tools
- **Replit Integration**: Development environment optimization with cartographer and error overlay plugins
- **TypeScript**: Full-stack type safety with shared schema definitions
- **ESBuild**: Fast bundling for production server builds

### UI Libraries
- **Radix UI**: Unstyled, accessible component primitives
- **Lucide React**: Consistent icon system
- **Embla Carousel**: Touch-friendly carousel components
- **React Hook Form**: Form state management with validation

### Styling and Theming
- **Tailwind CSS**: Utility-first styling framework
- **CSS Variables**: Dynamic theming system for light/dark modes
- **PostCSS**: CSS processing with autoprefixer