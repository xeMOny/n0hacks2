import { useTranslation } from "react-i18next";
import { ShieldCheck } from "lucide-react";
import LegalPageLayout, { LegalSection } from "../components/LegalPageLayout";

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <LegalPageLayout
      icon={ShieldCheck}
      title={t("privacy_policy_page.title")}
      lastUpdated={t("privacy_policy_page.last_updated")}
    >
      <LegalSection title={t("privacy_policy_page.controller_title")}>
        <p>{t("privacy_policy_page.controller_body")}</p>
      </LegalSection>

      <LegalSection title={t("privacy_policy_page.data_title")}>
        <p>{t("privacy_policy_page.data_intro")}</p>
        <ul className="list-disc list-inside space-y-2">
          <li>{t("privacy_policy_page.data_identification")}</li>
          <li>{t("privacy_policy_page.data_account")}</li>
          <li>{t("privacy_policy_page.data_academic")}</li>
          <li>{t("privacy_policy_page.data_commercial")}</li>
          <li>{t("privacy_policy_page.data_technical")}</li>
        </ul>
      </LegalSection>

      <LegalSection title={t("privacy_policy_page.purpose_title")}>
        <ul className="list-disc list-inside space-y-2">
          <li>{t("privacy_policy_page.purpose_1")}</li>
          <li>{t("privacy_policy_page.purpose_2")}</li>
          <li>{t("privacy_policy_page.purpose_3")}</li>
          <li>{t("privacy_policy_page.purpose_4")}</li>
          <li>{t("privacy_policy_page.purpose_5")}</li>
        </ul>
      </LegalSection>

      <LegalSection title={t("privacy_policy_page.legalbasis_title")}>
        <p>{t("privacy_policy_page.legalbasis_body")}</p>
      </LegalSection>

      <LegalSection title={t("privacy_policy_page.retention_title")}>
        <p>{t("privacy_policy_page.retention_body")}</p>
      </LegalSection>

      <LegalSection title={t("privacy_policy_page.recipients_title")}>
        <p>{t("privacy_policy_page.recipients_body")}</p>
      </LegalSection>

      <LegalSection title={t("privacy_policy_page.security_title")}>
        <p>{t("privacy_policy_page.security_body")}</p>
      </LegalSection>

      <LegalSection title={t("privacy_policy_page.rights_title")}>
        <p>
          {t("privacy_policy_page.rights_intro")} <a href="mailto:info@uclcampus.com" className="underline text-brand-blue hover:text-brand-navy transition">info@uclcampus.com</a>.
        </p>
        <p>{t("privacy_policy_page.rights_outro")}</p>
      </LegalSection>

      <LegalSection title={t("privacy_policy_page.minors_title")}>
        <p>{t("privacy_policy_page.minors_body")}</p>
      </LegalSection>

      <LegalSection title={t("privacy_policy_page.changes_title")}>
        <p>{t("privacy_policy_page.changes_body")}</p>
      </LegalSection>
    </LegalPageLayout>
  );
}
