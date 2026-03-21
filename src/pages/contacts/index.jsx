import React from "react";
import styles from "./Contacts.module.scss";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

export const Contacts = () => {
  const { t, language } = useLanguage();
  const bookingNotes = {
    fi: "Ajanvaraus on pakollinen ennen vastaanottoa. Maanantaista perjantaihin tyoskentelemme klo 11:00-19:00. Lauantai ja sunnuntai suljettu.",
    en: "Booking is required before the appointment. We work Monday to Friday from 11:00 to 19:00. Saturday and Sunday are closed.",
    ru: "Запись обязательна перед приёмом. С понедельника по пятницу мы работаем с 11:00 до 19:00. Суббота и воскресенье закрыто.",
  };

  return (
    <div className={styles.contacts}>
      <h1>{t("contacts.title")}</h1>

      <div className={styles.mapContainer}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1984.789!2d24.8956291!3d60.2129865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4692095efffe9f29%3A0x6ed3be6f772231cc!2sLetti%20dreads!5e0!3m2!1sen!2sfi!4v1703123456789!5m2!1sen!2sfi"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Letti Dreads Location"
        ></iframe>
        <a
          href="https://www.google.com/maps/place/Letti+dreads/@60.2129865,24.8956291,17z/data=!3m1!4b1!4m6!3m5!1s0x4692095efffe9f29:0x6ed3be6f772231cc!8m2!3d60.2129839!4d24.898204!16s%2Fg%2F11z0vb0428?entry=ttu&g_ep=EgoyMDI2MDMwMi4wIKXMDSoASAFQAw%3D%3D"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.mapLink}
        >
          {t("contacts.openMaps")}
        </a>
      </div>

      <div className={styles.infoSection}>
        <div className={styles.infoCard}>
          <h2>{t("contacts.contactInfo")}</h2>
          <div className={styles.contactInfo}>
            <div className={styles.infoItem}>
              <strong>{t("contacts.address")}:</strong>
              <p>Kauppalantie 26, 00320 Helsinki, Suomi</p>
            </div>
            <div className={styles.infoItem}>
              <strong>{t("contacts.phone")}:</strong>
              <p>
                <a href="tel:+358401234567">+358 40 123 4567</a>
              </p>
            </div>
            <div className={styles.infoItem}>
              <strong>{t("contacts.email")}:</strong>
              <p>
                <a href="mailto:letti.dreads@gmail.com">
                  letti.dreads@gmail.com
                </a>
              </p>
            </div>
            <div className={styles.infoItem}>
              <strong>{t("contacts.website")}:</strong>
              <p>
                <a
                  href="https://www.lettidreads.fi"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.lettidreads.fi
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className={styles.infoCard}>
          <h2>{t("contacts.openingHours")}</h2>
          <p className={styles.bookingNote}>
            {bookingNotes[language] || bookingNotes.en}
          </p>
          <div className={styles.hours}>
            <ul>
              <li>
                <strong>{t("contacts.monday")}:</strong> <span>11:00 - 19:00</span>
              </li>
              <li>
                <strong>{t("contacts.tuesday")}:</strong> <span>11:00 - 19:00</span>
              </li>
              <li>
                <strong>{t("contacts.wednesday")}:</strong> <span>11:00 - 19:00</span>
              </li>
              <li>
                <strong>{t("contacts.thursday")}:</strong> <span>11:00 - 19:00</span>
              </li>
              <li>
                <strong>{t("contacts.friday")}:</strong> <span>11:00 - 19:00</span>
              </li>
              <li>
                <strong>{t("contacts.saturday")}:</strong> <span>{t("contacts.closed")}</span>
              </li>
              <li>
                <strong>{t("contacts.sunday")}:</strong> <span>{t("contacts.closed")}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
