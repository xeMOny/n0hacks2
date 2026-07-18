import { useTranslation } from "react-i18next";
import { Accessibility } from "lucide-react";
import LegalPageLayout, { LegalSection } from "../components/LegalPageLayout";

export default function AccessibilityStatement() {
  const { t } = useTranslation();

  return (
    <LegalPageLayout
      icon={Accessibility}
      title={t("accessibility_page.title")}
      path="/accesibilidad/"
      lastUpdated={t("accessibility_page.last_updated")}
    >
      <LegalSection title={t("accessibility_page.commitment_title")}>
        <p>{t("accessibility_page.commitment_body")}</p>
      </LegalSection>

      <LegalSection title={t("accessibility_page.status_title")}>
        <p>{t("accessibility_page.status_body")}</p>
      </LegalSection>

      <LegalSection title={t("accessibility_page.contact_title")}>
        <p>
          {t("accessibility_page.contact_body")}{" "}
          <a href="mailto:info@uclcampus.com" className="underline text-brand-blue hover:text-brand-navy transition">info@uclcampus.com</a>.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
