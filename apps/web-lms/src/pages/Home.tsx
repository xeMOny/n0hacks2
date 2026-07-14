import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Search,
  GraduationCap,
  Globe2,
  Users,
  Award,
  BookOpen,
  Quote,
  Newspaper,
  MapPin,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { SiFacebook, SiX, SiInstagram, SiThreads, SiYoutube, SiTiktok } from 'react-icons/si';
import { FaLinkedinIn } from 'react-icons/fa6';
import { openCookieSettings } from '../lib/cookieConsent';
import LanguageSwitcher from '../components/LanguageSwitcher';

// Enlazan al login de cada red, no al perfil: todavía no existen las cuentas
// de marca. Sustituir cada `href` por la URL del perfil real en cuanto se creen.
const socialLinks = [
  { icon: SiFacebook, label: 'Facebook', href: 'https://www.facebook.com/login/' },
  { icon: SiX, label: 'X (Twitter)', href: 'https://x.com/login' },
  { icon: FaLinkedinIn, label: 'LinkedIn', href: 'https://www.linkedin.com/login' },
  { icon: SiInstagram, label: 'Instagram', href: 'https://www.instagram.com/accounts/login/' },
  { icon: SiThreads, label: 'Threads', href: 'https://www.threads.net/login' },
  { icon: SiYoutube, label: 'YouTube', href: 'https://accounts.google.com/ServiceLogin?service=youtube' },
  { icon: SiTiktok, label: 'TikTok', href: 'https://www.tiktok.com/login' },
];

const featureIcons = [BookOpen, Users, Award];

interface Course { title: string; desc: string; price: string; mode: string; level: string }
interface Testimonial { initials: string; name: string; program: string; quote: string }
interface NewsItem { date: string; title: string; excerpt: string }
interface Feature { title: string; desc: string }
interface StatEntry { value: string; label: string }

