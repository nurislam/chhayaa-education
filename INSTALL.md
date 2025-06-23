# Frontend Installation Guide

This document provides detailed instructions for setting up the NextCMS frontend application.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Backend API server running (see ../cms-api/INSTALL.md)

## Detailed Installation Steps

### 1. Environment Setup

1. Copy the development environment file:

```bash
cp .env.dev .env
```

2. Update the environment variables in `.env`:

```env
NEXT_PUBLIC_API_ENDPOINT="http://localhost:3001/"
NEXT_INTERNAL_API_ENDPOINT="http://localhost:3001/"
NODE_ENV="development"
```

Make sure the API endpoints match your backend server configuration.

### 2. Application Setup

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

The application will be available at http://localhost:3000

### 3. Building for Production

1. Create a production build:

```bash
npm run build
```

2. Start the production server:

```bash
npm run start
```

## Project Structure

```
cms/
├── public/          # Static files
├── src/
│   ├── app/        # Next.js app directory
│   ├── components/ # React components
│   ├── data/       # Data fetching and API integration
│   ├── repositories/ # Data access layer
│   ├── state/      # Redux state management
│   ├── types/      # TypeScript type definitions
│   └── utils/      # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run linting

## Features

- Built with Next.js 15+
- TypeScript support
- Material-UI components
- Redux Toolkit for state management
- React Query for data fetching
- Responsive design
- Server-side rendering
- SEO optimization
- Modern development tools

## Development Workflow

1. Start the backend server first
2. Run the frontend in development mode
3. Make changes and see live updates
4. Use proper TypeScript types
5. Follow the existing code style

## Troubleshooting

1. If the development server won't start:

   - Check if port 3000 is available
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. If API calls fail:

   - Verify the backend server is running
   - Check API endpoint configuration
   - Look for CORS issues

3. For build errors:
   - Check for TypeScript errors
   - Verify import paths
   - Check for missing dependencies

## Best Practices

1. Use TypeScript for all new code
2. Follow the existing component structure
3. Use Material-UI components when possible
4. Implement proper error handling
5. Write meaningful commit messages
6. Keep dependencies updated

## Performance Considerations

1. Use Next.js Image component for images
2. Implement proper code splitting
3. Use proper caching strategies
4. Optimize bundle size
5. Use proper loading states
6. Implement error boundaries

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style
2. Write meaningful commit messages
3. Update documentation as needed
4. Test your changes thoroughly
5. Create pull requests for review
