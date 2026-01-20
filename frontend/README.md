# Strategic Pyramid Builder - Frontend

Modern Next.js frontend for the Strategic Pyramid Builder application.

## Features

- **Modern UI**: Built with Next.js 15, React 19, and Tailwind CSS
- **Type-Safe**: Full TypeScript coverage with strict type checking
- **State Management**: Zustand for lightweight, performant state management
- **Interactive Forms**: Build all 9 tiers of the strategic pyramid
- **Real-time Validation**: Get instant feedback on pyramid completeness and quality
- **Multiple Export Formats**: Download as Word, PowerPoint, Markdown, or JSON
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Visualizations**: Plotly.js (React Plotly)

## Project Structure

```
frontend/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Home page (create/load pyramid)
│   ├── layout.tsx           # Root layout
│   ├── globals.css          # Global styles
│   ├── builder/             # Pyramid builder workspace
│   ├── validation/          # Validation results page
│   └── exports/             # Export options page
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   └── forms/               # Form components (future)
├── lib/                     # Utilities and libraries
│   ├── api-client.ts        # API client for backend communication
│   ├── store.ts             # Zustand state management
│   └── utils.ts             # Helper functions
├── types/                   # TypeScript type definitions
│   └── pyramid.ts           # Pyramid data models
└── public/                  # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Create a `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Development

### Adding New Features

1. **New Page**: Create a new folder in `app/` with a `page.tsx` file
2. **New Component**: Add to `components/` following the existing patterns
3. **New API Endpoint**: Extend `lib/api-client.ts`
4. **New Type**: Add to `types/pyramid.ts`

### Code Style

- Use TypeScript strict mode
- Follow React hooks best practices
- Use Tailwind utility classes for styling
- Keep components small and focused

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Set the root directory to `frontend`
4. Add environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL
5. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- **Netlify**: Set build command to `npm run build` and publish directory to `.next`
- **Railway**: Use the Next.js template
- **AWS Amplify**: Follow Next.js deployment guide

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000` or `https://api.yourdomain.com` |

## API Integration

The frontend communicates with the FastAPI backend through the `lib/api-client.ts` module. All API calls are centralized here for easy maintenance.

Example usage:

```typescript
import { pyramidApi } from "@/lib/api-client";

const pyramid = await pyramidApi.create({
  session_id: "...",
  project_name: "My Strategy",
  organization: "Acme Corp",
  created_by: "John Doe",
});
```

## State Management

The app uses Zustand for state management. The main store is in `lib/store.ts`:

```typescript
import { usePyramidStore } from "@/lib/store";

const { pyramid, setPyramid, sessionId } = usePyramidStore();
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Troubleshooting

### API Connection Issues

- Ensure the backend is running on the correct port
- Check CORS settings in the backend (`api/main.py`)
- Verify `NEXT_PUBLIC_API_URL` is set correctly

### Build Errors

- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npx tsc --noEmit`

## License

This project is part of the Strategic Pyramid Builder application.
