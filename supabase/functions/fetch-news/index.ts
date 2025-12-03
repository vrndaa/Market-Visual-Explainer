import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const newsApiKey = Deno.env.get('NEWS_API_KEY');
    if (!newsApiKey) {
      throw new Error('NEWS_API_KEY not configured');
    }

    const { query = 'technology', pageSize = 20 } = await req.json().catch(() => ({}));

    console.log(`Fetching news for query: ${query}, pageSize: ${pageSize}`);

    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=${pageSize}&sortBy=publishedAt&language=en`,
      {
        headers: {
          'X-Api-Key': newsApiKey,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('News API error:', errorText);
      throw new Error(`News API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Fetched ${data.articles?.length || 0} articles`);

    // Transform articles to match our Article type
    const articles = (data.articles || []).map((article: any, index: number) => ({
      id: `news-${index}-${Date.now()}`,
      title: article.title || 'Untitled',
      author: article.author || 'Unknown Author',
      category: categorizeArticle(article.title, article.description),
      publishDate: article.publishedAt || new Date().toISOString(),
      url: article.url,
      thumbnail: article.urlToImage || 'https://via.placeholder.com/300x200',
      metrics: {
        pageViews: Math.floor(Math.random() * 50000) + 1000,
        uniqueVisitors: Math.floor(Math.random() * 30000) + 500,
        avgTimeOnPage: Math.floor(Math.random() * 300) + 60,
        bounceRate: Math.random() * 0.4 + 0.3,
        scrollDepth: Math.random() * 0.3 + 0.6,
        engagementRate: Math.random() * 0.4 + 0.4,
        socialShares: Math.floor(Math.random() * 500),
        comments: Math.floor(Math.random() * 100),
      },
      trafficSources: {
        organic: Math.random() * 0.4 + 0.2,
        social: Math.random() * 0.3 + 0.1,
        direct: Math.random() * 0.2 + 0.1,
        referral: Math.random() * 0.15 + 0.05,
      },
    }));

    return new Response(JSON.stringify({ articles, totalResults: data.totalResults }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error in fetch-news function:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function categorizeArticle(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes('tech') || text.includes('software') || text.includes('ai') || text.includes('digital')) return 'Technology';
  if (text.includes('business') || text.includes('market') || text.includes('economy')) return 'Business';
  if (text.includes('sport') || text.includes('game') || text.includes('team')) return 'Sports';
  if (text.includes('health') || text.includes('medical') || text.includes('covid')) return 'Health';
  if (text.includes('politic') || text.includes('government') || text.includes('election')) return 'Politics';
  if (text.includes('entertainment') || text.includes('movie') || text.includes('music')) return 'Entertainment';
  return 'General';
}
