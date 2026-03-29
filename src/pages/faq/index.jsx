import styles from "./Faq.module.scss";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

export function FAQ() {
  const { t, language } = useLanguage();
  const faqTitle = language === "ru" ? "Экспертность" : "FAQ";

  const items = [
    {
      question: t("faq.items.care.question"),
      answer: t("faq.items.care.answer"),
    },
    {
      question: t("faq.items.wash.question"),
      answer: t("faq.items.wash.answer"),
    },
    {
      question: t("faq.items.install.question"),
      answer: t("faq.items.install.answer"),
    },
    {
      question: t("faq.items.lifetime.question"),
      answer: t("faq.items.lifetime.answer"),
    },
  ];

  return (
    <div className={styles.faq}>
      <div className={styles.hero}>
        <h1>{faqTitle}</h1>
        <p>{t("faq.intro")}</p>
      </div>

      <div className={styles.content}>
        <div className={styles.tipCard}>
          <h2>{t("faq.quickTitle")}</h2>
          <p>{t("faq.quickText")}</p>
        </div>

        <div className={styles.list}>
          {items.map((item) => (
            <article key={item.question} className={styles.item}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
