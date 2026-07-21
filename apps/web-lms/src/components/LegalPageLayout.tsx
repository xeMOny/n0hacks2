import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useLocalizedPath } from '../hooks/useLocalizedPath';

interface LegalPageLayoutProps {
  icon: LucideIcon;
  title: string;
  /** Ruta pública real (con barra final: así resuelve GitHub Pages), p.ej. "/privacidad/" */
  path: string;
  lastUpdated: string;
  children: ReactNode;
}

// Layout compartido por las 4 páginas legales (antes cada una repetía el
// mismo wrapper con la paleta oscura vieja, ya reemplazada por brand-navy/blue
// en el resto del sitio).
export default function LegalPageLayout({ icon: Icon, title, path, lastUpdated, children }: LegalPageLayoutProps) {
  const { t } = useTranslation();
  const lp = useLocalizedPath();
  useDocumentMeta(`${title} · UCLCampus`, path);
  return (
    <div className="min-h-screen bg-white text-slate-700">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link to={lp('/')} className="inline-flex items-center gap-1.5 text-sm text-brand-blue hover:text-brand-navy transition mb-8">
          <ArrowLeft size={16} /> {t('common.back_to_home')}
        </Link>
        <div className="flex items-center gap-3 mb-6">
          <Icon className="text-brand-blue" size={32} />
          <h1 className="text-3xl font-bold text-brand-navy">{title}</h1>
        </div>
        <p className="text-slate-500 mb-8 text-sm">{lastUpdated}</p>
        {children}
      </div>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-3 text-brand-navy">{title}</h2>
      <div className="text-slate-600 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}
