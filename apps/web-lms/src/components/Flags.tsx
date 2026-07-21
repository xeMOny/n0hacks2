import type { SupportedLanguage } from '../i18n';

// Banderas SVG inline (no emoji: los emoji de bandera no se renderizan en
// Windows/Chrome, saldrían como el código de país en texto). Rectángulo 20×14
// con esquinas redondeadas, para el selector de idiomas.
// Idioma → país convencional en webs europeas: en → Reino Unido.

const wrap = (children: React.ReactNode) => (
  <svg viewBox="0 0 20 14" width="20" height="14" className="rounded-[2px] shrink-0 shadow-[0_0_0_1px_rgba(0,0,0,0.08)]" aria-hidden="true">
    {children}
  </svg>
);

function FlagES() {
  return wrap(
    <>
      <rect width="20" height="14" fill="#c60b1e" />
      <rect y="3.5" width="20" height="7" fill="#ffc400" />
    </>,
  );
}

function FlagGB() {
  return wrap(
    <>
      <rect width="20" height="14" fill="#012169" />
      <path d="M0 0l20 14M20 0L0 14" stroke="#fff" strokeWidth="2.8" />
      <path d="M0 0l20 14M20 0L0 14" stroke="#c8102e" strokeWidth="1.1" />
      <path d="M10 0v14M0 7h20" stroke="#fff" strokeWidth="4" />
      <path d="M10 0v14M0 7h20" stroke="#c8102e" strokeWidth="2.2" />
    </>,
  );
}

function FlagFR() {
  return wrap(
    <>
      <rect width="20" height="14" fill="#fff" />
      <rect width="6.67" height="14" fill="#0055a4" />
      <rect x="13.33" width="6.67" height="14" fill="#ef4135" />
    </>,
  );
}

function FlagIT() {
  return wrap(
    <>
      <rect width="20" height="14" fill="#fff" />
      <rect width="6.67" height="14" fill="#009246" />
      <rect x="13.33" width="6.67" height="14" fill="#ce2b37" />
    </>,
  );
}

const FLAGS: Record<SupportedLanguage, () => React.ReactElement> = {
  es: FlagES,
  en: FlagGB,
  fr: FlagFR,
  it: FlagIT,
};

export default function Flag({ lang }: { lang: SupportedLanguage }) {
  const F = FLAGS[lang];
  return <F />;
}
