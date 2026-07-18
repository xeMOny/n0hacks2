import { useTranslation } from "react-i18next";
import { Scale } from "lucide-react";
import LegalPageLayout, { LegalSection } from "../components/LegalPageLayout";

export default function LegalNotice() {
  const { t } = useTranslation();

  return (
    <LegalPageLayout
      icon={Scale}
      title={t("legal_notice_page.title")}
      path="/aviso-legal/"
      lastUpdated={t("legal_notice_page.last_updated")}
    >
      <LegalSection title={t("legal_notice_page.identity_title")}>
        <p>{t("legal_notice_page.identity_body")}</p>
      </LegalSection>

      <LegalSection title={t("legal_notice_page.purpose_title")}>
        <p>{t("legal_notice_page.purpose_body")}</p>
      </LegalSection>

      <LegalSection title={t("legal_notice_page.ip_title")}>
        <p>{t("legal_notice_page.ip_body")}</p>
      </LegalSection>

      <LegalSection title={t("legal_notice_page.liability_title")}>
        <p>{t("legal_notice_page.liability_body")}</p>
      </LegalSection>

      <LegalSection title={t("legal_notice_page.law_title")}>
        <p>{t("legal_notice_page.law_body")}</p>
      </LegalSection>
    </LegalPageLayout>
  );
}
