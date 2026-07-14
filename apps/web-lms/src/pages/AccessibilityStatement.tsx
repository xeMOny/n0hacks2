import { useTranslation } from "react-i18next";
import { Accessibility } from "lucide-react";

export default function AccessibilityStatement() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-emerald-50">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <Accessibility className="text-amber-400" size={32} />
          <h1 className="text-3xl font-bold">{t("accessibility_page.title")}</h1>
        </div>
        <p className="text-emerald-300 mb-8 text-sm">{t("accessibility_page.last_updated")}</p>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">{t("accessibility_page.commitment_title")}</h2>
          <p className="text-emerald-200 leading-relaxed">{t("accessibility_page.commitment_body")}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">{t("accessibility_page.status_title")}</h2>
          <p className="text-emerald-200 leading-relaxed">{t("accessibility_page.status_body")}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">{t("accessibility_page.contact_title")}</h2>
          <p className="text-emerald-200 leading-relaxed">
            {t("accessibility_page.contact_body")}{" "}
            <a href="mailto:info@uclcampus.com" className="underline hover:text-amber-400 transition">info@uclcampus.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
