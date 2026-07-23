import { Suspense, lazy, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Globe2,
  Menu,
  X,
  ClipboardList,
  GraduationCap,
  MessageCircle,
  Target,
  BadgeCheck,
  Hourglass,
  CheckCircle2,
  Scale,
  ShieldCheck,
  Cookie,
  Accessibility,
  ChevronDown,
} from 'lucide-react';
import { openCookieSettings } from '../lib/cookieConsent';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useLocalizedPath } from '../hooks/useLocalizedPath';
import LanguageSwitcher from '../components/LanguageSwitcher';
import SocialBar from '../components/SocialBar';
import HeroCarousel from '../components/HeroCarousel';
import ContactForm from '../components/ContactForm';
import VideoEmbed from '../components/VideoEmbed';
import videos from '../data/videos.json';

// Lazy: el widget de chat (con su propio framer-motion + cliente de API)
// no hace falta para el primer pintado, es un botón flotante que la mayoría
// de visitas nunca abre. Antes se cargaba entero dentro del bundle crítico
// de la home.
const ChatWidget = lazy(() => import('../components/ChatWidget'));
import logoHorizontal from '../assets/logo/logo-horizontal-uclcampus.svg';
import logoHorizontalWhite from '../assets/logo/logo-horizontal-uclcampus-white.svg';
import DEPARTMENTS from '../data/departments.json';

// Oferta académica organizada por departamentos (desplegables). Los nombres
// de departamento y los títulos se traducen vía i18n (offer.dept_names /
// offer.titles); aquí solo va la estructura y el orden.
const DEPARTMENTS_TYPED = DEPARTMENTS as { id: string; programs: { slug: string; inAccreditation?: boolean }[] }[];

// Iconos de los 4 cuadros de "Sobre nosotros" (misión, oficialidad,
// Reino Unido/Commonwealth, grados de 3 años), en el orden de about.cards.
const aboutCardIcons = [Target, BadgeCheck, Globe2, Hourglass];

interface TitledItem { title: string; desc: string }
interface AdmissionStep { title: string; desc: string }

// Las 6 pestañas de navegación pedidas por el cliente, en su orden.
// Anclas de la propia home: las secciones de Admisiones y Transparencia
// existen más abajo en esta misma página.
const NAV_ITEMS = [
  { key: 'nav.home', href: '#inicio' },
  { key: 'nav.about', href: '#sobre' },
  { key: 'nav.academic_offer', href: '#cursos' },
  { key: 'nav.admissions', href: '#admisiones' },
  { key: 'nav.transparency', href: '#transparencia' },
  { key: 'nav.contact', href: '#contacto' },
] as const;

const admissionIcons = [MessageCircle, ClipboardList, GraduationCap];

