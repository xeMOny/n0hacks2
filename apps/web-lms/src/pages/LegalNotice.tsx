import { useTranslation } from "react-i18next";
import { Scale } from "lucide-react";

export default function LegalNotice() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-emerald-50">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <Scale className="text-amber-400" size={32} />
          <h1 className="text-3xl font-bold">{t("legal_notice_page.title")}</h1>
        </div>
        <p className="text-emerald-300 mb-8 text-sm">{t("legal_notice_page.last_updated")}</p>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">{t("legal_notice_page.identity_title")}</h2>
          <p className="text-emerald-200 leading-relaxed">{t("legal_notice_page.identity_body")}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">{t("legal_notice_page.purpose_title")}</h2>
          <p className="text-emerald-200 leading-relaxed">{t("legal_notice_page.purpose_body")}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">{t("legal_notice_page.ip_title")}</h2>
          <p className="text-emerald-200 leading-relaxed">{t("legal_notice_page.ip_body")}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">{t("legal_notice_page.liability_title")}</h2>
          <p className="text-emerald-200 leading-relaxed">{t("legal_notice_page.liability_body")}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">{t("legal_notice_page.law_title")}</h2>
          <p className="text-emerald-200 leading-relaxed">{t("legal_notice_page.law_body")}</p>
        </section>
      </div>
    </div>
  );
}
