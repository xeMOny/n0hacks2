import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { LANG_STORAGE_KEY, SUPPORTED_LANGUAGES, type SupportedLanguage } from "../i18n";
import { isPublicPath, localizedPath, stripLangPrefix } from "../i18n/urlLang";
import Flag from "./Flags";

const LABELS: Record<SupportedLanguage, { short: string; full: string }> = {
  es: { short: "ES", full: "Español" },
  en: { short: "EN", full: "English" },
  fr: { short: "FR", full: "Français" },
  it: { short: "IT", full: "Italiano" },
};

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = (i18n.resolvedLanguage?.slice(0, 2) as SupportedLanguage) || "es";

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function choose(lang: SupportedLanguage) {
    // En las páginas públicas cada idioma tiene URL propia (/en, /fr, /it) ya
    // prerenderizada en ese idioma: cambiar de idioma es ir a esa URL con una
    // carga completa, dejando antes la preferencia en localStorage (mismo
    // mecanismo que usa el detector de i18next al arrancar). Nada de
    // changeLanguage + navigate en la misma interacción: la carrera entre el
    // evento de i18next, la transición del router y el des/remontaje de
    // ForceLang podía dejar idioma y URL desincronizados.
    const base = stripLangPrefix(location.pathname);
    if (isPublicPath(base)) {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
      const target = localizedPath(base, lang);
      if (target !== location.pathname) {
        window.location.assign(target);
        return;
      }
    }
    i18n.changeLanguage(lang);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={LABELS[current].full}
        className="appearance-none bg-white border border-slate-300 rounded-full pl-2 pr-2.5 py-1 flex items-center gap-1.5 text-brand-navy hover:text-brand-blue hover:border-brand-blue/60 transition text-xs font-medium"
      >
        <Flag lang={current} />
        {LABELS[current].short}
        <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            role="listbox"
            className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-lg shadow-xl shadow-slate-300/40 overflow-hidden z-[70]"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <li key={lang}>
                <button
                  type="button"
                  role="option"
                  aria-selected={current === lang}
                  onClick={() => choose(lang)}
                  className="appearance-none bg-transparent w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm text-left text-brand-navy hover:bg-brand-mist hover:text-brand-blue transition"
                >
                  <span className="flex items-center gap-2.5">
                    <Flag lang={lang} />
                    <span className="font-semibold">{LABELS[lang].full}</span>
                  </span>
                  {current === lang && <Check size={14} className="text-brand-blue" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
