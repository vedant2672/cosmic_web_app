const API_BASE = "https://api.nasa.gov";
const NEO_FEED = "/neo/rest/v1/feed";

const API_KEY = import.meta.env.VITE_NASA_API_KEY || "DEMO_KEY";
if (API_KEY === "DEMO_KEY") {
  // Helpful hint in devtools if env var isn't wired in deployed builds
  // Note: NASA requires API key via query param; it's public by design.
  console.warn(
    "NASA API: Using DEMO_KEY. Set VITE_NASA_API_KEY in your environment (Vercel > Settings > Environment Variables) and redeploy."
  );
}

// Simple in-memory cache with TTL to reduce rate-limit issues and duplicate calls
const _cache = new Map(); // key: url -> { expiresAt: number, data: any }

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function httpGet(url, { cacheTtlMs = 5 * 60 * 1000 } = {}) {
  const now = Date.now();
  const cached = _cache.get(url);
  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  let attempt = 0;
  const maxAttempts = 3;
  const baseDelay = 1000;

  while (true) {
    const res = await fetch(url);
    if (res.status === 429) {
      attempt += 1;
      if (attempt >= maxAttempts) {
        // Friendlier 429 message
        throw new Error(
          "NASA API rate limit exceeded. Add your personal API key to .env (VITE_NASA_API_KEY) and retry, or wait a minute."
        );
      }
      // exponential backoff
      await sleep(baseDelay * 2 ** (attempt - 1));
      continue;
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`NASA API error ${res.status}: ${text}`);
    }
    const data = await res.json();
    _cache.set(url, { data, expiresAt: now + cacheTtlMs });
    return data;
  }
}

function fmt(d) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export async function fetchNeoFeed({ startDate, endDate }) {
  const start = typeof startDate === "string" ? startDate : fmt(startDate);
  const end = typeof endDate === "string" ? endDate : fmt(endDate);
  const url = `${API_BASE}${NEO_FEED}?start_date=${start}&end_date=${end}&api_key=${API_KEY}`;

  return httpGet(url);
}

export async function fetchNeoDetails(neoId) {
  const id = encodeURIComponent(neoId);
  const url = `${API_BASE}/neo/rest/v1/neo/${id}?api_key=${API_KEY}`;
  return httpGet(url);
}

export function flattenNeoFeed(feed) {
  // feed.near_earth_objects is an object keyed by date -> array
  const dates = Object.keys(feed.near_earth_objects || {}).sort();
  const list = [];
  for (const date of dates) {
    const arr = feed.near_earth_objects[date] || [];
    for (const neo of arr) {
      list.push({ date, ...neo });
    }
  }
  return list;
}

export function averageKmDiameter(neo) {
  const km = neo?.estimated_diameter?.kilometers;
  if (!km) return null;
  const min = km.estimated_diameter_min;
  const max = km.estimated_diameter_max;
  if (typeof min !== "number" || typeof max !== "number") return null;
  return (min + max) / 2;
}

export function closestApproach(neo) {
  const cad = neo?.close_approach_data?.[0];
  if (!cad) return null;
  return {
    datetime:
      cad.close_approach_date_full || `${cad.close_approach_date} 00:00`,
    missDistanceKm: Number(cad.miss_distance?.kilometers ?? NaN),
    relativeVelocityKps: Number(
      cad.relative_velocity?.kilometers_per_second ?? NaN
    ),
    orbitingBody: cad.orbiting_body,
  };
}
