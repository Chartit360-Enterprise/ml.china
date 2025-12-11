import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') || 'China GDP economy';
  const days = parseInt(searchParams.get('days') || '14');
  
  const apiKey = process.env.WORLD_NEWS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'WORLD_NEWS_API_KEY not configured' }, { status: 500 });
  }

  try {
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const earliest = startDate.toISOString().split('T')[0];
    const latest = endDate.toISOString().split('T')[0];

    // World News API search
    const url = new URL('https://api.worldnewsapi.com/search-news');
    url.searchParams.set('api-key', apiKey);
    url.searchParams.set('text', query);
    url.searchParams.set('source-countries', 'cn,us,gb,hk,sg');
    url.searchParams.set('language', 'en');
    url.searchParams.set('earliest-publish-date', earliest);
    url.searchParams.set('latest-publish-date', latest);
    url.searchParams.set('number', '50');
    url.searchParams.set('sort', 'publish-time');
    url.searchParams.set('sort-direction', 'DESC');

    const res = await fetch(url.toString());
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.message || 'API error', details: data }, { status: res.status });
    }

    // Transform to our format
    const articles = (data.news || []).map((article: {
      title: string;
      text: string;
      url: string;
      publish_date: string;
      source_country: string;
      author: string;
      sentiment: number;
    }) => ({
      title: article.title,
      summary: article.text?.slice(0, 500) || '',
      url: article.url,
      published: article.publish_date,
      source: article.source_country,
      author: article.author,
      sentiment: article.sentiment,
    }));

    return NextResponse.json({
      success: true,
      query,
      date_range: { start: earliest, end: latest },
      count: articles.length,
      articles,
      api: 'world_news_api',
    });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