export default function Home() {
  const { t } = useTranslation();
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
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-emerald-50">
      {/* Header único: logo + utilidades */}
      <header className="sticky top-0 bg-emerald-950/95 backdrop-blur z-50 border-b border-emerald-800/60">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-xl font-bold whitespace-nowrap"
          >
            <GraduationCap className="text-amber-400" size={26} />
            <span className="hidden sm:inline">Universidad Malta</span>
          </motion.div>

          <div className="flex items-center gap-4 text-xs text-emerald-300 whitespace-nowrap">
            <a href="/mi-area" className="hidden lg:inline hover:text-amber-400 transition">{t('nav.students_area')}</a>
            <a href="/login" className="hidden lg:inline hover:text-amber-400 transition">{t('nav.staff_area')}</a>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent"
        >
          {t('hero.title')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-emerald-200 mb-10 max-w-2xl mx-auto"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* Buscador de programas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-3xl mx-auto bg-emerald-900/60 border border-emerald-700/60 rounded-xl p-4 flex flex-col md:flex-row gap-3"
        >
          <select
            value={modalidad}
            onChange={(e) => setModalidad(e.target.value)}
            className="bg-emerald-950 border border-emerald-700 rounded-lg px-4 py-2 text-sm text-emerald-100"
          >
            <option value="all">{t('hero.modality_all')}</option>
            <option value="online">{t('hero.modality_online')}</option>
            <option value="hybrid">{t('hero.modality_hybrid')}</option>
          </select>
          <select
            value={nivel}
            onChange={(e) => setNivel(e.target.value)}
            className="bg-emerald-950 border border-emerald-700 rounded-lg px-4 py-2 text-sm text-emerald-100"
          >
            <option value="all">{t('hero.level_all')}</option>
            <option value="degree">{t('hero.level_degree')}</option>
            <option value="postgrad">{t('hero.level_postgrad')}</option>
          </select>
          <a
            href="#cursos"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 px-6 py-2 rounded-lg font-semibold transition"
          >
            <Search size={18} /> {t('hero.search_cta')}
          </a>
        </motion.div>
      </section>

      {/* Estadísticas */}
      <section className="border-y border-emerald-800/60 bg-emerald-950/60">
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {Object.values(stats).map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
              <div className="text-3xl md:text-4xl font-bold text-amber-400">{s.value}</div>
              <div className="text-sm text-emerald-300 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="sobre" className="max-w-6xl mx-auto px-4 py-20">
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
                className="bg-emerald-900/40 border border-emerald-800/60 rounded-lg p-8 text-center hover:border-amber-500/60 transition"
              >
                <Icon className="w-12 h-12 mx-auto mb-4 text-amber-400" />
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-emerald-300">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Cursos */}
      <section id="cursos" className="max-w-6xl mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-bold">{t('courses.section_title')}</h2>
          <Globe2 className="text-amber-400 hidden md:block" size={32} />
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
                className="bg-gradient-to-br from-emerald-900 to-emerald-950 border border-emerald-800/60 rounded-lg p-8 hover:border-amber-500/60 transition"
              >
                <div className="flex gap-2 mb-4">
                  <span className="text-xs bg-emerald-800 text-emerald-200 px-2 py-1 rounded">{course.mode}</span>
                  <span className="text-xs bg-emerald-800 text-emerald-200 px-2 py-1 rounded">{course.level}</span>
                </div>
                <h3 className="text-2xl font-bold mb-3">{course.title}</h3>
                <p className="text-emerald-300 mb-6">{course.desc}</p>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold text-amber-400">{course.price}</span>
                  <button className="bg-amber-500 hover:bg-amber-400 text-emerald-950 px-6 py-2 rounded-lg font-semibold transition">
                    {t('courses.enroll')}
                  </button>
                </div>
              </motion.div>
            ))}
        </div>
      </section>

      {/* Testimonios */}
      <section className="bg-emerald-950/60 border-y border-emerald-800/60 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">{t('testimonials.section_title')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-emerald-900/40 border border-emerald-800/60 rounded-lg p-8"
              >
                <Quote className="text-amber-400 mb-4" size={28} />
                <p className="text-emerald-200 mb-6 italic">&ldquo;{item.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-emerald-950 text-sm">
                    {item.initials}
                  </div>
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-xs text-emerald-400">{item.program}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Novedades */}
      <section id="novedades" className="max-w-6xl mx-auto px-4 py-20">
        <div className="flex items-center gap-3 mb-12">
          <Newspaper className="text-amber-400" size={28} />
          <h2 className="text-4xl font-bold">{t('news.section_title')}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {news.map((n, i) => (
            <motion.a
              key={i}
              href="#"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="block bg-emerald-900/40 border border-emerald-800/60 rounded-lg p-6 hover:border-amber-500/60 transition group"
            >
              <div className="flex items-center gap-2 text-xs text-emerald-400 mb-3">
                <Calendar size={14} /> {n.date}
              </div>
              <h3 className="font-bold mb-2 group-hover:text-amber-400 transition">{n.title}</h3>
              <p className="text-sm text-emerald-300 mb-4">{n.excerpt}</p>
              <span className="inline-flex items-center gap-1 text-sm text-amber-400">
                {t('news.read_more')} <ChevronRight size={14} />
              </span>
            </motion.a>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-amber-500/10 border-t border-emerald-800/60 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">{t('cta.title')}</h2>
          <p className="text-emerald-200 mb-8">{t('cta.subtitle')}</p>
          <motion.a
            href="#contacto"
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 px-10 py-4 rounded-lg font-bold text-lg transition"
          >
            {t('cta.button')} <ArrowRight size={20} />
          </motion.a>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacto" className="bg-emerald-950 border-t border-emerald-800/60 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 text-lg font-bold mb-3">
                <GraduationCap className="text-amber-400" size={22} />
                Universidad Malta
              </div>
              <p className="text-emerald-400 text-sm">{t('footer.tagline')}</p>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-sm uppercase tracking-wide text-emerald-300">{t('footer.programs_title')}</h4>
              <ul className="text-sm text-emerald-400 space-y-2">
                {courses.map((c) => (
                  <li key={c.id}><a href="#cursos" className="hover:text-amber-400 transition">{c.title}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-sm uppercase tracking-wide text-emerald-300">{t('footer.about_title')}</h4>
              <ul className="text-sm text-emerald-400 space-y-2">
                <li><a href="#sobre" className="hover:text-amber-400 transition">{t('footer.whoweare')}</a></li>
                <li><a href="#novedades" className="hover:text-amber-400 transition">{t('footer.news_link')}</a></li>
                <li><a href="/login" className="hover:text-amber-400 transition">{t('footer.student_access')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-sm uppercase tracking-wide text-emerald-300">{t('footer.contact_title')}</h4>
              <p className="text-emerald-400 text-sm flex items-center gap-2 mb-2">
                <MapPin size={14} /> {t('footer.location')}
              </p>
              <p className="text-emerald-400 text-sm">
                info@uclcampus.com<br />
                +34 XXX XXX XXX
              </p>
            </div>
          </div>
          <div className="flex justify-center gap-5 mb-8">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                title={s.label}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-emerald-900/60 border border-emerald-800/60 text-emerald-300 hover:text-amber-400 hover:border-amber-500/60 transition"
              >
                <s.icon size={16} />
              </a>
            ))}
          </div>
          <div className="border-t border-emerald-800/60 pt-8 text-center text-emerald-500 text-sm">
            <p className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1">
              <a href="/privacidad" className="hover:text-amber-400 transition">{t('footer.privacy_policy_link')}</a>
              <span aria-hidden="true">|</span>
              <a href="/aviso-legal" className="hover:text-amber-400 transition">{t('footer.legal_notice_link')}</a>
              <span aria-hidden="true">|</span>
              <a href="/accesibilidad" className="hover:text-amber-400 transition">{t('footer.accessibility_link')}</a>
              <span aria-hidden="true">|</span>
              <a href="/cookies" className="hover:text-amber-400 transition">{t('footer.cookie_policy_link')}</a>
              <span aria-hidden="true">|</span>
              <button type="button" onClick={() => openCookieSettings()} className="hover:text-amber-400 transition">
                {t('footer.cookie_settings_link')}
              </button>
            </p>
            <p className="mt-3">{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
