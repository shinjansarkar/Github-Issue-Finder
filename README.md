# 🐙 GitHub Issues Explorer

A modern, responsive web application for discovering and exploring GitHub issues with advanced filtering capabilities. Built with React, TypeScript, and a sleek dark theme with colorful interactive elements.

![GitHub Issues Explorer](https://img.shields.io/badge/Status-Active-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Vite](https://img.shields.io/badge/Vite-4.0-orange)

## ✨ Features

### 🔍 Advanced Search & Filtering
- **Real-time search** across issue titles, descriptions, and repositories
- **Difficulty-based filtering**: Easy, Intermediate, Hard
- **Programming language filtering**: 24+ languages including JavaScript, Python, TypeScript, Rust, Go, and more
- **Label filtering**: Good First Issue, Help Wanted, Bug, Enhancement, Documentation, Hacktoberfest
- **Smart sorting**: Recently updated, Newest, Most commented

### 🎨 Modern UI/UX
- **Dark theme** with blackish backgrounds and colorful buttons
- **Fully responsive** design for all devices (mobile, tablet, desktop)
- **Smooth animations** and hover effects
- **Intuitive pagination** with numbered pages
- **Collapsible sidebar** for mobile devices

### 📱 Cross-Platform Support
- **Progressive Web App (PWA)** ready
- **Mobile-optimized** interface
- **Touch-friendly** controls
- **Offline-ready** capabilities

### 🔧 Developer Experience
- **TypeScript** for type safety
- **Modern React** with hooks and functional components
- **Tailwind CSS** for styling
- **Shadcn/ui** components for consistency
- **React Query** for data fetching and caching

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- GitHub API access (optional, for enhanced features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/github-issues-explorer.git
   cd github-issues-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your GitHub API token (optional):
   ```env
   VITE_GITHUB_API_KEY=your_github_token_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
github-issues-explorer/
├── client/                 # Frontend React application
│   ├── public/            # Static assets and favicon
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── ui/       # Shadcn/ui components
│   │   │   ├── filters-sidebar.tsx
│   │   │   ├── issue-card.tsx
│   │   │   └── search-header.tsx
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions and API
│   │   ├── pages/        # Page components
│   │   └── main.tsx      # Application entry point
│   ├── index.html
│   └── package.json
├── server/               # Backend API server
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API routes
│   └── storage.ts       # Data storage
├── shared/              # Shared types and schemas
└── README.md
```

## 🎯 Key Components

### Filters Sidebar
- **Difficulty filters**: Easy (green), Intermediate (orange), Hard (red)
- **Language filters**: 24+ programming languages with color-coded indicators
- **Label filters**: Common GitHub issue labels
- **Clear filters**: One-click reset functionality

### Issue Cards
- **Rich information**: Title, description, repository, language, labels
- **Interactive elements**: Save/unsave issues, view on GitHub
- **Visual indicators**: Difficulty badges, language colors, comment counts
- **Responsive layout**: Adapts to different screen sizes

### Search & Pagination
- **Real-time search**: Instant results as you type
- **Smart pagination**: Numbered pages with Previous/Next navigation
- **Results count**: Shows total number of matching issues

## 🎨 Design System

### Color Palette
- **Background**: Black (`#000000`)
- **Cards**: Dark gray (`#111827`)
- **Borders**: Gray (`#374151`)
- **Text**: White and light gray
- **Accents**: Blue, purple, green, orange, red gradients

### Typography
- **Primary**: Inter (sans-serif)
- **Code**: Fira Code (monospace)
- **Weights**: 100-900 (variable font)

### Components
- **Buttons**: Gradient backgrounds with hover effects
- **Cards**: Subtle shadows and borders
- **Badges**: Color-coded for different categories
- **Icons**: Lucide React icon set

## 🔧 Configuration

### Environment Variables
```env
# GitHub API Configuration
VITE_GITHUB_API_KEY=your_github_token_here

# Server Configuration
PORT=3000
NODE_ENV=development
```

### GitHub API Token (Optional)
While the app works without a GitHub API token, having one provides:
- Higher rate limits
- Access to private repositories
- Better search capabilities

To get a token:
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a new token with `public_repo` scope
3. Add it to your `.env.local` file

## 📱 PWA Features

The application is configured as a Progressive Web App with:
- **Web manifest** for app-like experience
- **Service worker** for offline functionality
- **App icons** in multiple sizes
- **Theme colors** matching the dark theme

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `client/dist`

### Manual Deployment
```bash
# Build the application
npm run build

# Serve the built files
npm run preview
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests** (if applicable)
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use functional components with hooks
- Maintain responsive design
- Add proper error handling
- Include loading states

## 🐛 Known Issues

- GitHub API rate limiting (mitigated with API token)
- Some repositories may not have language detection
- Large result sets may take time to load

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **GitHub API** for providing issue data
- **Shadcn/ui** for beautiful components
- **Tailwind CSS** for utility-first styling
- **Lucide React** for icons
- **React Query** for data management

## 📞 Support

If you encounter any issues or have questions:

1. **Check existing issues** on GitHub
2. **Create a new issue** with detailed information
3. **Join our community** discussions

---

**Made with ❤️ for the GitHub community**

*Find the perfect issue to contribute to and make the open source world better!*
