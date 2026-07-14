import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, Check } from "lucide-react";
import { getConsent, saveConsent, onOpenCookieSettings } from "../lib/cookieConsent";

export default function CookieConsent() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [choice, setChoice] = useState<{ necessary: boolean; analytics: boolean; marketing: boolean }>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  const categories = [
    { key: "necessary" as const, title: t("cookie_banner.necessary_title"), desc: t("cookie_banner.necessary_desc"), locked: true },
    { key: "analytics" as const, title: t("cookie_banner.analytics_title"), desc: t("cookie_banner.analytics_desc"), locked: false },
    { key: "marketing" as const, title: t("cookie_banner.marketing_title"), desc: t("cookie_banner.marketing_desc"), locked: false },
  ];

  useEffect(() => {
    if (!getConsent()) setVisible(true);
    return onOpenCookieSettings(() => {
      setVisible(true);
      setShowSettings(true);
    });
  }, []);

  function acceptAll() {
    saveConsent({ analytics: true, marketing: true });
    setVisible(false);
    setShowSettings(false);
  }

  function rejectAll() {
    saveConsent({ analytics: false, marketing: false });
    setVisible(false);
    setShowSettings(false);
  }

  function saveCustom() {
    saveConsent(choice);
    setVisible(false);
    setShowSettings(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 inset-x-0 z-[100] p-4"
        >
          <div className="relative max-w-3xl mx-auto bg-emerald-950 border border-emerald-700/60 rounded-xl shadow-2xl shadow-black/40 overflow-hidden">
            <div className="p-5">
              <div className="flex items-start gap-3">
                <Cookie className="text-amber-400 shrink-0 mt-0.5" size={22} />
                <div className="flex-1">
                  <h2 className="font-bold mb-1">{t("cookie_banner.title")}</h2>
                  <p className="text-sm text-emerald-300">
                    {t("cookie_banner.description_pre")}{" "}
                    <span className="text-amber-400">{t("cookie_banner.cookie_settings")}</span>{" "}
                    {t("cookie_banner.description_mid")}{" "}
                    <a href="/cookies" className="underline hover:text-amber-400 transition">
                      {t("cookie_banner.cookie_policy")}
                    </a>
                    .
                  </p>
                </div>
              </div>

              {showSettings && (
                <div className="mt-5 space-y-3 border-t border-emerald-800/60 pt-4">
                  {categories.map((c) => (
                    <div key={c.key} className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-semibold text-sm">{c.title}</div>
                        <p className="text-xs text-emerald-400">{c.desc}</p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={c.locked ? true : choice[c.key]}
                        disabled={c.locked}
                        onClick={() => setChoice((prev) => ({ ...prev, [c.key]: !prev[c.key] }))}
                        className={`shrink-0 w-11 h-6 rounded-full transition relative ${
                          c.locked || choice[c.key] ? "bg-amber-500" : "bg-emerald-800"
                        } ${c.locked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <span
                          className={`absolute top-0.5 w-5 h-5 rounded-full bg-emerald-950 transition ${
                            c.locked || choice[c.key] ? "left-5" : "left-0.5"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">
                {!showSettings && (
                  <button
                    type="button"
                    onClick={() => setShowSettings(true)}
                    className="text-sm text-emerald-300 hover:text-amber-400 transition sm:mr-auto"
                  >
                    {t("cookie_banner.personalize")}
                  </button>
                )}
                <button
                  type="button"
                  onClick={rejectAll}
                  className="px-5 py-2 rounded-lg text-sm font-semibold border border-emerald-700 text-emerald-100 hover:bg-emerald-900 transition"
                >
                  {t("cookie_banner.reject")}
                </button>
                {showSettings ? (
                  <button
                    type="button"
                    onClick={saveCustom}
                    className="inline-flex items-center justify-center gap-1 px-5 py-2 rounded-lg text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-emerald-950 transition"
                  >
                    <Check size={16} /> {t("cookie_banner.save_preferences")}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={acceptAll}
                    className="px-5 py-2 rounded-lg text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-emerald-950 transition"
                  >
                    {t("cookie_banner.accept_all")}
                  </button>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={rejectAll}
              aria-label={t("cookie_banner.close")}
              title={t("cookie_banner.close")}
              className="absolute top-3 right-3 text-emerald-500 hover:text-amber-400 transition"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
