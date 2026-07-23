import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  BookOpen,
  Building2,
  BadgeCheck,
  Info,
  CalendarDays,
  GraduationCap,
  Users,
  Dumbbell,
  Apple,
  Stethoscope,
  Dna,
  Brain,
  ShieldCheck,
  Braces,
  Landmark,
  HeartHandshake,
  Scale,
  type LucideIcon,
} from 'lucide-react';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useLocalizedPath } from '../hooks/useLocalizedPath';
import LanguageSwitcher from '../components/LanguageSwitcher';
import logoHorizontal from '../assets/logo/logo-horizontal-uclcampus.svg';
import PROGRAM_SLUGS from '../data/programSlugs.json';
import DEPARTMENTS from '../data/departments.json';
import VideoEmbed from '../components/VideoEmbed';
import videos from '../data/videos.json';

// Títulos nuevos aún sin ficha completa (p. ej. grados de Ciencias de la Salud,
// varios en proceso de acreditación). Se muestran como "ficha en preparación"
// con el aviso de acreditación cuando corresponde. El contenido definitivo
// (plan de estudios, etc.) sustituirá este modo cuando el cliente lo envíe.
const STUBS: Record<string, { inAccreditation: boolean; deptId: string }> = {};
for (const d of DEPARTMENTS as { id: string; programs: { slug: string; stub?: boolean; inAccreditation?: boolean }[] }[]) {
  for (const p of d.programs) {
    if (p.stub) STUBS[p.slug] = { inAccreditation: !!p.inAccreditation, deptId: d.id };
  }
}

