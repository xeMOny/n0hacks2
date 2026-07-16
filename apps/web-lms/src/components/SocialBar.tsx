import type { ComponentType, SVGProps } from 'react';
import { X } from 'lucide-react';

type IconProps = SVGProps<SVGSVGElement>;

const iconBase = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function Instagram(props: IconProps) {
  return (
    <svg {...iconBase} {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function Linkedin(props: IconProps) {
  return (
    <svg {...iconBase} {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function Facebook(props: IconProps) {
  return (
    <svg {...iconBase} {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function Youtube(props: IconProps) {
  return (
    <svg {...iconBase} {...props}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  );
}

// Sin cuentas de marca reales todavía: por instrucción expresa, cada entrada
// apunta a la pantalla de login genérica de la plataforma en vez de a un
// perfil real (que no existe) o quedar inerte. En cuanto el cliente facilite
// los perfiles reales, basta con cambiar la url por la del perfil real.
export const SOCIAL_LINKS: { id: string; label: string; Icon: ComponentType<IconProps>; url: string | null }[] = [
  { id: 'instagram', label: 'Instagram', Icon: Instagram, url: 'https://www.instagram.com/accounts/login/' },
  { id: 'linkedin', label: 'LinkedIn', Icon: Linkedin, url: 'https://www.linkedin.com/login' },
  { id: 'facebook', label: 'Facebook', Icon: Facebook, url: 'https://www.facebook.com/login/' },
  { id: 'x', label: 'X (Twitter)', Icon: X, url: 'https://x.com/i/flow/login' },
  { id: 'youtube', label: 'YouTube', Icon: Youtube, url: 'https://accounts.google.com/ServiceLogin?service=youtube' },
];

export default function SocialBar() {
  return (
    <div className="bg-brand-navy">
      <div className="max-w-6xl mx-auto px-4 h-9 flex items-center gap-4">
        {SOCIAL_LINKS.map(({ id, label, Icon, url }) =>
          url ? (
            <a
              key={id}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-white/70 hover:text-brand-sky transition"
            >
              <Icon width={15} height={15} />
            </a>
          ) : (
            <span
              key={id}
              aria-hidden="true"
              title={`${label} — próximamente`}
              className="text-white/30 cursor-default"
            >
              <Icon width={15} height={15} />
            </span>
          ),
        )}
      </div>
    </div>
  );
}
