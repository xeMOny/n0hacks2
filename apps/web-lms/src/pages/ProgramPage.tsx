import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  BookOpen,
  ClipboardCheck,
  Award,
  Building2,
  BadgeCheck,
  Info,
  CalendarDays,
  GraduationCap,
} from 'lucide-react';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useLocalizedPath } from '../hooks/useLocalizedPath';
import LanguageSwitcher from '../components/LanguageSwitcher';
import logoHorizontal from '../assets/logo/logo-horizontal-uclcampus.svg';
import PROGRAM_SLUGS from '../data/programSlugs.json';

interface Module { name: string; ects: number; desc: string }
interface AdmissionBlock { heading: string | null; items: string[] }
interface ExitPoint { name: string; ects: string; desc: string }
interface Program {
  title: string;
  category: string;
  description: string;
  careers: string[];
  modules: Module[];
  admission: AdmissionBlock[];
  exitPoints: ExitPoint[];
  mqfCap: string;
  sidebar: {
    category: string; duration: string; modules: number; ects: number;
    qualification: string; attendance: string; delivery: string; language: string;
    enrollOpen: string; classesStart: string; enrollStatus: string;
  };
}

// Los JSON de contenido (6 programas x 4 idiomas) se cargan bajo demanda:
// son ~200KB en total y solo hace falta uno por visita.
const programData = import.meta.glob('../data/programs/*/*.json');

