import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Search,
  Globe2,
  Users,
  Award,
  BookOpen,
  Quote,
  Newspaper,
  MapPin,
  Calendar,
} from 'lucide-react';
import { openCookieSettings } from '../lib/cookieConsent';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import LanguageSwitcher from '../components/LanguageSwitcher';
import ChatWidget from '../components/ChatWidget';
import SocialBar from '../components/SocialBar';
import logoHorizontal from '../assets/logo/logo-horizontal-uclcampus.svg';
import logoVerticalWhite from '../assets/logo/logo-vertical-uclcampus-white.svg';
import logoIcon from '../assets/logo/logo-icon-uclcampus.svg';
import testimonialMarta from '../assets/testimonials/marta.jpg';
import testimonialJordi from '../assets/testimonials/jordi.jpg';
import testimonialAina from '../assets/testimonials/aina.jpg';

// Fotos de banco (Unsplash, licencia libre) a modo de placeholder mientras no
// hay fotos reales de alumnos. Sustituir por fotos reales en cuanto el
// cliente las facilite.
const testimonialPhotos = [testimonialMarta, testimonialJordi, testimonialAina];

const featureIcons = [BookOpen, Users, Award];

interface Course { title: string; desc: string; price: string; mode: string; level: string }
interface Testimonial { initials: string; name: string; program: string; quote: string }
interface NewsItem { date: string; title: string; excerpt: string }
interface Feature { title: string; desc: string }
interface StatEntry { value: string; label: string }

