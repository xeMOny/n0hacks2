import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

// La web pública es estática (GitHub Pages, sin backend desplegado), así que
// el envío va por FormSubmit (formsubmit.co), que reenvía el POST por email
// a info@uclcampus.com. Requisitos para que entregue de verdad:
//   1. Que el buzón info@uclcampus.com exista (hPanel de Hostinger → Emails).
//   2. El PRIMER envío dispara un correo de activación de FormSubmit a ese
//      buzón — hay que abrirlo y pulsar "Activate". Desde entonces entrega
//      todos los envíos con normalidad.
// El endpoint /ajax devuelve JSON y permite quedarse en la página (el CSP de
// index.html incluye formsubmit.co en connect-src). Cuando el backend real
// se despliegue, basta con cambiar este fetch por POST /api/contact.
const ENDPOINT = 'https://formsubmit.co/ajax/info@uclcampus.com';

type Status = 'idle' | 'sending' | 'success' | 'error';

const inputClass =
  'w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-brand-navy placeholder:text-slate-400 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition';

export default function ContactForm() {
  const { t, i18n } = useTranslation();
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    // Honeypot: los bots rellenan todos los campos; los humanos no ven este.
    if (data.get('_honey')) return;
    setStatus('sending');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-xl p-10 text-center shadow-sm">
        <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-brand-blue" />
        <p className="text-lg font-semibold text-brand-navy">{t('contact_form.success')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl mx-auto bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm text-left">
      {/* Metadatos para FormSubmit: asunto identificable y sin tabla HTML */}
      <input type="hidden" name="_subject" value="Nueva consulta desde uclcampus.com" />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="idioma" value={i18n.resolvedLanguage || 'es'} />
      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <label className="block">
          <span className="block text-sm font-semibold text-brand-navy mb-1.5">{t('contact_form.name')}</span>
          <input type="text" name="nombre" required autoComplete="given-name" className={inputClass} />
        </label>
        <label className="block">
          <span className="block text-sm font-semibold text-brand-navy mb-1.5">{t('contact_form.surname')}</span>
          <input type="text" name="apellidos" required autoComplete="family-name" className={inputClass} />
        </label>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <label className="block">
          <span className="block text-sm font-semibold text-brand-navy mb-1.5">{t('contact_form.email')}</span>
          <input type="email" name="email" required autoComplete="email" className={inputClass} />
        </label>
        <label className="block">
          <span className="block text-sm font-semibold text-brand-navy mb-1.5">{t('contact_form.country')}</span>
          <input type="text" name="pais" required autoComplete="country-name" className={inputClass} />
        </label>
      </div>
      <label className="block mb-6">
        <span className="block text-sm font-semibold text-brand-navy mb-1.5">{t('contact_form.message')}</span>
        <textarea name="consulta" required rows={5} className={inputClass} />
      </label>

      {status === 'error' && (
        <p role="alert" className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
          <AlertCircle size={18} className="shrink-0 mt-0.5" /> {t('contact_form.error')}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full inline-flex items-center justify-center gap-2 bg-brand-blue hover:bg-brand-navy disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition"
      >
        <Send size={17} />
        {status === 'sending' ? t('contact_form.sending') : t('contact_form.submit')}
      </button>
    </form>
  );
}
