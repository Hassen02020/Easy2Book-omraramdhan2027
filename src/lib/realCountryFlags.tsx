import React from 'react';

export type CountryFlagCode =
  | 'TN'
  | 'EG'
  | 'RW'
  | 'TZ'
  | 'CM'
  | 'QA'
  | 'BH'
  | 'VN'
  | 'UZ'
  | 'AL'
  | 'CO'
  | 'BS';

export interface CountryFlagMeta {
  code: CountryFlagCode;
  nameFr: string;
  nameAr: string;
}

export const EVISA_FLAG_CATALOG: Record<CountryFlagCode, CountryFlagMeta> = {
  TN: { code: 'TN', nameFr: 'Tunisie', nameAr: 'تونس' },
  EG: { code: 'EG', nameFr: 'Égypte', nameAr: 'مصر' },
  RW: { code: 'RW', nameFr: 'Rwanda', nameAr: 'رواندا' },
  TZ: { code: 'TZ', nameFr: 'Tanzanie', nameAr: 'تنزانيا' },
  CM: { code: 'CM', nameFr: 'Cameroun', nameAr: 'الكاميرون' },
  QA: { code: 'QA', nameFr: 'Qatar', nameAr: 'قطر' },
  BH: { code: 'BH', nameFr: 'Bahreïn', nameAr: 'البحرين' },
  VN: { code: 'VN', nameFr: 'Vietnam', nameAr: 'فيتنام' },
  UZ: { code: 'UZ', nameFr: 'Ouzbékistan', nameAr: 'أوزبكستان' },
  AL: { code: 'AL', nameFr: 'Albanie', nameAr: 'ألبانيا' },
  CO: { code: 'CO', nameFr: 'Colombie', nameAr: 'كولومبيا' },
  BS: { code: 'BS', nameFr: 'Bahamas', nameAr: 'البهاماس' },
};

function starPathSvg(cx: number, cy: number, outerR: number, innerR: number, rotDeg = -90): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const rad = ((rotDeg + i * 36) * Math.PI) / 180;
    pts.push(`${(cx + r * Math.cos(rad)).toFixed(2)},${(cy + r * Math.sin(rad)).toFixed(2)}`);
  }
  return `M${pts.join('L')}Z`;
}

function drawFivePointStarCanvas(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  rotDeg = -90
) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const rad = ((rotDeg + i * 36) * Math.PI) / 180;
    const px = cx + r * Math.cos(rad);
    const py = cy + r * Math.sin(rad);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function buildSerratedPolygonPoints(
  xStart: number,
  xTip: number,
  height: number,
  teeth: number
): string {
  const step = height / (teeth * 2);
  const pts: string[] = ['0,0', `${xStart},0`];
  for (let i = 0; i < teeth; i++) {
    pts.push(`${xTip},${((i * 2 + 1) * step).toFixed(2)}`);
    pts.push(`${xStart},${((i * 2 + 2) * step).toFixed(2)}`);
  }
  pts.push(`0,${height}`);
  return pts.join(' ');
}