export default function Home() {
  const { t } = useTranslation();
  useDocumentMeta(t('meta.home_title'), '/');
  const [modalidad, setModalidad] = useState('all');
  const [nivel, setNivel] = useState('all');

  const stats = t('stats', { returnObjects: true }) as Record<string, StatEntry>;
  const features = t('features', { returnObjects: true }) as Feature[];
  const courses = (t('courses.items', { returnObjects: true }) as Course[]).map((c, i) => ({ ...c, id: i }));
  const testimonials = t('testimonials.items', { returnObjects: true }) as Testimonial[];
  const news = t('news.items', { returnObjects: true }) as NewsItem[];

  const modeMatch = (mode: string) => {
    if (modalidad === 'all') return true;
    return modalidad === 'online' ? mode === t('hero.modality_online') : mode === t('hero.modality_hybrid');
  };
  const levelMatch = (level: string) => {
    if (nivel === 'all') return true;
    return nivel === 'degree' ? level === t('hero.level_degree') : level === t('hero.level_postgrad');
  };

  return (
    <div className="min-h-screen bg-white text-slate-700">
      {/* Barra de utilidad: solo redes sociales, no sticky (se pierde al hacer
          scroll). El idioma sigue viviendo en la cabecera principal de abajo,
          no aquí, para no duplicar el selector ni perderlo al hacer scroll. */}
      <SocialBar />

      {/* Header único: logo + navegación + utilidades, todo en una sola barra
          (a propósito más arriba que en IE University, que separa una barra
          de utilidades sobre la barra de navegación principal) */}
      <header className="sticky top-0 bg-white/95 backdrop-blur z-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-6">
          <Link to="/" className="shrink-0 flex items-center">
            <img src={logoHorizontal} alt="UCLCampus" className="h-8 md:h-9 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-brand-navy whitespace-nowrap bg-transparent">
            <a href="#cursos" className="hover:text-brand-blue transition">{t('nav.programs')}</a>
            <a href="#sobre" className="hover:text-brand-blue transition">{t('nav.about')}</a>
            <a href="#novedades" className="hover:text-brand-blue transition">{t('nav.news')}</a>
            <a href="#contacto" className="hover:text-brand-blue transition">{t('nav.contact')}</a>
          </nav>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-500 whitespace-nowrap">
            <Link to="/mi-area" className="hidden lg:inline hover:text-brand-blue transition">{t('nav.students_area')}</Link>
            <Link to="/login" className="hidden lg:inline hover:text-brand-blue transition">{t('nav.staff_area')}</Link>
            <span className="hidden lg:block w-px h-4 bg-slate-300" aria-hidden="true" />
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-mist to-white">
        <img
          src={logoIcon}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-20 -top-14 w-80 md:w-[28rem] opacity-[0.05]"
        />
        <div className="relative max-w-5xl mx-auto px-4 pt-20 pb-14 md:pt-28 md:pb-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6 text-brand-navy tracking-tight"
          >
            {t('hero.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* Buscador de programas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl mx-auto bg-white shadow-lg shadow-slate-300/30 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-3"
          >
            <select
              value={modalidad}
              onChange={(e) => setModalidad(e.target.value)}
              aria-label={t('hero.modality_label')}
              className="bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm text-brand-navy"
            >
              <option value="all">{t('hero.modality_all')}</option>
              <option value="online">{t('hero.modality_online')}</option>
              <option value="hybrid">{t('hero.modality_hybrid')}</option>
            </select>
            <select
              value={nivel}
              onChange={(e) => setNivel(e.target.value)}
              aria-label={t('hero.level_label')}
              className="bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm text-brand-navy"
            >
              <option value="all">{t('hero.level_all')}</option>
              <option value="degree">{t('hero.level_degree')}</option>
              <option value="postgrad">{t('hero.level_postgrad')}</option>
            </select>
            <a
              href="#cursos"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-blue hover:bg-brand-navy text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              <Search size={18} /> {t('hero.search_cta')}
            </a>
          </motion.div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="bg-brand-navy">
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {Object.values(stats).map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
              <div className="text-3xl md:text-4xl font-bold text-brand-sky">{s.value}</div>
              <div className="text-sm text-slate-300 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="sobre" className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-brand-navy text-center mb-12">{t('nav.about')}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = featureIcons[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm hover:shadow-md hover:border-brand-sky transition"
              >
                <Icon className="w-12 h-12 mx-auto mb-4 text-brand-blue" />
                <h3 className="text-xl font-bold mb-2 text-brand-navy">{f.title}</h3>
                <p className="text-slate-600">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Cursos */}
      <section id="cursos" className="bg-brand-mist py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold text-brand-navy">{t('courses.section_title')}</h2>
            <Globe2 className="text-brand-blue hidden md:block" size={32} />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {courses
              .filter((c) => modeMatch(c.mode))
              .filter((c) => levelMatch(c.level))
              .map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm hover:shadow-md hover:border-brand-sky transition"
                >
                  <div className="flex gap-2 mb-4">
                    <span className="text-xs bg-brand-mist text-brand-blue px-2 py-1 rounded font-medium">{course.mode}</span>
                    <span className="text-xs bg-brand-mist text-brand-blue px-2 py-1 rounded font-medium">{course.level}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-brand-navy">{course.title}</h3>
                  <p className="text-slate-600 mb-6">{course.desc}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold text-brand-blue">{course.price}</span>
                    {/* No hay pasarela de matrícula/pago real todavía: lleva al
                        formulario de contacto en vez de ser un botón sin acción. */}
                    <a
                      href="#contacto"
                      className="bg-brand-blue hover:bg-brand-navy text-white px-6 py-2 rounded-lg font-semibold transition"
                    >
                      {t('courses.enroll')}
                    </a>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-brand-navy">{t('testimonials.section_title')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-brand-mist border border-slate-200 rounded-xl p-8"
              >
                <Quote className="text-brand-sky mb-4" size={28} />
                <p className="text-slate-700 mb-6 italic">&ldquo;{item.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonialPhotos[i]}
                    alt=""
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-brand-navy">{item.name}</div>
                    <div className="text-xs text-slate-500">{item.program}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Novedades */}
      <section id="novedades" className="bg-brand-mist py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-12">
            <Newspaper className="text-brand-blue" size={28} />
            <h2 className="text-4xl font-bold text-brand-navy">{t('news.section_title')}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Sin sistema de artículos/blog todavía: son tarjetas informativas,
                no enlaces (antes tenían href="#" y no llevaban a ningún sitio). */}
            {news.map((n, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                  <Calendar size={14} /> {n.date}
                </div>
                <h3 className="font-bold mb-2 text-brand-navy">{n.title}</h3>
                <p className="text-sm text-slate-600">{n.excerpt}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-navy py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">{t('cta.title')}</h2>
          <p className="text-slate-300 mb-8">{t('cta.subtitle')}</p>
          <motion.a
            href="#contacto"
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 bg-white hover:bg-brand-mist text-brand-navy px-10 py-4 rounded-lg font-bold text-lg transition"
          >
            {t('cta.button')} <ArrowRight size={20} />
          </motion.a>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacto" className="bg-brand-navy border-t border-white/10 py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* 3 columnas de enlaces, centradas, con cabecera en negrita */}
          <div className="grid sm:grid-cols-3 gap-10 mb-16 text-center">
            <div>
              <h3 className="font-bold mb-4 text-white">{t('footer.legal_title')}</h3>
              <ul className="text-sm text-slate-300 space-y-3">
                <li><Link to="/aviso-legal" className="hover:text-brand-sky transition">{t('footer.legal_notice_link')}</Link></li>
                <li><Link to="/privacidad" className="hover:text-brand-sky transition">{t('footer.privacy_policy_link')}</Link></li>
                <li><Link to="/cookies" className="hover:text-brand-sky transition">{t('footer.cookie_policy_link')}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-white">{t('footer.website_title')}</h3>
              <ul className="text-sm text-slate-300 space-y-3">
                <li><a href="#cursos" className="hover:text-brand-sky transition">{t('footer.programs_title')}</a></li>
                <li><a href="#novedades" className="hover:text-brand-sky transition">{t('footer.news_link')}</a></li>
                <li><Link to="/accesibilidad" className="hover:text-brand-sky transition">{t('footer.accessibility_link')}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-white">{t('footer.contact_title')}</h3>
              <ul className="text-sm text-slate-300 space-y-3">
                <li><a href="mailto:info@uclcampus.com" className="hover:text-brand-sky transition">{t('cta.button')}</a></li>
                <li><Link to="/login" className="hover:text-brand-sky transition">{t('footer.student_access')}</Link></li>
                <li>
                  <button type="button" onClick={() => openCookieSettings()} className="hover:text-brand-sky transition">
                    {t('footer.cookie_settings_link')}
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Marca centrada */}
          <div className="flex flex-col items-center gap-2 mb-10">
            <img src={logoVerticalWhite} alt="UCLCampus" className="h-24 w-auto" />
            <p className="text-slate-400 text-xs flex items-center gap-1">
              <MapPin size={12} /> {t('footer.location')}
            </p>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/10 pt-8 text-center text-sm text-slate-400">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}