export default function Home() {
  const { t, i18n } = useTranslation();
  const lp = useLocalizedPath();
  // La tarjeta de "grados de tres años" es un argumento solo relevante en
  // España (allí los grados son de 4 años), así que solo se muestra en la
  // versión española. En el resto de idiomas se oculta.
  const isEsLang = (i18n.resolvedLanguage || 'es').slice(0, 2) === 'es';
  useDocumentMeta(t('meta.home_title'), '/', t('meta.home_desc'));
  const [menuOpen, setMenuOpen] = useState(false);

  const aboutCards = t('about.cards', { returnObjects: true }) as TitledItem[];
  const essenceItems = t('about.essence_items', { returnObjects: true }) as TitledItem[];
  const talentItems = t('about.talent_items', { returnObjects: true }) as TitledItem[];
  const admissionSteps = t('admissions.steps', { returnObjects: true }) as AdmissionStep[];
  const transparencyLinks = [
    { to: '/aviso-legal', label: t('footer.legal_notice_link'), icon: Scale },
    { to: '/privacidad', label: t('footer.privacy_policy_link'), icon: ShieldCheck },
    { to: '/cookies', label: t('footer.cookie_policy_link'), icon: Cookie },
    { to: '/accesibilidad', label: t('footer.accessibility_link'), icon: Accessibility },
  ];

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
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4 2xl:gap-6">
          <Link to={lp('/')} className="shrink-0 flex items-center">
            <img src={logoHorizontal} alt="UCL Campus Malta" className="h-8 md:h-9 w-auto" />
          </Link>

          {/* 6 pestañas: no caben junto a los enlaces de acceso hasta xl,
              así que estos últimos colapsan al menú hamburguesa antes. */}
          <nav className="hidden xl:flex items-center gap-4 2xl:gap-7 text-sm font-semibold text-brand-navy whitespace-nowrap bg-transparent">
            {NAV_ITEMS.map(({ key, href }) => (
              <a key={key} href={href} className="hover:text-brand-blue transition">{t(key)}</a>
            ))}
          </nav>

          <div className="flex items-center gap-3 text-xs font-medium text-slate-500 whitespace-nowrap">
            <Link to="/mi-area" className="hidden xl:inline hover:text-brand-blue transition">{t('nav.students_area')}</Link>
            <Link to="/login" className="hidden xl:inline hover:text-brand-blue transition">{t('nav.staff_area')}</Link>
            <span className="hidden xl:block w-px h-4 bg-slate-300" aria-hidden="true" />
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? t('nav.close') : t('nav.menu')}
              className="xl:hidden appearance-none bg-transparent p-1.5 -mr-1.5 text-brand-navy hover:text-brand-blue transition"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Menú móvil/tablet: mismo contenido que la barra de escritorio.
            Por debajo de xl no cabe la barra completa (6 pestañas más los
            accesos; el francés es el idioma más largo), así que colapsa aquí. */}
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="xl:hidden overflow-hidden border-t border-slate-200 bg-white"
            >
              <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col text-sm font-semibold text-brand-navy">
                {NAV_ITEMS.map(({ key, href }) => (
                  <a key={key} href={href} onClick={() => setMenuOpen(false)} className="py-2.5 hover:text-brand-blue transition">{t(key)}</a>
                ))}
                <span className="my-2 h-px bg-slate-200" aria-hidden="true" />
                <Link to="/mi-area" onClick={() => setMenuOpen(false)} className="py-2.5 text-slate-500 hover:text-brand-blue transition">{t('nav.students_area')}</Link>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="py-2.5 text-slate-500 hover:text-brand-blue transition">{t('nav.staff_area')}</Link>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* Hero: carrusel de banners con la información destacada del momento
          (plazos de matrícula, títulos, etc.). Sustituye al banner estático
          con buscador que había antes, por petición del cliente. El h1 es
          solo para lectores de pantalla/buscadores: los títulos visibles de
          los banners rotan, y un h1 cambiante sería mala jerarquía. */}
      <section id="inicio" className="relative">
        <h1 className="sr-only">{t('meta.home_title')}</h1>
        <HeroCarousel />
      </section>

      {/* Sobre nosotros: contenido real del documento del cliente.
          Punto 1 como texto introductorio, puntos 2-5 en 4 cuadros, y
          puntos 6-8 en una banda oscura diferenciada (tienen sub-puntos y
          más texto: en cuadros iguales quedarían apretados y todo al mismo
          nivel; la banda los distingue como "nuestra filosofía"). */}
      <section id="sobre" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-brand-navy text-center mb-8">{t('nav.about')}</h2>
          <div className="max-w-3xl mx-auto text-slate-600 leading-relaxed space-y-4 mb-14">
            {/* "Universidad Cum Laude" enlaza a su web (URL pendiente del
                cliente); de momento a una página en blanco (/cum-laude.html).
                El detalle legal (registro de Andorra, objeto social) va oculto
                aquí: irá en esa página de destino cuando exista. */}
            <p>
              {t('about.intro_p1_pre')}
              <a href="/cum-laude.html" target="_blank" rel="noopener noreferrer" className="text-brand-blue font-semibold underline underline-offset-2 hover:text-brand-navy transition">{t('about.ucl_link')}</a>{t('about.intro_p1_post')}
            </p>
          </div>
          {/* Vídeo de presentación de la entidad. Hueco preparado: se muestra
              solo cuando videos.entity tiene una URL (YouTube/Vimeo). */}
          {videos.entity && (
            <div className="max-w-3xl mx-auto mb-14">
              <h3 className="text-lg font-bold text-brand-navy text-center mb-4">{t('about.video_title')}</h3>
              <VideoEmbed url={videos.entity} title={t('about.video_title')} />
            </div>
          )}
          <div className={`grid gap-6 ${isEsLang ? 'md:grid-cols-2 xl:grid-cols-4' : 'md:grid-cols-3'}`}>
            {(isEsLang ? aboutCards : aboutCards.slice(0, 3)).map((card, i) => {
              const Icon = aboutCardIcons[i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white border border-slate-200 rounded-xl p-7 text-center shadow-sm hover:shadow-md hover:border-brand-sky transition"
                >
                  <Icon className="w-11 h-11 mx-auto mb-4 text-brand-blue" />
                  <h3 className="text-lg font-bold mb-2 text-brand-navy">{card.title}</h3>
                  <p className="text-sm text-slate-600">{card.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Puntos 6-8: banda navy en dos columnas con listas de checks, y el
          compromiso de calidad como cierre centrado. */}
      <section className="bg-brand-navy py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-14">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h3 className="text-2xl font-bold text-white mb-3">{t('about.essence_title')}</h3>
              <p className="text-slate-300 mb-6">{t('about.essence_intro')}</p>
              <ul className="space-y-4">
                {essenceItems.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <CheckCircle2 size={20} className="shrink-0 mt-0.5 text-brand-sky" />
                    <div>
                      <span className="font-semibold text-white">{item.title}.</span>{' '}
                      <span className="text-slate-300">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} viewport={{ once: true }}>
              <h3 className="text-2xl font-bold text-white mb-3">{t('about.talent_title')}</h3>
              <p className="text-slate-300 mb-6">{t('about.talent_intro')}</p>
              <ul className="space-y-4">
                {talentItems.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <CheckCircle2 size={20} className="shrink-0 mt-0.5 text-brand-sky" />
                    <div>
                      <span className="font-semibold text-white">{item.title}.</span>{' '}
                      <span className="text-slate-300">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center border-t border-white/15 pt-10"
          >
            <h3 className="text-2xl font-bold text-white mb-4">{t('about.quality_title')}</h3>
            <p className="text-slate-300 leading-relaxed">{t('about.quality_text')}</p>
          </motion.div>
        </div>
      </section>

      {/* Oferta Académica: títulos organizados por departamentos en
          desplegables (<details> nativo: accesible y presente en el HTML
          aunque el JS no cargue). Cada título enlaza a su página
          (/oferta/<slug>/); los que aún no tienen ficha completa se muestran
          como "ficha en preparación". */}
      <section id="cursos" className="bg-brand-mist py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-4xl font-bold text-brand-navy">{t('nav.academic_offer')}</h2>
            <Globe2 className="text-brand-blue hidden md:block" size={32} />
          </div>
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {DEPARTMENTS_TYPED.map((dept, di) => (
              <details
                key={dept.id}
                open={di === 0}
                className="group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
              >
                <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer select-none list-none marker:hidden [&::-webkit-details-marker]:hidden hover:bg-brand-mist/50 transition">
                  <span className="text-lg md:text-xl font-bold text-brand-navy">{t(`offer.dept_names.${dept.id}`)}</span>
                  <span className="shrink-0 flex items-center gap-3">
                    <span className="text-xs font-semibold text-brand-blue bg-brand-mist rounded-full px-2.5 py-1">{dept.programs.length}</span>
                    <ChevronDown size={20} className="text-brand-blue transition-transform duration-300 group-open:rotate-180" />
                  </span>
                </summary>
                <ul className="border-t border-slate-100 divide-y divide-slate-100">
                  {dept.programs.map((p) => (
                    <li key={p.slug}>
                      <Link
                        to={lp(`/oferta/${p.slug}`)}
                        className="group/item flex items-center justify-between gap-3 px-6 py-4 hover:bg-brand-mist/60 transition"
                      >
                        <span className="min-w-0">
                          <span className="font-medium text-brand-navy group-hover/item:text-brand-blue transition">{t(`offer.titles.${p.slug}`)}</span>
                          {p.inAccreditation && (
                            <span className="ml-2 align-middle inline-block text-[10px] font-semibold uppercase tracking-wide text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                              {t('offer.in_accreditation')}
                            </span>
                          )}
                        </span>
                        <ArrowRight size={16} className="shrink-0 text-brand-blue opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 transition" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Admisiones: proceso en 3 pasos + CTA. Contenido genérico de partida,
          a la espera de que el cliente concrete requisitos/plazos reales. */}
      <section id="admisiones" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-brand-navy text-center mb-4">{t('admissions.section_title')}</h2>
          <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">{t('admissions.intro')}</p>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {admissionSteps.map((step, i) => {
              const Icon = admissionIcons[i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="relative bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm hover:shadow-md hover:border-brand-sky transition"
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-4 left-4 w-7 h-7 rounded-full bg-brand-mist text-brand-blue text-sm font-bold flex items-center justify-center"
                  >
                    {i + 1}
                  </span>
                  <Icon className="w-12 h-12 mx-auto mb-4 text-brand-blue" />
                  <h3 className="text-xl font-bold mb-2 text-brand-navy">{step.title}</h3>
                  <p className="text-slate-600">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
          <div className="text-center">
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-navy text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              {t('admissions.cta')} <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Transparencia y normativa: acceso a la documentación legal real del
          sitio. Cuando el cliente facilite normativa académica propia
          (reglamentos, calidad, etc.), añadirla aquí como más enlaces. */}
      <section id="transparencia" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-brand-navy text-center mb-4">{t('transparency.section_title')}</h2>
          <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">{t('transparency.intro')}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {transparencyLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={lp(to)}
                className="bg-white border border-slate-200 rounded-xl p-6 text-center shadow-sm hover:shadow-md hover:border-brand-sky transition group"
              >
                <span className="inline-flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-brand-mist text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition">
                  <Icon className="w-6 h-6" />
                </span>
                <span className="block font-semibold text-brand-navy group-hover:text-brand-blue transition">{label}</span>
              </Link>
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

      {/* Contacto: formulario de solicitud de información (llega por email a
          info@uclcampus.com vía FormSubmit — ver nota en ContactForm.tsx).
          El id="contacto" vive aquí ahora (antes en el footer): todos los CTA
          de la página aterrizan en el formulario. */}
      <section id="contacto" className="bg-brand-mist py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-brand-navy text-center mb-4">{t('contact_form.section_title')}</h2>
          <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">{t('contact_form.intro')}</p>
          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-navy border-t border-white/10 py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* 3 columnas de enlaces, centradas, con cabecera en negrita */}
          <div className="grid sm:grid-cols-3 gap-10 mb-16 text-center">
            <div>
              <h3 className="font-bold mb-4 text-white">{t('footer.legal_title')}</h3>
              <ul className="text-sm text-slate-300 space-y-3">
                <li><Link to={lp('/aviso-legal')} className="hover:text-brand-sky transition">{t('footer.legal_notice_link')}</Link></li>
                <li><Link to={lp('/privacidad')} className="hover:text-brand-sky transition">{t('footer.privacy_policy_link')}</Link></li>
                <li><Link to={lp('/cookies')} className="hover:text-brand-sky transition">{t('footer.cookie_policy_link')}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-white">{t('footer.website_title')}</h3>
              <ul className="text-sm text-slate-300 space-y-3">
                <li><a href="#cursos" className="hover:text-brand-sky transition">{t('footer.programs_title')}</a></li>
                <li><Link to={lp('/accesibilidad')} className="hover:text-brand-sky transition">{t('footer.accessibility_link')}</Link></li>
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
          <div className="flex flex-col items-center mb-10">
            <img src={logoHorizontalWhite} alt="UCL Campus Malta" className="h-12 w-auto" />
          </div>

          {/* Copyright */}
          <div className="border-t border-white/10 pt-8 text-center text-sm text-slate-400">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>

      {/* Sin backend accesible (GitHub Pages es estático), cada mensaje del
          chat acabaría en error de cara al visitante. En dev el proxy de Vite
          apunta al backend local; en producción solo se muestra cuando el
          build define VITE_API_BASE (es decir, cuando el backend real exista). */}
      {(import.meta.env.DEV || import.meta.env.VITE_API_BASE) && (
        <Suspense fallback={null}>
          <ChatWidget />
        </Suspense>
      )}
    </div>
  );
}
