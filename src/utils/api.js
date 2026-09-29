/**
 * Glaucoma Eye Detection API Client
 * Primary: /api/predict (Proxied by Vite dev server locally & vercel.json in production)
 * Fallback: https://glaucoma-eye-detection.onrender.com/predict
 */

export const PROXY_API_URL = '/api/predict';
export const RENDER_API_URL = 'https://glaucoma-eye-detection.onrender.com/predict';

// Render free tier instances spin down after inactivity and take 30-60s to wake up
const REQUEST_TIMEOUT_MS = 90000; 

export async function predictGlaucoma(file) {
  const formData = new FormData();
  formData.append('file', file);

  // Strategy 1: Call /api/predict (Same-Origin Reverse Proxy via vercel.json & Vite)
  // This bypasses browser CORS restrictions entirely in both production and localhost!
  try {
    const proxyController = new AbortController();
    const proxyTimer = setTimeout(() => proxyController.abort(), REQUEST_TIMEOUT_MS);

    const proxyRes = await fetch(PROXY_API_URL, {
      method: 'POST',
      body: formData,
      signal: proxyController.signal,
    });

    clearTimeout(proxyTimer);

    if (proxyRes.ok) {
      const data = await proxyRes.json();
      return parseResponse(data);
    }

    // If 404, vercel.json might not have deployed yet, try direct URL
    if (proxyRes.status !== 404) {
      const errText = await proxyRes.text();
      handleServerError(proxyRes.status, errText);
    }
  } catch (proxyErr) {
    if (proxyErr.name === 'AbortError') {
      throw new Error(
        'Request timed out (90 seconds). Render server may still be spinning up from sleep mode. Please try again in 10-20 seconds.'
      );
    }
    if (proxyErr.message?.startsWith('Server Error') || proxyErr.message?.startsWith('Service Unavailable')) {
      throw proxyErr;
    }
    console.warn('Proxy fetch failed, attempting direct fetch...', proxyErr);
  }

  // Strategy 2: Direct call to Render backend
  const directController = new AbortController();
  const directTimer = setTimeout(() => directController.abort(), REQUEST_TIMEOUT_MS);

  try {
    const directRes = await fetch(RENDER_API_URL, {
      method: 'POST',
      body: formData,
      signal: directController.signal,
    });

    clearTimeout(directTimer);

    if (!directRes.ok) {
      const errText = await directRes.text();
      handleServerError(directRes.status, errText);
    }

    const data = await directRes.json();
    return parseResponse(data);
  } catch (directErr) {
    clearTimeout(directTimer);
    if (directErr.name === 'AbortError') {
      throw new Error(
        'Request timed out (90 seconds). Render server may still be spinning up. Please try once more.'
      );
    }
    if (directErr.message?.includes('Failed to fetch') || directErr.name === 'TypeError') {
      throw new Error(
        'CORS / Network Error: The Render backend blocked this origin or is unreachable. Please redeploy to Vercel with the updated vercel.json reverse proxy, or ask the backend developer to enable CORS on Render.'
      );
    }
    throw directErr;
  }
}

function handleServerError(statusCode, rawText) {
  if (statusCode === 502 || statusCode === 503) {
    throw new Error(
      `Service Unavailable (${statusCode}): The Render backend container is currently booting up. Please wait 15-30 seconds and retry.`
    );
  }
  if (statusCode === 500) {
    throw new Error(
      `Server Error (500): The model backend encountered an internal execution error while processing the image. Details: ${
        rawText || 'Internal Server Error'
      }`
    );
  }
  throw new Error(`API Error (${statusCode}): ${rawText || 'Unexpected response from server'}`);
}

function parseResponse(data) {
  const prediction = data.prediction || 'Unknown';
  const isGlaucoma = String(prediction).toLowerCase() === 'glaucoma';

  let glaucomaProb = 0;
  let healthyProb = 0;

  if (data.probabilities) {
    const g = data.probabilities.Glaucoma ?? data.probabilities.glaucoma ?? 0;
    const h = data.probabilities.Healthy ?? data.probabilities.healthy ?? 0;
    glaucomaProb = g <= 1 ? g * 100 : g;
    healthyProb = h <= 1 ? h * 100 : h;
  } else {
    glaucomaProb = isGlaucoma ? 90 : 10;
    healthyProb = 100 - glaucomaProb;
  }

  return {
    raw: data,
    prediction,
    isGlaucoma,
    glaucomaProb: Number(glaucomaProb.toFixed(2)),
    healthyProb: Number(healthyProb.toFixed(2)),
    timestamp: new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
  };
}
