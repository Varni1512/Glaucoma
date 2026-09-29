/**
 * AI Assistant for Glaucoma Diagnosis Interpretation
 * Provides intelligent insights, percentage explanation, and Q&A
 */

export function generateAiSummary(result) {
  if (!result) return null;

  const isGlaucoma = result.isGlaucoma;
  const glaucProb = result.glaucomaProb;
  const healthyProb = result.healthyProb;

  let riskLevel = 'Low / Normal';
  let description = '';
  let recommendations = [];

  if (isGlaucoma) {
    if (glaucProb >= 75) {
      riskLevel = 'High Risk';
      description = `The model identified strong structural indicators of glaucomatous optic neuropathy with a high probability of ${glaucProb}%. This suggests notable cupping of the optic disc or thinning of the neuroretinal rim.`;
    } else {
      riskLevel = 'Borderline / Moderate Risk';
      description = `The prediction is slightly tilted towards Glaucoma (${glaucProb}% vs ${healthyProb}% Healthy). Because this is a borderline probability close to 50-60%, clinical confirmation is strongly recommended before reaching a definitive diagnosis.`;
    }
    recommendations = [
      'Goldmann Applanation Tonometry to check Intraocular Pressure (IOP).',
      'Optical Coherence Tomography (OCT) to measure RNFL thickness.',
      'Humphrey Visual Field (HVF 24-2) perimetry to detect blind spots.',
    ];
  } else {
    riskLevel = 'Low / Normal';
    description = `The retinal image shows healthy morphological characteristics with ${healthyProb}% probability. The cup-to-disc ratio appears within standard physiological limits.`;
    recommendations = [
      'Routine annual ophthalmic examination.',
      'Regular eye health monitoring if there is a family history of glaucoma.',
    ];
  }

  return {
    riskLevel,
    description,
    recommendations,
  };
}

export function answerAiQuestion(question, result) {
  const q = question.toLowerCase();
  const isGlaucoma = result?.isGlaucoma;
  const glaucProb = result?.glaucomaProb || 0;
  const healthyProb = result?.healthyProb || 0;

  if (q.includes('percentage') || q.includes('score') || q.includes('probability') || q.includes('matlab')) {
    if (isGlaucoma) {
      return `The model assigned a **${glaucProb}% probability for Glaucoma** and **${healthyProb}% for Healthy**. ` +
        (glaucProb < 65
          ? `Because the score is close to the 50% threshold, it indicates a borderline case where optic disc features share qualities of both healthy and early glaucomatous states.`
          : `This high percentage indicates clear visual patterns of optic nerve cupping.`);
    } else {
      return `The model calculated a **${healthyProb}% probability that the eye is Healthy**, with only ${glaucProb}% glaucoma risk. This points towards normal optic nerve morphology.`;
    }
  }

  if (q.includes('test') || q.includes('next') || q.includes('kya kare') || q.includes('doctor')) {
    return `Recommended next clinical evaluations:\n1. **OCT Scan (Optical Coherence Tomography):** Detailed cross-section of the retinal nerve fiber layer.\n2. **IOP Measurement (Tonometry):** Measures fluid pressure inside the eye (normal is 10–21 mmHg).\n3. **Visual Field Test (Perimetry):** Checks for peripheral vision loss.`;
  }

  if (q.includes('symptom') || q.includes('lakshan') || q.includes('signs')) {
    return `Glaucoma is often called the "silent thief of sight" because early stages typically have **no noticeable pain or symptoms**. Later symptoms include gradual loss of peripheral (side) vision, tunnel vision, or halos around lights in acute cases.`;
  }

  if (q.includes('cure') || q.includes('prevent') || q.includes('ilaj') || q.includes('treatment')) {
    return `While vision lost to glaucoma cannot be restored, further progression can be effectively prevented through **prescription eye drops, laser trabeculoplasty, or minimally invasive glaucoma surgery (MIGS)** to lower eye pressure.`;
  }

  // Default helpful response
  return `Based on this scan (${result?.prediction} with ${isGlaucoma ? glaucProb : healthyProb}% probability), we advise consulting a certified ophthalmologist. AI imaging models provide screening assistance and should always be paired with comprehensive clinical examination.`;
}
