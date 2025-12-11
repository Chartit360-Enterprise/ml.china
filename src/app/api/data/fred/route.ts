import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// FRED series IDs for China and global economic indicators
const CHINA_SERIES = {
  // China specific
  'CHNGDPNQDSMEI': 'China GDP (Quarterly)',
  'MANMM101CNM189S': 'China Manufacturing PMI',
  'CHNXTEXVA01NCMLM': 'China Exports',
  'CHNXTIMVA01NCMLM': 'China Imports',
  
  // Global context
  'DTWEXBGS': 'USD Trade Weighted Index',
  'DCOILWTICO': 'Crude Oil Price WTI',
  'GOLDAMGBD228NLBM': 'Gold Price',
  
  // US rates (impact China)
  'FEDFUNDS': 'Federal Funds Rate',
  'DGS10': '10-Year Treasury',
  
  // Inflation
  'CPIAUCSL': 'US CPI',
  'FPCPITOTLZGCHN': 'China CPI Inflation',
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const seriesId = searchParams.get('series');
  const limit = parseInt(searchParams.get('limit') || '24'); // Last 24 observations
  
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'FRED_API_KEY not configured' }, { status: 500 });
  }

  try {
    // If specific series requested
    if (seriesId) {
      const data = await fetchFredSeries(apiKey, seriesId, limit);
      return NextResponse.json({ success: true, series: { [seriesId]: data } });
    }

    // Fetch all relevant series
    const results: Record<string, unknown> = {};
    const errors: string[] = [];

    await Promise.all(
      Object.entries(CHINA_SERIES).map(async ([id, name]) => {
        try {
          const data = await fetchFredSeries(apiKey, id, limit);
          results[id] = { name, ...data };
        } catch (e) {
          errors.push(`${id}: ${(e as Error).message}`);
        }
      })
    );

    return NextResponse.json({
      success: true,
      fetched_at: new Date().toISOString(),
      series_count: Object.keys(results).length,
      series: results,
      errors: errors.length > 0 ? errors : undefined,
      api: 'fred',
    });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function fetchFredSeries(apiKey: string, seriesId: string, limit: number) {
  const url = new URL('https://api.stlouisfed.org/fred/series/observations');
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('series_id', seriesId);
  url.searchParams.set('file_type', 'json');
  url.searchParams.set('sort_order', 'desc');
  url.searchParams.set('limit', limit.toString());

  const res = await fetch(url.toString());
  const data = await res.json();

  if (data.error_code) {
    throw new Error(data.error_message || 'FRED API error');
  }

  const observations = (data.observations || []).map((obs: { date: string; value: string }) => ({
    date: obs.date,
    value: obs.value === '.' ? null : parseFloat(obs.value),
  }));

  // Get latest value
  const latest = observations.find((o: { value: number | null }) => o.value !== null);
  
  // Calculate recent change
  const recent = observations.filter((o: { value: number | null }) => o.value !== null).slice(0, 2);
  const change = recent.length === 2 ? recent[0].value - recent[1].value : null;
  const changePercent = recent.length === 2 && recent[1].value ? 
    ((recent[0].value - recent[1].value) / recent[1].value * 100) : null;

  return {
    latest_value: latest?.value,
    latest_date: latest?.date,
    change,
    change_percent: changePercent?.toFixed(2),
    observations: observations.slice(0, 12), // Last 12 for charts
    units: data.units || 'Value',
  };
}

