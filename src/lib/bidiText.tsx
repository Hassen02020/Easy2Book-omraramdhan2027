import type { ReactNode } from 'react';

const BIDI_TOKEN_REGEX =
  /((?:\+?\d{1,3}[\s-])?\d{2}[\s-]\d{3}[\s-]\d{3}|www\.[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

const EXACT_BIDI_TOKEN_REGEX =
  /^(?:(?:\+?\d{1,3}[\s-])?\d{2}[\s-]\d{3}[\s-]\d{3}|www\.[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

/**
 * Isolates phone numbers (e.g. "98 140 514") and web domains inside LTR <bdi>
 * spans so Unicode BiDi never reverses grouped digits inside RTL Arabic text.
 */
export function renderBidiSafeText(text?: string | null): ReactNode {
  if (!text) return null;
  const parts = text.split(BIDI_TOKEN_REGEX);
  if (parts.length <= 1) return text;

  return parts.map((part, idx) => {
    if (!part) return null;
    if (EXACT_BIDI_TOKEN_REGEX.test(part)) {
      return (
        <bdi
          key={idx}
          dir="ltr"
          className="inline-block font-mono-tabular [unicode-bidi:isolate]"
        >
          {part}
        </bdi>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}
