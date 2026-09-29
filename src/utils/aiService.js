/**
 * AI Clinical Details Service
 * Direct Live Inference via Groq API
 * Model: openai/gpt-oss-120b
 */

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL_NAME = 'openai/gpt-oss-120b';

/**
 * Fetch live clinical analysis from openai/gpt-oss-120b using the API key in .env
 */
export async function getAiClinicalDetails(result) {
  const apiKey = import.meta.env.VITE_AI_API_KEY;

  if (!apiKey) {
    throw new Error('VITE_AI_API_KEY is missing from .env file.');
  }

  const prompt = `The retinal fundus image classification result is:
Prediction: ${result.prediction}
Glaucoma Probability: ${result.glaucomaProb}%
Healthy Probability: ${result.healthyProb}%

Provide a formal clinical assessment structured as valid JSON with the following exact keys:
{
  "condition": "${result.prediction}",
  "isGlaucoma": ${result.isGlaucoma},
  "stage": "Clinical stage (e.g., 'Early (Stage I)', 'Moderate (Stage II)', 'Advanced (Stage III)', or 'Physiological Normal' if healthy)",
  "stageDescription": "1-2 concise medical sentences describing optic cup-to-disc ratio and retinal nerve fiber layer (RNFL) condition based on the probabilities.",
  "medications": [
    {
      "name": "Medication name and class (e.g., Latanoprost 0.005% or Timolol 0.5% for glaucoma, or preservative-free lubricant if healthy)",
      "dosage": "Specific dosage instructions",
      "purpose": "Clinical mechanism of action and reason for prescription"
    }
  ],
  "clinicalActions": [
    "Specific clinical procedure or test needed (e.g., Applanation Tonometry, OCT RNFL scan, Humphrey Visual Field)",
    "Next clinical step"
  ],
  "lifestyleGuidance": [
    "Important precaution or daily care guideline"
  ]
}`;

  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          {
            role: 'system',
            content: 'You are a clinical ophthalmology AI assistant. Output ONLY a valid JSON object matching the requested schema without markdown backticks.',
          },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`AI API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No response content returned from AI model.');
    }

    // Clean potential markdown wrap if any
    let cleaned = content.trim();
    if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
    else if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();

    const parsed = JSON.parse(cleaned);

    const isGlauc = result.isGlaucoma;
    return {
      ...parsed,
      model: MODEL_NAME,
      stageBadge: isGlauc
        ? 'bg-[#fcf1f0] text-[#8c352f] border-[#f4d4d2]'
        : 'bg-[#edf4ee] text-[#2d5c3d] border-[#d4e2d7]',
    };
  } catch (err) {
    console.error('Failed to get response from openai/gpt-oss-120b:', err);
    throw err;
  }
}
