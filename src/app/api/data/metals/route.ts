import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const apiKey = process.env.METAL_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'METAL_API_KEY not configured' }, { status: 500 });
  }

  try {
    // Metals API - get latest prices
    const url = new URL('https://api.metalpriceapi.com/v1/latest');
    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('base', 'USD');
    url.searchParams.set('currencies', 'XAU,XAG,XPT,XPD,XCU,ALU'); // Gold, Silver, Platinum, Palladium, Copper, Aluminum

    const res = await fetch(url.toString());
    const data = await res.json();

    if (!data.success) {
      return NextResponse.json({ error: data.error?.info || 'API error', details: data }, { status: 400 });
    }

    // Transform rates (they come as 1/price, need to invert for per-ounce)
    const metals = {
      gold: {
        symbol: 'XAU',
        name: 'Gold',
        price_per_oz: data.rates?.XAU ? (1 / data.rates.XAU) : null,
        unit: 'USD/oz',
      },
      silver: {
        symbol: 'XAG',
        name: 'Silver',
        price_per_oz: data.rates?.XAG ? (1 / data.rates.XAG) : null,
        unit: 'USD/oz',
      },
      platinum: {
        symbol: 'XPT',
        name: 'Platinum',
        price_per_oz: data.rates?.XPT ? (1 / data.rates.XPT) : null,
        unit: 'USD/oz',
      },
      palladium: {
        symbol: 'XPD',
        name: 'Palladium',
        price_per_oz: data.rates?.XPD ? (1 / data.rates.XPD) : null,
        unit: 'USD/oz',
      },
      copper: {
        symbol: 'XCU',
        name: 'Copper',
        price_per_lb: data.rates?.XCU ? (1 / data.rates.XCU) : null,
        unit: 'USD/lb',
      },
      aluminum: {
        symbol: 'ALU',
        name: 'Aluminum',
        price_per_ton: data.rates?.ALU ? (1 / data.rates.ALU) : null,
        unit: 'USD/ton',
      },
    };

    return NextResponse.json({
      success: true,
      timestamp: data.timestamp,
      date: new Date(data.timestamp * 1000).toISOString(),
      base: 'USD',
      metals,
      china_relevance: {
        copper: 'China consumes ~50% of global copper - key indicator',
        aluminum: 'China is largest aluminum producer and consumer',
        gold: 'PBOC gold reserves signal monetary policy stance',
      },
      api: 'metal_price_api',
    });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

