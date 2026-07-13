import { Helmet } from 'react-helmet-async';
import { lazy, Suspense } from 'react';

// Lazy-load the dashboard (and its heavy chart/animation deps) so the initial
// HTML/JS payload stays small and the page paints sooner.
const Dashboard = lazy(() => import('@/components/Dashboard'));

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Market Visual Explainer | Content Analytics Dashboard</title>
        <meta
          name="description"
          content="An interactive content-analytics dashboard visualizing article engagement, audience, and traffic. Runs on live GA4/NewsAPI data when configured, sample data otherwise."
        />
        <meta name="keywords" content="content analytics, article performance, engagement metrics, audience insights, dashboard" />
        <link rel="canonical" href="/" />
      </Helmet>
      <Suspense
        fallback={
          <div className="grid min-h-screen place-items-center text-muted-foreground">
            Loading dashboard…
          </div>
        }
      >
        <Dashboard />
      </Suspense>
    </>
  );
};

export default Index;