export function RealFlagSvg({
  code,
  className = 'h-4 w-6 rounded-[2px] shadow-xs',
}: {
  code: CountryFlagCode;
  className?: string;
}) {
  const label = EVISA_FLAG_CATALOG[code]?.nameFr ?? code;

  switch (code) {
    case 'TN':
      return (
        <svg viewBox="0 0 60 40" className={className} role="img" aria-label={label}>
          <rect width="60" height="40" fill="#E70013" />
          <circle cx="30" cy="20" r="10" fill="#FFFFFF" />
          <circle cx="30" cy="20" r="7.5" fill="#E70013" />
          <circle cx="32.2" cy="20" r="6" fill="#FFFFFF" />
          <path d={starPathSvg(32.5, 20, 4.1, 1.6, -18)} fill="#E70013" />
        </svg>
      );

    case 'EG':
      return (
        <svg viewBox="0 0 60 40" className={className} role="img" aria-label={label}>
          <rect width="60" height="13.34" y="0" fill="#CE1126" />
          <rect width="60" height="13.34" y="13.33" fill="#FFFFFF" />
          <rect width="60" height="13.34" y="26.66" fill="#000000" />
          {/* Golden Eagle of Saladin emblem */}
          <path
            d="M30 15.2 L28.2 16.5 L26.2 16.4 L26.9 21.8 L28.4 23.6 L30 24.7 L31.6 23.6 L33.1 21.8 L33.8 16.4 L31.8 16.5 Z"
            fill="#C09300"
          />
          <rect x="29.1" y="17.8" width="1.8" height="4.2" fill="#FFFFFF" />
        </svg>
      );

    case 'RW':
      return (
        <svg viewBox="0 0 60 40" className={className} role="img" aria-label={label}>
          <rect width="60" height="20" y="0" fill="#00A1DE" />
          <rect width="60" height="10" y="20" fill="#FAD201" />
          <rect width="60" height="10" y="30" fill="#20603D" />
          <circle cx="48" cy="10" r="4.6" fill="#E5BE01" />
          <circle cx="48" cy="10" r="3" fill="#00A1DE" />
          <circle cx="48" cy="10" r="2.2" fill="#E5BE01" />
        </svg>
      );

    case 'TZ':
      return (
        <svg viewBox="0 0 60 40" className={className} role="img" aria-label={label}>
          <polygon points="0,0 60,0 0,40" fill="#1EB53A" />
          <polygon points="60,0 60,40 0,40" fill="#00A3DD" />
          <line x1="0" y1="40" x2="60" y2="0" stroke="#FCD116" strokeWidth="13.5" />
          <line x1="0" y1="40" x2="60" y2="0" stroke="#000000" strokeWidth="9" />
        </svg>
      );

    case 'CM':
      return (
        <svg viewBox="0 0 60 40" className={className} role="img" aria-label={label}>
          <rect width="20" height="40" x="0" fill="#007A5E" />
          <rect width="20" height="40" x="20" fill="#CE1126" />
          <rect width="20" height="40" x="40" fill="#FCD116" />
          <path d={starPathSvg(30, 20, 5.5, 2.2)} fill="#FCD116" />
        </svg>
      );

    case 'QA':
      return (
        <svg viewBox="0 0 60 40" className={className} role="img" aria-label={label}>
          <rect width="60" height="40" fill="#8A1538" />
          <polygon points={buildSerratedPolygonPoints(16, 23, 40, 9)} fill="#FFFFFF" />
        </svg>
      );

    case 'BH':
      return (
        <svg viewBox="0 0 60 40" className={className} role="img" aria-label={label}>
          <rect width="60" height="40" fill="#CE1126" />
          <polygon points={buildSerratedPolygonPoints(15, 24, 40, 5)} fill="#FFFFFF" />
        </svg>
      );

    case 'VN':
      return (
        <svg viewBox="0 0 60 40" className={className} role="img" aria-label={label}>
          <rect width="60" height="40" fill="#DA251D" />
          <path d={starPathSvg(30, 20, 10.5, 4.1)} fill="#FFFF00" />
        </svg>
      );

    case 'UZ':
      return (
        <svg viewBox="0 0 60 40" className={className} role="img" aria-label={label}>
          <rect width="60" height="12.8" y="0" fill="#0099B5" />
          <rect width="60" height="1.2" y="12.8" fill="#CE1126" />
          <rect width="60" height="12" y="14" fill="#FFFFFF" />
          <rect width="60" height="1.2" y="26" fill="#CE1126" />
          <rect width="60" height="12.8" y="27.2" fill="#1EB53A" />
          <circle cx="9.2" cy="6.4" r="4.2" fill="#FFFFFF" />
          <circle cx="10.8" cy="6.4" r="3.6" fill="#0099B5" />
          {[
            [17, 3.6], [20.5, 3.6], [24, 3.6],
            [15.2, 6.4], [18.7, 6.4], [22.2, 6.4], [25.7, 6.4],
            [13.5, 9.2], [17, 9.2], [20.5, 9.2], [24, 9.2], [27.5, 9.2],
          ].map(([cx, cy], idx) => (
            <circle key={idx} cx={cx} cy={cy} r="0.85" fill="#FFFFFF" />
          ))}
        </svg>
      );

    case 'AL':
      return (
        <svg viewBox="0 0 60 40" className={className} role="img" aria-label={label}>
          <rect width="60" height="40" fill="#E41E20" />
          {/* Authentic stylized black double-headed Albanian eagle */}
          <path
            d="M30 12.2 C28.2 10.2 25.5 9.8 24.4 11.4 C25.6 11.8 26.8 12.5 27.6 14 L22.2 12.5 C19.5 14 19 17.4 20.5 20.4 L24.2 19.6 L21.4 23.4 C23.5 24.8 26 24.5 27.8 23 L26.2 28.4 L28.5 27 L30 30.8 L31.5 27 L33.8 28.4 L32.2 23 C34 24.5 36.5 24.8 38.6 23.4 L35.8 19.6 L39.5 20.4 C41 17.4 40.5 14 37.8 12.5 L32.4 14 C33.2 12.5 34.4 11.8 35.6 11.4 C34.5 9.8 31.8 10.2 30 12.2 Z"
            fill="#111111"
          />
        </svg>
      );

    case 'CO':
      return (
        <svg viewBox="0 0 60 40" className={className} role="img" aria-label={label}>
          <rect width="60" height="20" y="0" fill="#FCD116" />
          <rect width="60" height="10" y="20" fill="#003893" />
          <rect width="60" height="10" y="30" fill="#CE1126" />
        </svg>
      );

    case 'BS':
      return (
        <svg viewBox="0 0 60 40" className={className} role="img" aria-label={label}>
          <rect width="60" height="13.33" y="0" fill="#00778B" />
          <rect width="60" height="13.34" y="13.33" fill="#FFC72C" />
          <rect width="60" height="13.33" y="26.67" fill="#00778B" />
          <polygon points="0,0 26,20 0,40" fill="#000000" />
        </svg>
      );
  }
}

