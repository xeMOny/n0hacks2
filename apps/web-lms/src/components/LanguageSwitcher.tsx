import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { Globe, Check } from "lucide-react";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "../i18n";

const LABELS: Record<SupportedLanguage, { short: string; full: string }> = {
  es: { short: "ES", full: "Español" },
  en: { short: "EN", full: "English" },
  fr: { short: "FR", full: "Français" },
  it: { short: "IT", full: "Italiano" },
};

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
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
        className="appearance-none bg-white border border-slate-300 rounded-full pl-2.5 pr-3 py-1 flex items-center gap-1.5 text-brand-navy hover:text-brand-blue hover:border-brand-blue/60 transition text-xs font-medium"
      >
        <Globe size={14} />
        {LABELS[current].short}
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
                  <span>
                    <span className="font-semibold">{LABELS[lang].short}</span>
                    <span className="text-slate-400 ml-2">{LABELS[lang].full}</span>
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
