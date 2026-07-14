import { useTranslation } from "react-i18next";
import { Cookie, Settings } from "lucide-react";
import { openCookieSettings } from "../lib/cookieConsent";

export default function CookiePolicy() {
  const { t } = useTranslation();

  const cookieTable = [
    {
      category: t("cookie_banner.necessary_title"),
      name: "malta_session",
      purpose: t("cookie_policy_page.row_session_purpose"),
      duration: t("cookie_policy_page.row_session_duration"),
    },
    {
      category: t("cookie_banner.necessary_title"),
      name: "malta_cookie_consent",
      purpose: t("cookie_policy_page.row_consent_purpose"),
      duration: t("cookie_policy_page.row_consent_duration"),
    },
    {
      category: t("cookie_policy_page.row_analytics_category"),
      name: "N/A",
      purpose: t("cookie_policy_page.row_analytics_purpose"),
      duration: "N/A",
    },
    {
      category: t("cookie_policy_page.row_marketing_category"),
      name: "N/A",
      purpose: t("cookie_policy_page.row_marketing_purpose"),
      duration: "N/A",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-emerald-50">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <Cookie className="text-amber-400" size={32} />
          <h1 className="text-3xl font-bold">{t("cookie_policy_page.title")}</h1>
        </div>
        <p className="text-emerald-300 mb-8 text-sm">{t("cookie_policy_page.last_updated")}</p>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">{t("cookie_policy_page.what_title")}</h2>
          <p className="text-emerald-200 leading-relaxed">{t("cookie_policy_page.what_body")}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">{t("cookie_policy_page.table_title")}</h2>
          <div className="overflow-x-auto rounded-lg border border-emerald-800/60">
            <table className="w-full text-sm text-left">
              <thead className="bg-emerald-900/60 text-emerald-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">{t("cookie_policy_page.table_category")}</th>
                  <th className="px-4 py-3 font-semibold">{t("cookie_policy_page.table_name")}</th>
                  <th className="px-4 py-3 font-semibold">{t("cookie_policy_page.table_purpose")}</th>
                  <th className="px-4 py-3 font-semibold">{t("cookie_policy_page.table_duration")}</th>
                </tr>
              </thead>
              <tbody>
                {cookieTable.map((c, i) => (
                  <tr key={i} className="border-t border-emerald-800/60 align-top">
                    <td className="px-4 py-3 text-emerald-100 whitespace-nowrap">{c.category}</td>
                    <td className="px-4 py-3 font-mono text-xs text-emerald-300">{c.name}</td>
                    <td className="px-4 py-3 text-emerald-300">{c.purpose}</td>
                    <td className="px-4 py-3 text-emerald-300 whitespace-nowrap">{c.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">{t("cookie_policy_page.legal_title")}</h2>
          <p className="text-emerald-200 leading-relaxed mb-3">{t("cookie_policy_page.legal_body_1")}</p>
          <p className="text-emerald-200 leading-relaxed">{t("cookie_policy_page.legal_body_2")}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">{t("cookie_policy_page.manage_title")}</h2>
          <button
            type="button"
            onClick={() => openCookieSettings()}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 px-6 py-3 rounded-lg font-semibold transition"
          >
            <Settings size={18} /> {t("cookie_policy_page.manage_button")}
          </button>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">{t("cookie_policy_page.browser_title")}</h2>
          <p className="text-emerald-200 leading-relaxed">{t("cookie_policy_page.browser_body")}</p>
        </section>
      </div>
    </div>
  );
}