/**
 * Draws an authentic, sharp vector national flag onto a Canvas 2D context
 * for burned-in MP4/WebM video overlays (zero emoji-font fallback issues).
 */
export function drawRealFlagCanvas(
  ctx: CanvasRenderingContext2D,
  code: CountryFlagCode,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.save();
  ctx.beginPath();
  const r = Math.min(4, h * 0.14);
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.clip();

  const sx = w / 60;
  const sy = h / 40;
  ctx.translate(x, y);
  ctx.scale(sx, sy);

  switch (code) {
    case 'TN': {
      ctx.fillStyle = '#E70013';
      ctx.fillRect(0, 0, 60, 40);
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(30, 20, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#E70013';
      ctx.beginPath();
      ctx.arc(30, 20, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(32.2, 20, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#E70013';
      drawFivePointStarCanvas(ctx, 32.5, 20, 4.1, 1.6, -18);
      break;
    }

    case 'EG': {
      ctx.fillStyle = '#CE1126';
      ctx.fillRect(0, 0, 60, 13.34);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 13.33, 60, 13.34);
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 26.66, 60, 13.34);
      ctx.fillStyle = '#C09300';
      ctx.beginPath();
      ctx.moveTo(30, 15.2);
      ctx.lineTo(28.2, 16.5);
      ctx.lineTo(26.2, 16.4);
      ctx.lineTo(26.9, 21.8);
      ctx.lineTo(28.4, 23.6);
      ctx.lineTo(30, 24.7);
      ctx.lineTo(31.6, 23.6);
      ctx.lineTo(33.1, 21.8);
      ctx.lineTo(33.8, 16.4);
      ctx.lineTo(31.8, 16.5);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(29.1, 17.8, 1.8, 4.2);
      break;
    }

    case 'RW': {
      ctx.fillStyle = '#00A1DE';
      ctx.fillRect(0, 0, 60, 20);
      ctx.fillStyle = '#FAD201';
      ctx.fillRect(0, 20, 60, 10);
      ctx.fillStyle = '#20603D';
      ctx.fillRect(0, 30, 60, 10);
      ctx.fillStyle = '#E5BE01';
      ctx.beginPath();
      ctx.arc(48, 10, 4.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#00A1DE';
      ctx.beginPath();
      ctx.arc(48, 10, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#E5BE01';
      ctx.beginPath();
      ctx.arc(48, 10, 2.2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'TZ': {
      ctx.fillStyle = '#1EB53A';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(60, 0);
      ctx.lineTo(0, 40);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#00A3DD';
      ctx.beginPath();
      ctx.moveTo(60, 0);
      ctx.lineTo(60, 40);
      ctx.lineTo(0, 40);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#FCD116';
      ctx.lineWidth = 13.5;
      ctx.beginPath();
      ctx.moveTo(0, 40);
      ctx.lineTo(60, 0);
      ctx.stroke();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.moveTo(0, 40);
      ctx.lineTo(60, 0);
      ctx.stroke();
      break;
    }

    case 'CM': {
      ctx.fillStyle = '#007A5E';
      ctx.fillRect(0, 0, 20, 40);
      ctx.fillStyle = '#CE1126';
      ctx.fillRect(20, 0, 20, 40);
      ctx.fillStyle = '#FCD116';
      ctx.fillRect(40, 0, 20, 40);
      ctx.fillStyle = '#FCD116';
      drawFivePointStarCanvas(ctx, 30, 20, 5.5, 2.2);
      break;
    }

    case 'QA': {
      ctx.fillStyle = '#8A1538';
      ctx.fillRect(0, 0, 60, 40);
      ctx.fillStyle = '#FFFFFF';
      const step = 40 / 18;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(16, 0);
      for (let i = 0; i < 9; i++) {
        ctx.lineTo(23, (i * 2 + 1) * step);
        ctx.lineTo(16, (i * 2 + 2) * step);
      }
      ctx.lineTo(0, 40);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'BH': {
      ctx.fillStyle = '#CE1126';
      ctx.fillRect(0, 0, 60, 40);
      ctx.fillStyle = '#FFFFFF';
      const step = 40 / 10;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(15, 0);
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(24, (i * 2 + 1) * step);
        ctx.lineTo(15, (i * 2 + 2) * step);
      }
      ctx.lineTo(0, 40);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'VN': {
      ctx.fillStyle = '#DA251D';
      ctx.fillRect(0, 0, 60, 40);
      ctx.fillStyle = '#FFFF00';
      drawFivePointStarCanvas(ctx, 30, 20, 10.5, 4.1);
      break;
    }

    case 'UZ': {
      ctx.fillStyle = '#0099B5';
      ctx.fillRect(0, 0, 60, 12.8);
      ctx.fillStyle = '#CE1126';
      ctx.fillRect(0, 12.8, 60, 1.2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 14, 60, 12);
      ctx.fillStyle = '#CE1126';
      ctx.fillRect(0, 26, 60, 1.2);
      ctx.fillStyle = '#1EB53A';
      ctx.fillRect(0, 27.2, 60, 12.8);
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(9.2, 6.4, 4.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0099B5';
      ctx.beginPath();
      ctx.arc(10.8, 6.4, 3.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      const dots = [
        [17, 3.6], [20.5, 3.6], [24, 3.6],
        [15.2, 6.4], [18.7, 6.4], [22.2, 6.4], [25.7, 6.4],
        [13.5, 9.2], [17, 9.2], [20.5, 9.2], [24, 9.2], [27.5, 9.2],
      ];
      for (const [dx, dy] of dots) {
        ctx.beginPath();
        ctx.arc(dx, dy, 0.9, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'AL': {
      ctx.fillStyle = '#E41E20';
      ctx.fillRect(0, 0, 60, 40);
      ctx.fillStyle = '#111111';
      const p = new Path2D(
        'M30 12.2 C28.2 10.2 25.5 9.8 24.4 11.4 C25.6 11.8 26.8 12.5 27.6 14 L22.2 12.5 C19.5 14 19 17.4 20.5 20.4 L24.2 19.6 L21.4 23.4 C23.5 24.8 26 24.5 27.8 23 L26.2 28.4 L28.5 27 L30 30.8 L31.5 27 L33.8 28.4 L32.2 23 C34 24.5 36.5 24.8 38.6 23.4 L35.8 19.6 L39.5 20.4 C41 17.4 40.5 14 37.8 12.5 L32.4 14 C33.2 12.5 34.4 11.8 35.6 11.4 C34.5 9.8 31.8 10.2 30 12.2 Z'
      );
      ctx.fill(p);
      break;
    }

    case 'CO': {
      ctx.fillStyle = '#FCD116';
      ctx.fillRect(0, 0, 60, 20);
      ctx.fillStyle = '#003893';
      ctx.fillRect(0, 20, 60, 10);
      ctx.fillStyle = '#CE1126';
      ctx.fillRect(0, 30, 60, 10);
      break;
    }

    case 'BS': {
      ctx.fillStyle = '#00778B';
      ctx.fillRect(0, 0, 60, 13.34);
      ctx.fillStyle = '#FFC72C';
      ctx.fillRect(0, 13.34, 60, 13.34);
      ctx.fillStyle = '#00778B';
      ctx.fillRect(0, 26.68, 60, 13.34);
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(26, 20);
      ctx.lineTo(0, 40);
      ctx.closePath();
      ctx.fill();
      break;
    }
  }

  ctx.restore();

  // Crisp subtle border around flag
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  ctx.restore();
}
