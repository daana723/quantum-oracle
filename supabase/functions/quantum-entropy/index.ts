import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

// Fetches raw random bytes from the ANU Quantum Random Number Generator.
// Runs server-side because ANU's endpoints block direct browser calls (CORS)
// and so an optional API key never touches frontend code.

const MAX_LENGTH = 1024;

async function fetchFromAnuKeyed(length: number, apiKey: string): Promise<number[] | null> {
  const url = `https://api.quantumnumbers.anu.edu.au?length=${length}&type=uint8`;
  const res = await fetch(url, { headers: { 'x-api-key': apiKey } });
  if (!res.ok) return null;
  const json = await res.json();
  if (!json?.success || !Array.isArray(json.data)) return null;
  return json.data as number[];
}

async function fetchFromAnuPublic(length: number): Promise<number[] | null> {
  const url = `https://qrng.anu.edu.au/API/jsonI.php?length=${length}&type=uint8`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const json = await res.json();
  if (!json?.success || !Array.isArray(json.data)) return null;
  return json.data as number[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const requested = Number(url.searchParams.get('length') ?? '512');
  const length = Number.isFinite(requested)
    ? Math.min(Math.max(Math.floor(requested), 1), MAX_LENGTH)
    : 512;

  const apiKey = Deno.env.get('ANU_QRNG_API_KEY');

  try {
    let data: number[] | null = null;

    if (apiKey) {
      try {
        data = await fetchFromAnuKeyed(length, apiKey);
      } catch (_e) {
        data = null;
      }
    }

    if (!data) {
      data = await fetchFromAnuPublic(length);
    }

    if (!data) {
      return new Response(
        JSON.stringify({ source: 'unavailable', data: [] }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({ source: 'anu-qrng', length: data.length, data }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      },
    );
  } catch (error) {
    console.error('quantum-entropy error:', error);
    return new Response(
      JSON.stringify({ source: 'unavailable', data: [] }),
      { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