// Imagen temática del banner de cada título: un icono acorde a la disciplina
// (autocontenido, sin fotos externas), como marca de agua sobre el degradado
// de marca. Si el cliente envía fotos reales, se sustituye por <img>.
const PROGRAM_ICONS: Record<string, LucideIcon> = {
  'grado-ciencias-deporte': Dumbbell,
  'grado-nutricion-dietetica': Apple,
  'grado-medicina': Stethoscope,
  'grado-biomedicina': Dna,
  'master-psicologia-sanitaria': Brain,
  'master-seguridad-informacion': ShieldCheck,
  'master-programacion-java': Braces,
  'mba': Briefcase,
  'master-proyectos-europeos': Landmark,
  'master-non-profit': HeartHandshake,
  'doctorado-derecho-criminologia': Scale,
};

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
  const [stub, setStub] = useState(false);
  const [tab, setTab] = useState('descripcion');
  const stubInfo = slug ? STUBS[slug] : undefined;
  const BannerIcon = PROGRAM_ICONS[slug || ''] || GraduationCap;
  const programVideo = (videos as Record<string, string>)[slug || ''] || '';

  useEffect(() => {
    setProgram(null);
    setMissing(false);
    setStub(false);
    if (slug && STUBS[slug]) {
      setStub(true);
      return;
    }
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

  const stubTitle = stubInfo ? (t(`offer.titles.${slug}`) as string) : '';
  useDocumentMeta(
    program ? `${program.title} · UCLCampus` : (stubInfo ? `${stubTitle} · UCLCampus` : 'UCLCampus'),
    `/oferta/${slug}/`,
    program?.description || (stubInfo ? (t('offer.stub_body') as string) : undefined),
  );

  if (stub && stubInfo) {
    const deptName = t(`offer.dept_names.${stubInfo.deptId}`) as string;
    return (
      <div className="min-h-screen bg-white text-slate-700">
        <header className="sticky top-0 bg-white/95 backdrop-blur z-50 border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
            <Link to={lp('/')} className="shrink-0 flex items-center">
              <img src={logoHorizontal} alt="UCL Campus Malta" className="h-8 md:h-9 w-auto" />
            </Link>
            <div className="flex items-center gap-4">
              <Link to={lp('/') + '#cursos'} className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand-navy hover:text-brand-blue transition">
                <ArrowLeft size={15} /> {t('program_page.back')}
              </Link>
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        <section className="relative overflow-hidden bg-gradient-to-br from-brand-navy via-brand-blue to-brand-sky text-white">
          <BannerIcon aria-hidden="true" className="absolute -right-8 -bottom-10 text-white/10 pointer-events-none" size={240} strokeWidth={1.25} />
          <div className="relative max-w-4xl mx-auto px-4 py-14 md:py-20">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-sky mb-3">{deptName}</p>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{stubTitle}</h1>
            {stubInfo.inAccreditation && (
              <span className="inline-block mt-5 text-xs font-semibold uppercase tracking-wide text-white bg-white/15 border border-white/30 rounded-full px-3 py-1.5">
                {t('offer.in_accreditation')}
              </span>
            )}
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-12">
          {programVideo && (
            <div className="mb-8">
              <VideoEmbed url={programVideo} title={stubTitle} />
            </div>
          )}
          {stubInfo.inAccreditation && (
            <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
              <Info size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-900 leading-relaxed">{t('offer.accreditation_notice')}</p>
            </div>
          )}
          <p className="text-slate-600 leading-relaxed mb-8">{t('offer.stub_body')}</p>
          <div className="bg-brand-navy rounded-xl p-8 text-center">
            <p className="text-xl font-bold text-white mb-4">{t('program_page.enroll_banner')}</p>
            <Link
              to={lp('/') + '#contacto'}
              className="inline-flex items-center gap-2 bg-white hover:bg-brand-mist text-brand-navy px-8 py-3 rounded-lg font-bold transition"
            >
              {t('offer.stub_cta')} <ArrowRight size={18} />
            </Link>
          </div>
          <div className="mt-10">
            <Link to={lp('/') + '#cursos'} className="inline-flex items-center gap-1.5 text-brand-blue hover:text-brand-navy font-semibold transition">
              <ArrowLeft size={16} /> {t('program_page.back')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            <img src={logoHorizontal} alt="UCL Campus Malta" className="h-8 md:h-9 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <Link to={lp('/') + '#cursos'} className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand-navy hover:text-brand-blue transition">
              <ArrowLeft size={15} /> {t('program_page.back')}
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Banner del título con imagen temática (icono de la disciplina como
          marca de agua sobre el degradado de marca). */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-navy via-brand-blue to-brand-sky text-white">
        <BannerIcon aria-hidden="true" className="absolute -right-8 -bottom-10 text-white/10 pointer-events-none" size={260} strokeWidth={1.25} />
        <div className="relative max-w-6xl mx-auto px-4 py-14 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-sky mb-3">{program.category} · {s.qualification}</p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight max-w-4xl">{program.title}</h1>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 grid lg:grid-cols-[1fr_20rem] gap-12">
        {/* Contenido principal */}
        <div className="min-w-0">
          {/* Pestañas (pedidas por el cliente). Todos los paneles se
              renderizan y solo se oculta el inactivo (hidden): así el HTML
              prerenderizado contiene todo el contenido aunque el JS falle. */}
          <div role="tablist" aria-label={program.title} className="flex flex-nowrap border-b border-slate-200 mb-8 overflow-x-auto">
            {([
              ['descripcion', t('program_page.tab_description')],
              ['plan', t('program_page.tab_plan')],
              ['profesores', t('program_page.tab_faculty')],
              ['requisitos', t('program_page.tab_admission')],
              ['certificaciones', t('program_page.tab_certifications')],
              ['salidas', t('program_page.tab_careers')],
            ] as const).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={`whitespace-nowrap px-2 py-2.5 text-[13px] font-semibold rounded-t-lg border-b-2 -mb-px transition ${
                  tab === id
                    ? 'border-brand-blue text-brand-blue'
                    : 'border-transparent text-slate-500 hover:text-brand-navy'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Descripción */}
          <div role="tabpanel" hidden={tab !== 'descripcion'}>
            {programVideo && (
              <div className="mb-8">
                <VideoEmbed url={programVideo} title={program.title} />
              </div>
            )}
            <p className="text-slate-600 leading-relaxed">{program.description}</p>
          </div>

          {/* Plan de estudios */}
          <div role="tabpanel" hidden={tab !== 'plan'} className="space-y-4">
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

          {/* Profesores (pendiente de contenido del cliente) */}
          <div role="tabpanel" hidden={tab !== 'profesores'}>
            <div className="flex gap-3 bg-brand-mist border border-slate-200 rounded-xl p-6">
              <Users size={20} className="text-brand-blue shrink-0 mt-0.5" />
              <p className="text-slate-600 leading-relaxed">{t('program_page.faculty_pending')}</p>
            </div>
          </div>

          {/* Requisitos de acceso */}
          <div role="tabpanel" hidden={tab !== 'requisitos'} className="space-y-5">
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

          {/* Certificaciones obtenidas: acreditación MFHEA + salidas
              intermedias + información de la institución licenciada. */}
          <div role="tabpanel" hidden={tab !== 'certificaciones'}>
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
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h3 className="flex items-center gap-2 font-bold text-brand-navy mb-4">
                <Building2 size={18} className="text-brand-blue" /> {t('program_page.info_title')}
              </h3>
              <dl className="space-y-2 text-sm">
                <div><dt className="text-slate-500 inline">{t('program_page.office')}: </dt><dd className="inline font-semibold text-brand-navy">{t('program_page.office_value')}</dd></div>
                <div><dt className="text-slate-500 inline">{t('program_page.training_sites')}: </dt><dd className="inline font-semibold text-brand-navy">{t('program_page.training_sites_value')}</dd></div>
                <div><dt className="text-slate-500 inline">{t('program_page.director')}: </dt><dd className="inline font-semibold text-brand-navy">{t('program_page.director_value')}</dd></div>
                <div><dt className="text-slate-500 inline">{t('program_page.legal_rep')}: </dt><dd className="inline font-semibold text-brand-navy">{t('program_page.legal_rep_value')}</dd></div>
              </dl>
            </div>
          </div>

          {/* Salidas laborales */}
          <div role="tabpanel" hidden={tab !== 'salidas'}>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
              {program.careers.map((c) => (
                <li key={c} className="flex gap-2 text-slate-600">
                  <span aria-hidden="true" className="text-brand-sky mt-1">•</span> {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Banner de matrícula (persistente bajo las pestañas): mientras no
              exista una hoja de matrícula real, lleva al formulario de contacto. */}
          <section className="mt-10 bg-brand-navy rounded-xl p-8 text-center">
            <p className="text-xl font-bold text-white mb-4">{t('program_page.enroll_banner')}</p>
            <Link
              to={lp('/') + '#contacto'}
              className="inline-flex items-center gap-2 bg-white hover:bg-brand-mist text-brand-navy px-8 py-3 rounded-lg font-bold transition"
            >
              {t('program_page.enroll_banner_cta')} <ArrowRight size={18} />
            </Link>
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
