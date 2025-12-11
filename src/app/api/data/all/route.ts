import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const maxDuration = 30;

export async function GET(req: NextRequest) {
  const baseUrl = req.nextUrl.origin;
  const results: Record<string, unknown> = {};
  const errors: string[] = [];
  const startTime = Date.now();

  // Fetch all data sources in parallel
  const fetches = [
    // News
    fetch(`${baseUrl}/api/data/news?q=China+GDP+economy+growth&days=14`)
      .then(r => r.json())
      .then(data => { results.news = data; })
      .catch(e => errors.push(`news: ${e.message}`)),
    
    // FRED economic data
    fetch(`${baseUrl}/api/data/fred`)
      .then(r => r.json())
      .then(data => { results.fred = data; })
      .catch(e => errors.push(`fred: ${e.message}`)),
    
    // Metal prices
    fetch(`${baseUrl}/api/data/metals`)
      .then(r => r.json())
      .then(data => { results.metals = data; })
      .catch(e => errors.push(`metals: ${e.message}`)),
  ];

  await Promise.allSettled(fetches);

  // Create a summary for the AI
  const summary = createDataSummary(results);

  return NextResponse.json({
    success: true,
    fetched_at: new Date().toISOString(),
    fetch_time_ms: Date.now() - startTime,
    data: results,
    summary,
    errors: errors.length > 0 ? errors : undefined,
  });
}

function createDataSummary(data: Record<string, unknown>): string {
  const parts: string[] = [];
  const now = new Date();
  
  parts.push(`# Economic Data Summary`);
  parts.push(`Generated: ${now.toISOString()}`);
  parts.push('');

  // News summary
  const news = data.news as { count?: number; articles?: Array<{ title: string; published: string; summary: string }> } | undefined;
  if (news?.articles) {
    parts.push(`## Recent News (${news.count || 0} articles)`);
    news.articles.slice(0, 15).forEach((article, i) => {
      parts.push(`${i + 1}. **${article.title}** (${article.published || 'recent'})`);
      if (article.summary) {
        parts.push(`   ${article.summary.slice(0, 200)}...`);
      }
    });
    parts.push('');
  }

  // FRED data summary
  interface FredSeries {
    name: string;
    latest_value: number;
    latest_date: string;
    change_percent: string;
  }
  
  const fred = data.fred as { series?: Record<string, FredSeries> } | undefined;
  if (fred?.series) {
    parts.push(`## Economic Indicators (FRED)`);
    Object.entries(fred.series).forEach(([id, series]) => {
      if (series.latest_value !== null) {
        const change = series.change_percent ? ` (${parseFloat(series.change_percent) >= 0 ? '+' : ''}${series.change_percent}%)` : '';
        parts.push(`- **${series.name}**: ${series.latest_value}${change} (as of ${series.latest_date})`);
      }
    });
    parts.push('');
  }

  // Metals summary
  interface Metal {
    name: string;
    price_per_oz?: number;
    price_per_lb?: number;
    price_per_ton?: number;
    unit: string;
  }
  
  const metals = data.metals as { metals?: Record<string, Metal>; date?: string } | undefined;
  if (metals?.metals) {
    parts.push(`## Commodity Prices`);
    Object.values(metals.metals).forEach((metal) => {
      const price = metal.price_per_oz || metal.price_per_lb || metal.price_per_ton;
      if (price) {
        parts.push(`- **${metal.name}**: $${price.toFixed(2)} ${metal.unit}`);
      }
    });
    parts.push(`(as of ${metals.date || 'today'})`);
    parts.push('');
  }

  return parts.join('\n');
}

