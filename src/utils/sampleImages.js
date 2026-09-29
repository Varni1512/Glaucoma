/**
 * Sample Retinal Fundus Image Generator for instant one-click testing
 */

export function generateFundusImageBlob(type = 'healthy') {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 448;
    canvas.height = 448;
    const ctx = canvas.getContext('2d');

    // Solid dark slate outer frame
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 448, 448);

    // Retinal circular boundary
    ctx.save();
    ctx.beginPath();
    ctx.arc(224, 224, 210, 0, Math.PI * 2);
    ctx.clip();

    // English/retinal solid flat tone base
    const isGlaucoma = type === 'glaucoma';
    ctx.fillStyle = isGlaucoma ? '#7a2e1d' : '#8c3523';
    ctx.fillRect(0, 0, 448, 448);

    // Retinal background tint
    ctx.fillStyle = '#652517';
    ctx.beginPath();
    ctx.arc(224, 224, 180, 0, Math.PI * 2);
    ctx.fill();

    // Macula / Fovea (darker temporal region)
    ctx.fillStyle = '#48190e';
    ctx.beginPath();
    ctx.arc(150, 230, 28, 0, Math.PI * 2);
    ctx.fill();

    // Optic Disc (Nasal side bright region)
    const discX = 290;
    const discY = 220;
    const discR = 48;
    ctx.fillStyle = '#e8a860';
    ctx.beginPath();
    ctx.arc(discX, discY, discR, 0, Math.PI * 2);
    ctx.fill();

    // Optic Cup
    // Healthy: small cup (CDR ~ 0.3)
    // Glaucoma: enlarged deep cup (CDR ~ 0.7 - 0.8)
    const cupR = isGlaucoma ? 36 : 16;
    ctx.fillStyle = '#fce5b2';
    ctx.beginPath();
    ctx.arc(discX + (isGlaucoma ? 3 : 0), discY, cupR, 0, Math.PI * 2);
    ctx.fill();

    // Retinal Vessels (solid dark crimson lines radiating from disc)
    ctx.strokeStyle = '#3e130a';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Superior arcade
    ctx.beginPath();
    ctx.moveTo(discX, discY);
    ctx.bezierCurveTo(discX - 40, discY - 80, discX - 100, discY - 140, 140, 80);
    ctx.stroke();

    // Inferior arcade
    ctx.beginPath();
    ctx.moveTo(discX, discY);
    ctx.bezierCurveTo(discX - 40, discY + 80, discX - 110, discY + 130, 130, 360);
    ctx.stroke();

    // Nasal branches
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(discX, discY);
    ctx.bezierCurveTo(discX + 50, discY - 50, discX + 80, discY - 90, 400, 110);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(discX, discY);
    ctx.bezierCurveTo(discX + 60, discY + 60, discX + 80, discY + 100, 390, 340);
    ctx.stroke();

    // Extra secondary branches
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(250, 140);
    ctx.lineTo(210, 100);
    ctx.moveTo(240, 290);
    ctx.lineTo(190, 330);
    ctx.stroke();

    ctx.restore();

    canvas.toBlob(
      (blob) => {
        const fileName = isGlaucoma ? 'sample_glaucoma_fundus.png' : 'sample_healthy_fundus.png';
        const file = new File([blob], fileName, { type: 'image/png' });
        const dataUrl = canvas.toDataURL('image/png');
        resolve({ file, dataUrl, name: fileName });
      },
      'image/png',
      0.95
    );
  });
}

export const SAMPLE_CASES = [
  {
    id: 'healthy_sample',
    title: 'Healthy Retinal Fundus',
    description: 'Normal Cup-to-Disc ratio (CDR ~0.3), healthy pink neuroretinal rim.',
    expectedLabel: 'Healthy',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    type: 'healthy',
  },
  {
    id: 'glaucoma_sample',
    title: 'Glaucoma Positive Scan',
    description: 'Marked optic disc cupping (CDR >0.7), neuroretinal rim thinning.',
    expectedLabel: 'Glaucoma',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    type: 'glaucoma',
  },
];
