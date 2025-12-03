# Content Analytics Dashboard

A comprehensive, real-time analytics dashboard for tracking content performance, audience engagement, and traffic insights. Built with modern web technologies to provide publishers and content creators with actionable insights into their content strategy.

## Features

### 📊 **Overview Dashboard**
- **Key Performance Indicators (KPIs)**: Track total page views, average time on page, engagement rate, and active users with period-over-period comparisons
- **Real-time Metrics**: Live updates every 3-5 seconds for up-to-the-minute analytics
- **Interactive Charts**: Visualize engagement trends and traffic sources with interactive data visualizations

### 🚦 **Traffic Analysis**
- **Traffic Sources Breakdown**: Analyze organic, social, direct, and referral traffic
- **Device Analytics**: Understand audience behavior across mobile, desktop, and tablet devices
- **Peak Times Heatmap**: Identify optimal content publishing times based on user activity patterns

### 📝 **Content Performance**
- **Top Articles Table**: Discover your best-performing content with detailed metrics
- **Category Analysis**: Compare performance across different content categories
- **Article Metrics**: Track page views, unique visitors, bounce rate, scroll depth, engagement rate, social shares, and comments

### 👥 **Audience Insights**
- **Geographic Distribution**: Visualize traffic by country with interactive maps
- **Cohort Retention Analysis**: Track user retention rates across different cohorts
- **Device Breakdown**: Understand how your audience accesses your content

### ⚡ **Engagement Metrics**
- **Live Activity Feed**: Monitor real-time user interactions including pageviews, clicks, scrolls, and shares
- **Engagement Trends**: Track engagement metrics over time with time-series visualizations
- **User Journey Tracking**: Understand how users navigate through your content

### 🎛️ **Advanced Filtering**
- **Date Range Selection**: Analyze performance over custom time periods (7d, 30d, 90d, or custom ranges)
- **Multi-dimensional Filters**: Filter by categories, authors, devices, and traffic sources
- **Responsive Sidebar**: Easy-to-use filter panel that adapts to mobile and desktop views

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Charts & Visualizations**: Recharts
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **Backend**: Supabase (for data persistence and real-time updates)
- **Form Handling**: React Hook Form with Zod validation
- **Date Utilities**: date-fns

## Prerequisites

- **Node.js** 18+ and npm (or use [nvm](https://github.com/nvm-sh/nvm) to manage Node versions)
- **Supabase Account** (for backend services)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ArivunidhiA/contentanalytics.git
   cd contentanalytics
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server with hot module replacement
- `npm run build` - Build the application for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
contentanalytics/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── dashboard/     # Dashboard-specific components
│   │   └── ui/            # Reusable UI components (shadcn/ui)
│   ├── data/              # Mock data and data utilities
│   ├── hooks/             # Custom React hooks
│   ├── integrations/      # Third-party service integrations
│   │   └── supabase/      # Supabase client and types
│   ├── lib/               # Utility functions
│   ├── pages/             # Page components
│   ├── types/             # TypeScript type definitions
│   └── main.tsx           # Application entry point
├── supabase/              # Supabase configuration and functions
│   └── functions/         # Edge functions for data fetching
└── package.json
```

## Dashboard Sections

The dashboard is organized into five main sections accessible via navigation tabs:

1. **Overview**: High-level KPIs and key metrics at a glance
2. **Traffic**: Detailed traffic source and device analysis
3. **Content**: Article performance and category insights
4. **Audience**: Geographic and demographic audience data
5. **Engagement**: User engagement patterns and live activity

## Key Components

- **KPICard**: Displays key metrics with trend indicators
- **EngagementChart**: Time-series visualization of engagement metrics
- **TrafficSourcesChart**: Breakdown of traffic by source
- **GeographicChart**: World map showing traffic by country
- **TopArticlesTable**: Sortable table of top-performing articles
- **LiveActivityFeed**: Real-time stream of user activities
- **CohortRetentionTable**: User retention analysis by cohort
- **PeakTimesHeatmap**: Visualization of peak activity times
- **FiltersSidebar**: Comprehensive filtering interface

## Development

### Adding New Metrics

1. Define types in `src/types/analytics.ts`
2. Update the data hook in `src/hooks/useAnalyticsData.ts`
3. Create or update the visualization component
4. Add to the appropriate dashboard section

### Customizing Styling

The project uses Tailwind CSS with custom configuration. Component styling follows the shadcn/ui pattern with CSS variables for theming. Modify `tailwind.config.ts` and `src/index.css` for global style changes.

## Deployment

Build the application for production:

```bash
npm run build
```

The `dist/` directory will contain the production-ready files that can be deployed to any static hosting service such as:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

Ensure your environment variables are properly configured in your hosting platform's settings.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase anon/public key | Yes |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and proprietary.

## Support

For questions or issues, please open an issue in the GitHub repository.

---

Built with ❤️ for content creators and publishers who need actionable insights.
