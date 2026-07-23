import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Play } from 'lucide-react';

// Convierte una URL (o ID) de YouTube/Vimeo en la URL de incrustación del
// reproductor. Soporta las dos plataformas para no atarnos a ninguna: cada
// vídeo puede ser de una u otra. Devuelve null si la URL no se reconoce (o
// está vacía), y en ese caso el componente no pinta nada.
function toEmbed(url: string): string | null {
  const u = (url || '').trim();
  if (!u) return null;
  let m = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})/);
  if (m) return `https://www.youtube-nocookie.com/embed/${m[1]}?autoplay=1&rel=0`;
  if (/^[\w-]{11}$/.test(u)) return `https://www.youtube-nocookie.com/embed/${u}?autoplay=1&rel=0`;
  m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (m) return `https://player.vimeo.com/video/${m[1]}?autoplay=1&dnt=1`;
  return null;
}

// Reproductor 16:9 responsive con "fachada": hasta que el usuario pulsa play
// solo se ve una portada de marca (sin cargar nada de terceros ni cookies).
// Al pulsar, carga el iframe del reproductor. Así es respetuoso con el RGPD
// (no hay cookies de YouTube/Vimeo hasta que el usuario decide ver el vídeo).
export default function VideoEmbed({ url, title }: { url?: string; title?: string }) {
  const { t } = useTranslation();
  const [play, setPlay] = useState(false);
  const embed = url ? toEmbed(url) : null;
  if (!embed) return null;
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-brand-navy shadow-sm">
      {play ? (
        <iframe
          src={embed}
          title={title || t('video.title')}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlay(true)}
          aria-label={title ? `${t('video.watch')}: ${title}` : t('video.watch')}
          className="group absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-navy via-brand-blue to-brand-sky"
        >
          <span className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/90 group-hover:bg-white group-hover:scale-105 transition shadow-lg">
            <Play size={30} className="text-brand-navy ml-1" fill="currentColor" />
          </span>
          {title && (
            <span className="absolute bottom-4 left-5 right-5 text-white font-semibold text-lg text-left drop-shadow">{title}</span>
          )}
        </button>
      )}
    </div>
  );
}
