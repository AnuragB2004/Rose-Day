# Rose Day

A beautiful and interactive web application built with React and modern web technologies.

## Live Demo

Visit the live application here: **[https://happyrosedaybabbe.netlify.app/](https://happyrosedaybabbe.netlify.app/)**

## Project Overview

This is a React-based application featuring:

- **Modern UI Components** - Built with Radix UI components and Tailwind CSS
- **Form Management** - React Hook Form integration with validation
- **Data Fetching** - TanStack React Query for efficient server state management
- **Drag & Drop** - Hello Pangea DnD library for interactive components
- **Payment Integration** - Stripe support for payment processing
- **Responsive Design** - Mobile-first approach with Tailwind CSS

## Tech Stack

- **Frontend**: React, JavaScript
- **Styling**: Tailwind CSS, PostCSS
- **UI Components**: Radix UI
- **Build Tool**: Vite
- **State Management**: React Context, TanStack React Query
- **Forms**: React Hook Form
- **Deployment**: Netlify
- **Linting**: ESLint

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AnuragB2004/Rose-Day.git
cd "Rose Day"
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with any necessary configuration:
```bash
# Add your environment variables here
VITE_API_URL=your_api_url
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Build for production:

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

### Preview

Preview the production build locally:

```bash
npm run preview
```

### Linting

Check code quality:

```bash
npm run lint
```

Fix linting issues:

```bash
npm run lint:fix
```

### Type Checking

Run type checking:

```bash
npm run typecheck
```

## Project Structure

```
src/
├── api/              # API client configuration
├── components/       # React components
│   └── ui/          # UI component library
├── hooks/           # Custom React hooks
├── lib/             # Utilities and context providers
├── pages/           # Page components
└── utils/           # Helper functions
```

## Key Features

- **Responsive Components** - Works seamlessly across all device sizes
- **Form Validation** - Built-in validation with error handling
- **Performance Optimized** - Efficient code splitting and lazy loading
- **Type Safe** - JSConfig setup for better development experience

## Deployment

This application is deployed on **Netlify**. 

**Live URL**: https://happyrosedaybabbe.netlify.app/

### Deploy to Netlify

1. Push your code to GitHub
2. Connect your GitHub repository to Netlify
3. Netlify will auto-detect:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy automatically on push to main branch

## Build Notes

⚠️ **Note**: The current build has some chunks larger than 500kB. Consider:
- Using dynamic imports for code splitting
- Implementing route-based code splitting
- Optimizing bundle size with tree-shaking

## License

This project is private and proprietary.

## Support

For questions or issues, please create a GitHub issue or contact the project maintainer.

---

**Made with ❤️**
