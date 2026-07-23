import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import bannerMatricula from '../assets/hero/banner-matricula.jpg';
import bannerTitulos from '../assets/hero/banner-titulos.jpg';
import bannerOnline from '../assets/hero/banner-online.jpg';

interface Banner {
  tag: string;
  title: string;
  text: string;
  cta: string;
  href: string;
}

// Fotos de banco (Unsplash, licencia libre, sin marcas de ninguna institución
// real, 1920px para verse nítidas a pantalla completa) en el mismo orden que
// hero.banners de los locales: matrícula, títulos, campus virtual. Si se añade
// un 4º banner en los locales sin foto aquí, el slide se muestra sobre el
// fondo navy (solo texto) en vez de romperse.
const bannerImages = [bannerMatricula, bannerTitulos, bannerOnline];

const ROTATE_MS = 6000;

// Hero a pantalla completa: la imagen ocupa todo el ancho y alto, y el texto
// (destacado del momento: plazos de matrícula, títulos, etc.) va superpuesto
// encima, con un degradado de marca para que se lea bien sobre cualquier foto.
// El cliente pidió 3-4 banners como máximo; los textos viven en hero.banners
// de cada locale, así que añadir/quitar uno es tocar solo JSON.
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
  const image = bannerImages[index];

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
      className="relative w-full h-[82vh] min-h-[520px] max-h-[880px] overflow-hidden bg-brand-navy select-none"
    >
      {/* Imagen a sangre con crossfade entre banners */}
      <AnimatePresence>
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {image && (
            <img
              src={image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          {/* Degradado para legibilidad: fuerte a la izquierda (donde va el
              texto) y ligero abajo, para que el texto blanco se lea sobre
              cualquier foto, clara u oscura. */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/95 via-brand-navy/70 to-brand-navy/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Texto superpuesto */}
      <div className="relative z-10 h-full max-w-6xl mx-auto px-5 md:px-8 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl"
          >
            <span className="inline-block bg-white/15 backdrop-blur-sm text-white text-xs md:text-sm font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-5 border border-white/25">
              {banner.tag}
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.08] mb-5 drop-shadow-sm">
              {banner.title}
            </h2>
            <p className="text-lg md:text-2xl text-white/85 mb-8 max-w-xl leading-relaxed">
              {banner.text}
            </p>
            <a
              href={banner.href}
              className="inline-flex items-center gap-2 bg-white text-brand-navy hover:bg-brand-sky px-8 py-3.5 rounded-lg font-bold text-base transition shadow-lg"
            >
              {banner.cta} <ArrowRight size={18} />
            </a>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Flechas */}
      <button
        type="button"
        onClick={() => go(index - 1)}
        aria-label={t('hero.prev')}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 bg-white/15 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-2 md:p-2.5 border border-white/25 transition"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={() => go(index + 1)}
        aria-label={t('hero.next')}
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 bg-white/15 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-2 md:p-2.5 border border-white/25 transition"
      >
        <ChevronRight size={20} />
      </button>

      {/* Puntos */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-center gap-2.5">
        {banners.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go(i)}
            aria-label={`${t('hero.goto')} ${i + 1}`}
            aria-current={i === index}
            className={`appearance-none rounded-full transition-all duration-300 ${
              i === index ? 'w-7 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
