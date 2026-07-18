import { useTranslation } from "react-i18next";
import { Cookie, Settings } from "lucide-react";
import { openCookieSettings } from "../lib/cookieConsent";
import LegalPageLayout, { LegalSection } from "../components/LegalPageLayout";

export default function CookiePolicy() {
  const { t } = useTranslation();

  const cookieTable = [
    {
      category: t("cookie_banner.necessary_title"),
      name: "uclcampus_session",
      purpose: t("cookie_policy_page.row_session_purpose"),
      duration: t("cookie_policy_page.row_session_duration"),
    },
    {
      category: t("cookie_banner.necessary_title"),
      name: "uclcampus_cookie_consent",
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
    <LegalPageLayout
      icon={Cookie}
      title={t("cookie_policy_page.title")}
      path="/cookies/"
      lastUpdated={t("cookie_policy_page.last_updated")}
    >
      <LegalSection title={t("cookie_policy_page.what_title")}>
        <p>{t("cookie_policy_page.what_body")}</p>
      </LegalSection>

      <LegalSection title={t("cookie_policy_page.table_title")}>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-brand-mist text-brand-navy">
              <tr>
                <th className="px-4 py-3 font-semibold">{t("cookie_policy_page.table_category")}</th>
                <th className="px-4 py-3 font-semibold">{t("cookie_policy_page.table_name")}</th>
                <th className="px-4 py-3 font-semibold">{t("cookie_policy_page.table_purpose")}</th>
                <th className="px-4 py-3 font-semibold">{t("cookie_policy_page.table_duration")}</th>
              </tr>
            </thead>
            <tbody>
              {cookieTable.map((c, i) => (
                <tr key={i} className="border-t border-slate-200 align-top">
                  <td className="px-4 py-3 text-brand-navy whitespace-nowrap">{c.category}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{c.name}</td>
                  <td className="px-4 py-3 text-slate-600">{c.purpose}</td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{c.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection title={t("cookie_policy_page.legal_title")}>
        <p>{t("cookie_policy_page.legal_body_1")}</p>
        <p>{t("cookie_policy_page.legal_body_2")}</p>
      </LegalSection>

      <LegalSection title={t("cookie_policy_page.manage_title")}>
        <button
          type="button"
          onClick={() => openCookieSettings()}
          className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-navy text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          <Settings size={18} /> {t("cookie_policy_page.manage_button")}
        </button>
      </LegalSection>

      <LegalSection title={t("cookie_policy_page.browser_title")}>
        <p>{t("cookie_policy_page.browser_body")}</p>
      </LegalSection>
    </LegalPageLayout>
  );
}