function SidebarBlock({ title, icon: Icon, rows }: { title: string; icon: typeof Info; rows: [string, string | number][] }) {
  return (
    <div className="border-t border-slate-200 pt-5 mt-5 first:border-t-0 first:pt-0 first:mt-0">
      <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-brand-navy mb-3">
        <Icon size={15} className="text-brand-blue" /> {title}
      </h3>
      <dl className="space-y-2">
        {rows.map(([label, value]) => (
          <div key={label} className="text-sm">
            <dt className="text-slate-500">{label}</dt>
            <dd className="font-semibold text-brand-navy">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function ProgramPage() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const lp = useLocalizedPath();
  const lang = (i18n.resolvedLanguage || 'es').slice(0, 2);
  const [program, setProgram] = useState<Program | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    setProgram(null);
    setMissing(false);
    const key = `../data/programs/${lang}/${slug}.json`;
    const loader = programData[key];
    if (!slug || !(PROGRAM_SLUGS as string[]).includes(slug) || !loader) {
      setMissing(true);
      return;
    }
    let cancelled = false;
    loader().then((mod) => {
      if (!cancelled) setProgram((mod as { default: Program }).default);
    });
    return () => { cancelled = true; };
  }, [slug, lang]);

  useDocumentMeta(
    program ? `${program.title} · UCLCampus` : 'UCLCampus',
    `/oferta/${slug}/`,
    program?.description,
  );

  if (missing) {
    return (
      <div className="min-h-screen bg-white text-slate-700">
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <p className="text-lg text-slate-600 mb-6">{t('program_page.not_found')}</p>
          <Link to={lp('/')} className="inline-flex items-center gap-1.5 text-brand-blue hover:text-brand-navy font-semibold transition">
            <ArrowLeft size={16} /> {t('common.back_to_home')}
          </Link>
        </div>
      </div>
    );
  }

  if (!program) return null;

  const s = program.sidebar;

  return (
    <div className="min-h-screen bg-white text-slate-700">
      {/* Cabecera compacta propia (la home tiene la suya con anclas que aquí
          no existen): logo + volver + idioma. */}
      <header className="sticky top-0 bg-white/95 backdrop-blur z-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link to={lp('/')} className="shrink-0 flex items-center">
            <img src={logoHorizontal} alt="UCLCampus" className="h-8 md:h-9 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <Link to={lp('/') + '#cursos'} className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand-navy hover:text-brand-blue transition">
              <ArrowLeft size={15} /> {t('program_page.back')}
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Título */}
      <section className="bg-gradient-to-b from-brand-mist to-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-blue mb-3">{program.category} · {s.qualification}</p>
          <h1 className="text-3xl md:text-5xl font-bold text-brand-navy tracking-tight max-w-4xl">{program.title}</h1>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 grid lg:grid-cols-[1fr_20rem] gap-12">
        {/* Contenido principal */}
        <div className="min-w-0">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-brand-navy mb-4">{t('program_page.description_title')}</h2>
            <p className="text-slate-600 leading-relaxed">{program.description}</p>
          </section>

          <section className="mb-12">
            <h2 className="flex items-center gap-2 text-2xl font-bold text-brand-navy mb-4">
              <Briefcase size={22} className="text-brand-blue" /> {t('program_page.careers_title')}
            </h2>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
              {program.careers.map((c) => (
                <li key={c} className="flex gap-2 text-slate-600">
                  <span aria-hidden="true" className="text-brand-sky mt-1">•</span> {c}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="flex items-center gap-2 text-2xl font-bold text-brand-navy mb-6">
              <BookOpen size={22} className="text-brand-blue" /> {t('program_page.modules_title')}
            </h2>
            <div className="space-y-4">
              {program.modules.map((m) => (
                <div key={m.name} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                    <h3 className="font-bold text-brand-navy">{m.name}</h3>
                    <span className="text-xs font-semibold bg-brand-mist text-brand-blue px-2 py-1 rounded whitespace-nowrap">{m.ects} ECTS</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Banner de matrícula (pedido por el cliente): mientras no exista
              una hoja de matrícula real, lleva al formulario de contacto. */}
          <section className="mb-12 bg-brand-navy rounded-xl p-8 text-center">
            <p className="text-xl font-bold text-white mb-4">{t('program_page.enroll_banner')}</p>
            <Link
              to={lp('/') + '#contacto'}
              className="inline-flex items-center gap-2 bg-white hover:bg-brand-mist text-brand-navy px-8 py-3 rounded-lg font-bold transition"
            >
              {t('program_page.enroll_banner_cta')} <ArrowRight size={18} />
            </Link>
          </section>

          <section className="mb-12">
            <h2 className="flex items-center gap-2 text-2xl font-bold text-brand-navy mb-4">
              <ClipboardCheck size={22} className="text-brand-blue" /> {t('program_page.admission_title')}
            </h2>
            <div className="space-y-5">
              {program.admission.map((block, i) => (
                <div key={i}>
                  {block.heading && <h3 className="font-semibold text-brand-navy mb-2">{block.heading}</h3>}
                  <ul className="space-y-1.5">
                    {block.items.map((item) => (
                      <li key={item} className="flex gap-2 text-slate-600">
                        <span aria-hidden="true" className="text-brand-sky mt-1">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="flex items-center gap-2 text-2xl font-bold text-brand-navy mb-6">
              <Award size={22} className="text-brand-blue" /> {t('program_page.exit_title')}
            </h2>
            <div className="bg-brand-mist border border-slate-200 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <BadgeCheck size={20} className="text-brand-blue" />
                <span className="font-bold text-brand-navy">{t('program_page.accredited')}</span>
              </div>
              <p className="text-sm text-slate-600 mb-4">{t('program_page.mfhea_full')}</p>
              <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div><dt className="text-slate-500 inline">{t('program_page.institution')}: </dt><dd className="inline font-semibold text-brand-navy">{t('program_page.institution_value')}</dd></div>
                <div><dt className="text-slate-500 inline">{t('program_page.license_number')}: </dt><dd className="inline font-semibold text-brand-navy">{t('program_page.license_number_value')}</dd></div>
                <div><dt className="text-slate-500 inline">{t('program_page.license_start')}: </dt><dd className="inline font-semibold text-brand-navy">{t('program_page.license_start_value')}</dd></div>
                <div><dt className="text-slate-500 inline">{t('program_page.license_end')}: </dt><dd className="inline font-semibold text-brand-navy">{t('program_page.license_end_value')}</dd></div>
                <div><dt className="text-slate-500 inline">{t('program_page.license_category')}: </dt><dd className="inline font-semibold text-brand-navy">{t('program_page.license_category_value')}</dd></div>
                <div><dt className="text-slate-500 inline">{t('program_page.programs_up_to')}: </dt><dd className="inline font-semibold text-brand-navy">{program.mqfCap}</dd></div>
              </dl>
            </div>
            {program.exitPoints.length > 0 && (
              <>
                <h3 className="font-bold text-brand-navy mb-4">{t('program_page.exit_points_title')}</h3>
                <div className="space-y-3">
                  {program.exitPoints.map((ep) => (
                    <div key={ep.name} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="font-semibold text-brand-navy">{ep.name}</span>
                        <span className="text-xs font-semibold bg-brand-mist text-brand-blue px-2 py-1 rounded whitespace-nowrap">{ep.ects}</span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{ep.desc}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-2xl font-bold text-brand-navy mb-4">
              <Building2 size={22} className="text-brand-blue" /> {t('program_page.info_title')}
            </h2>
            <dl className="space-y-2 text-sm">
              <div><dt className="text-slate-500 inline">{t('program_page.office')}: </dt><dd className="inline font-semibold text-brand-navy">{t('program_page.office_value')}</dd></div>
              <div><dt className="text-slate-500 inline">{t('program_page.training_sites')}: </dt><dd className="inline font-semibold text-brand-navy">{t('program_page.training_sites_value')}</dd></div>
              <div><dt className="text-slate-500 inline">{t('program_page.director')}: </dt><dd className="inline font-semibold text-brand-navy">{t('program_page.director_value')}</dd></div>
              <div><dt className="text-slate-500 inline">{t('program_page.legal_rep')}: </dt><dd className="inline font-semibold text-brand-navy">{t('program_page.legal_rep_value')}</dd></div>
            </dl>
          </section>
        </div>

        {/* Columna derecha (la que describe el cliente): detalles del curso,
            cualificación, información de estudio y fechas. Sticky en
            escritorio; en móvil baja al final del contenido. */}
        <aside className="lg:sticky lg:top-24 self-start bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <SidebarBlock
            title={t('program_page.details_title')}
            icon={Info}
            rows={[
              [t('program_page.category'), s.category],
              [t('program_page.duration'), s.duration],
              [t('program_page.modules_label'), s.modules],
              [t('program_page.ects'), s.ects],
            ]}
          />
          <div className="border-t border-slate-200 pt-5 mt-5">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-brand-navy mb-3">
              <GraduationCap size={15} className="text-brand-blue" /> {t('program_page.qualification_title')}
            </h3>
            <p className="font-semibold text-brand-navy text-sm">{s.qualification}</p>
            <p className="text-sm text-slate-500">{t('program_page.higher_ed')}</p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold bg-brand-mist text-brand-blue px-2 py-1 rounded">
              <BadgeCheck size={13} /> {t('program_page.accredited')}
            </p>
          </div>
          <SidebarBlock
            title={t('program_page.study_title')}
            icon={BookOpen}
            rows={[
              [t('program_page.attendance'), s.attendance],
              [t('program_page.delivery'), s.delivery],
              [t('program_page.language'), s.language],
            ]}
          />
          <SidebarBlock
            title={t('program_page.dates_title')}
            icon={CalendarDays}
            rows={[
              [t('program_page.enroll_open'), s.enrollOpen],
              [t('program_page.classes_start'), s.classesStart],
              [t('program_page.enroll_status'), s.enrollStatus],
            ]}
          />
        </aside>
      </div>
    </div>
  );
}
