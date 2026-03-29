import { Link } from "react-router-dom";
import styles from "./footer.module.scss";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

const contactLinks = {
  phone: "+358 40 123 4567",
  email: "letti.dreads@gmail.com",
  website: "https://www.lettidreads.fi",
  maps:
    "https://www.google.com/maps/place/Letti+dreads/@60.2129865,24.8956291,17z/data=!3m1!4b1!4m6!3m5!1s0x4692095efffe9f29:0x6ed3be6f772231cc!8m2!3d60.2129839!4d24.898204!16s%2Fg%2F11z0vb0428?entry=ttu&g_ep=EgoyMDI2MDMwMi4wIKXMDSoASAFQAw%3D%3D",
};

export function Footer() {
  const { t, language } = useLanguage();
  const monFriLabel = language === "ru" ? "Пн-Пт" : language === "fi" ? "Ma-Pe" : "Mon-Fri";
  const faqLabel = language === "ru" ? "Экспертность" : "FAQ";
  const curlsOnMiniDreadLabel =
    language === "fi" ? "Kiharat pikku rastalla" : t("header.curlsOnMiniDread");

  return (
    <footer className={styles.footer}>
      <div className={styles.brandBlock}>
        <img
          src="/image_no_bg (1).png"
          alt="Letti Dreads Logo"
          className={styles.footerLogo}
        />
        <h2>Letti Dreads</h2>
        <p>{t("footer.brandText")}</p>
        <div className={styles.actionLinks}>
          <a href={`mailto:${contactLinks.email}`}>{t("footer.emailUs")}</a>
        </div>
      </div>

      <div className={styles.linkColumn}>
        <h3>{t("footer.navigation")}</h3>
        <ul className={styles.menuList}>
          <li>
            <Link to="/">{t("footer.home")}</Link>
          </li>
          <li>
            <Link to="/shop">{t("footer.shop")}</Link>
          </li>
          <li>
            <Link to="/instock">{t("header.instock")}</Link>
          </li>
          <li>
            <Link to="/faq">{faqLabel}</Link>
          </li>
          <li>
            <Link to="/contacts">{t("footer.contacts")}</Link>
          </li>
          <li>
            <Link to="/cart">{t("footer.cart")}</Link>
          </li>
        </ul>
      </div>

      <div className={styles.linkColumn}>
        <h3>{t("footer.shopCategories")}</h3>
        <ul className={styles.menuList}>
          <li>
            <Link to="/shop/smooth-dreads">{t("header.smoothDreads")}</Link>
          </li>
          <li>
            <Link to="/shop/textured-dreads">{t("header.texturedDreads")}</Link>
          </li>
          <li>
            <Link to="/shop/curls">{t("footer.curls")}</Link>
          </li>
          <li>
            <Link to="/shop/braids">{t("footer.braids")}</Link>
          </li>
          <li>
            <Link to="/shop/hair-on-braid">{t("header.hairOnBraid")}</Link>
          </li>
          <li>
            <Link to="/shop/curls-on-mini-dread">{curlsOnMiniDreadLabel}</Link>
          </li>
        </ul>
      </div>

      <div className={styles.infoColumn}>
        <h3>{t("footer.contact")}</h3>
        <ul className={styles.infoList}>
          <li>
            <span>{t("footer.address")}</span>
            <a
              href={contactLinks.maps}
              target="_blank"
              rel="noopener noreferrer"
            >
              Kauppalantie 26, 00320 Helsinki, Finland
            </a>
          </li>
          <li>
            <span>{t("footer.phone")}</span>
            <a href={`tel:${contactLinks.phone.replace(/\s+/g, "")}`}>
              {contactLinks.phone}
            </a>
          </li>
          <li>
            <span>{t("footer.email")}</span>
            <a href={`mailto:${contactLinks.email}`}>{contactLinks.email}</a>
          </li>
          <li>
            <span>{t("footer.website")}</span>
            <a
              href={contactLinks.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              lettidreads.fi
            </a>
          </li>
        </ul>
      </div>

      <div className={styles.infoColumn}>
        <h3>{t("footer.openingHours")}</h3>
        <ul className={styles.infoList}>
          <li>
            <span>{monFriLabel}</span>
            <p>11:00 - 19:00</p>
          </li>
          <li>
            <span>{t("footer.saturday")}</span>
            <p>{t("footer.closed")}</p>
          </li>
          <li>
            <span>{t("footer.sunday")}</span>
            <p>{t("footer.closed")}</p>
          </li>
        </ul>
      </div>

      <div className={styles.bottomBar}>
        <p>{t("footer.rights")}</p>
        <a href={contactLinks.maps} target="_blank" rel="noopener noreferrer">
          {t("footer.openMaps")}
        </a>
      </div>
    </footer>
  );
}
