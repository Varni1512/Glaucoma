export const RENDER_API_URL = 'https://glaucoma-eye-detection.onrender.com/predict';
export const PROXY_API_URL = '/api/predict';

const REQUEST_TIMEOUT_MS = 90000; 

export async function predictGlaucoma(file) {
  const formData = new FormData();
  formData.append('file', file);

  // Attempt direct call first
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const res = await fetch(RENDER_API_URL, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      return parseResponse(data);
    }

    if (res.status >= 500) {
      const text = await res.text();
      handleServerError(res.status, text);
    }
  } catch (directErr) {
    if (directErr.name === 'AbortError') {
      throw new Error(
        'Request timed out (90 seconds). Render server may still be spinning up from sleep mode. Please try again in 10-20 seconds.'
      );
    }
    if (directErr.message?.startsWith('Server Error')) {
      throw directErr;
    }
    // Fall back to local proxy if direct call was blocked by CORS
    console.warn('Direct fetch error, attempting local proxy fallback...', directErr);
  }

  // Fallback to local Vite proxy (/api/predict)
  const proxyController = new AbortController();
  const proxyTimer = setTimeout(() => proxyController.abort(), REQUEST_TIMEOUT_MS);

  try {
    const proxyRes = await fetch(PROXY_API_URL, {
      method: 'POST',
      body: formData,
      signal: proxyController.signal,
    });

    clearTimeout(proxyTimer);

    if (!proxyRes.ok) {
      const errText = await proxyRes.text();
      handleServerError(proxyRes.status, errText);
    }

    const data = await proxyRes.json();
    return parseResponse(data);
  } catch (proxyErr) {
    clearTimeout(proxyTimer);
    if (proxyErr.name === 'AbortError') {
      throw new Error(
        'Request timed out (90 seconds). Render free tier server may still be spinning up. Please try once more.'
      );
    }
    throw proxyErr;
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
