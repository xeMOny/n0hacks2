import { useTranslation } from "react-i18next";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-emerald-50">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="text-amber-400" size={32} />
          <h1 className="text-3xl font-bold">{t("privacy_policy_page.title")}</h1>
        </div>
        <p className="text-emerald-300 mb-8 text-sm">{t("privacy_policy_page.last_updated")}</p>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">{t("privacy_policy_page.controller_title")}</h2>
          <p className="text-emerald-200 leading-relaxed">{t("privacy_policy_page.controller_body")}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">{t("privacy_policy_page.data_title")}</h2>
          <p className="text-emerald-200 leading-relaxed mb-3">{t("privacy_policy_page.data_intro")}</p>
          <ul className="list-disc list-inside space-y-2 text-emerald-200">
            <li>{t("privacy_policy_page.data_identification")}</li>
            <li>{t("privacy_policy_page.data_account")}</li>
            <li>{t("privacy_policy_page.data_academic")}</li>
            <li>{t("privacy_policy_page.data_commercial")}</li>
            <li>{t("privacy_policy_page.data_technical")}</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">{t("privacy_policy_page.purpose_title")}</h2>
          <ul className="list-disc list-inside space-y-2 text-emerald-200">
            <li>{t("privacy_policy_page.purpose_1")}</li>
            <li>{t("privacy_policy_page.purpose_2")}</li>
            <li>{t("privacy_policy_page.purpose_3")}</li>
            <li>{t("privacy_policy_page.purpose_4")}</li>
            <li>{t("privacy_policy_page.purpose_5")}</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">{t("privacy_policy_page.legalbasis_title")}</h2>
          <p className="text-emerald-200 leading-relaxed">{t("privacy_policy_page.legalbasis_body")}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">{t("privacy_policy_page.retention_title")}</h2>
          <p className="text-emerald-200 leading-relaxed">{t("privacy_policy_page.retention_body")}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">{t("privacy_policy_page.recipients_title")}</h2>
          <p className="text-emerald-200 leading-relaxed">{t("privacy_policy_page.recipients_body")}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">{t("privacy_policy_page.security_title")}</h2>
          <p className="text-emerald-200 leading-relaxed">{t("privacy_policy_page.security_body")}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">{t("privacy_policy_page.rights_title")}</h2>
          <p className="text-emerald-200 leading-relaxed">
            {t("privacy_policy_page.rights_intro")} <a href="mailto:info@uclcampus.com" className="underline hover:text-amber-400 transition">info@uclcampus.com</a>.
          </p>
          <p className="text-emerald-200 leading-relaxed mt-3">{t("privacy_policy_page.rights_outro")}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">{t("privacy_policy_page.minors_title")}</h2>
          <p className="text-emerald-200 leading-relaxed">{t("privacy_policy_page.minors_body")}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">{t("privacy_policy_page.changes_title")}</h2>
          <p className="text-emerald-200 leading-relaxed">{t("privacy_policy_page.changes_body")}</p>
        </section>
      </div>
    </div>
  );
}
