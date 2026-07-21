import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface Banner {
  tag: string;
  title: string;
  text: string;
  cta: string;
  href: string;
}

const ROTATE_MS = 6000;

// Carrusel de banners del hero: aquí va la información destacada del momento
// (plazos de matrícula, títulos nuevos, etc.). El cliente pidió 3-4 como
// máximo para que el visitante llegue a verlos todos; los textos viven en
// hero.banners de cada locale, así que añadir/quitar uno es tocar solo JSON.
export default function HeroCarousel() {
  const { t } = useTranslation();
  const banners = t('hero.banners', { returnObjects: true }) as Banner[];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % banners.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [paused, banners.length]);

  const go = (i: number) => setIndex(((i % banners.length) + banners.length) % banners.length);
  const banner = banners[index];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={t('hero.title')}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; setPaused(true); }}
      onTouchEnd={(e) => {
        if (touchStartX.current !== null) {
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
        }
        touchStartX.current = null;
        setPaused(false);
      }}
      className="relative max-w-5xl mx-auto px-4 pt-16 pb-12 md:pt-24 md:pb-16 text-center"
    >
      {/* Altura mínima fija: evita que el layout salte cuando un banner tiene
          un texto más largo que otro al rotar. */}
      <div className="min-h-[16rem] md:min-h-[17rem] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            <span className="inline-block bg-brand-blue/10 text-brand-blue text-xs md:text-sm font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-5">
              {banner.tag}
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-5 text-brand-navy tracking-tight">
              {banner.title}
            </h2>
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              {banner.text}
            </p>
            <a
              href={banner.href}
              className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-navy text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              {banner.cta} <ArrowRight size={18} />
            </a>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controles */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label={t('hero.prev')}
          className="appearance-none bg-white border border-slate-300 rounded-full p-1.5 text-brand-navy hover:text-brand-blue hover:border-brand-blue/60 transition"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="flex items-center gap-2.5">
          {banners.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-label={`${t('hero.goto')} ${i + 1}`}
              aria-current={i === index}
              className={`appearance-none rounded-full transition-all duration-300 ${
                i === index ? 'w-6 h-2.5 bg-brand-blue' : 'w-2.5 h-2.5 bg-slate-300 hover:bg-brand-sky'
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label={t('hero.next')}
          className="appearance-none bg-white border border-slate-300 rounded-full p-1.5 text-brand-navy hover:text-brand-blue hover:border-brand-blue/60 transition"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
