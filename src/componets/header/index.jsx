import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import {
  AVATAR_COLOR_OPTIONS,
  fetchLogout,
  updateUserAvatarColor,
} from "../../redux/slices/authSlice";
import { fetchLatestOrder } from "../../redux/slices/orderSlice";
import styles from "./Header.module.scss";
import { getCustomSetContent } from "../../pages/custom_set/content.js";
import { HOME_SECTION_IDS, getHomeSectionContent } from "../../pages/home/sectionContent.js";

const THEME_STORAGE_KEY = "letti-theme";
const THEMES = [
  "light",
  "dark",
  "burgundy",
  "olive",
  "forest",
  "sapphire",
  "plum",
  "terracotta",
  "graphite",
];
const DATE_LOCALES = {
  fi: "fi-FI",
  en: "en-GB",
  ru: "ru-RU",
  de: "de-DE",
  fr: "fr-FR",
  it: "it-IT",
  el: "el-GR",
  es: "es-ES",
  et: "et-EE",
  lv: "lv-LV",
  lt: "lt-LT",
  pl: "pl-PL",
};
const SETTINGS_TEXT = {
  fi: { settings: "Asetukset", theme: "Teema", lightTheme: "Vaalea", darkTheme: "Tumma", language: "Kieli", security: "Turvallisuus", passwordHidden: "Salasanaa ei voi näyttää turvallisuussyistä.", avatarColor: "Avatarin väri", logout: "Kirjaudu ulos" },
  en: { settings: "Settings", theme: "Theme", lightTheme: "Light", darkTheme: "Dark", language: "Language", security: "Security", passwordHidden: "Password cannot be shown for security reasons.", avatarColor: "Avatar color", logout: "Log out" },
  ru: { settings: "Настройки", theme: "Тема", lightTheme: "Светлая", darkTheme: "Тёмная", language: "Язык", security: "Безопасность", passwordHidden: "Пароль нельзя показать по соображениям безопасности.", avatarColor: "Цвет аватарки", logout: "Выйти" },
  de: { settings: "Einstellungen", theme: "Thema", lightTheme: "Hell", darkTheme: "Dunkel", language: "Sprache", security: "Sicherheit", passwordHidden: "Das Passwort kann aus Sicherheitsgründen nicht angezeigt werden.", avatarColor: "Avatarfarbe", logout: "Abmelden" },
  fr: { settings: "Paramètres", theme: "Thème", lightTheme: "Clair", darkTheme: "Sombre", language: "Langue", security: "Sécurité", passwordHidden: "Le mot de passe ne peut pas être affiché pour des raisons de sécurité.", avatarColor: "Couleur de l'avatar", logout: "Déconnexion" },
  it: { settings: "Impostazioni", theme: "Tema", lightTheme: "Chiaro", darkTheme: "Scuro", language: "Lingua", security: "Sicurezza", passwordHidden: "La password non può essere mostrata per motivi di sicurezza.", avatarColor: "Colore avatar", logout: "Esci" },
  el: { settings: "Ρυθμίσεις", theme: "Θέμα", lightTheme: "Ανοιχτό", darkTheme: "Σκούρο", language: "Γλώσσα", security: "Ασφάλεια", passwordHidden: "Ο κωδικός δεν μπορεί να εμφανιστεί για λόγους ασφαλείας.", avatarColor: "Χρώμα avatar", logout: "Αποσύνδεση" },
  es: { settings: "Ajustes", theme: "Tema", lightTheme: "Claro", darkTheme: "Oscuro", language: "Idioma", security: "Seguridad", passwordHidden: "La contraseña no puede mostrarse por motivos de seguridad.", avatarColor: "Color del avatar", logout: "Cerrar sesión" },
  et: { settings: "Seaded", theme: "Teema", lightTheme: "Hele", darkTheme: "Tume", language: "Keel", security: "Turvalisus", passwordHidden: "Parooli ei saa turvalisuse tõttu näidata.", avatarColor: "Avatari värv", logout: "Logi välja" },
  lv: { settings: "Iestatījumi", theme: "Tēma", lightTheme: "Gaiša", darkTheme: "Tumša", language: "Valoda", security: "Drošība", passwordHidden: "Paroli nevar parādīt drošības dēļ.", avatarColor: "Avatara krāsa", logout: "Iziet" },
  lt: { settings: "Nustatymai", theme: "Tema", lightTheme: "Šviesi", darkTheme: "Tamsi", language: "Kalba", security: "Saugumas", passwordHidden: "Slaptažodis negali būti rodomas saugumo sumetimais.", avatarColor: "Avataro spalva", logout: "Atsijungti" },
  pl: { settings: "Ustawienia", theme: "Motyw", lightTheme: "Jasny", darkTheme: "Ciemny", language: "Język", security: "Bezpieczeństwo", passwordHidden: "Hasło nie może być pokazane ze względów bezpieczeństwa.", avatarColor: "Kolor awatara", logout: "Wyloguj się" },
};
const THEME_LABELS = {
  fi: { light: "Vaalea", dark: "Tumma", burgundy: "Viininpunainen", olive: "Oliivi" },
  en: {
    light: "Light",
    dark: "Dark",
    burgundy: "Burgundy",
    olive: "Olive",
    forest: "Forest",
    sapphire: "Sapphire",
    plum: "Plum",
    terracotta: "Terracotta",
    graphite: "Graphite",
  },
  ru: { light: "Ð¡Ð²ÐµÑ‚Ð»Ð°Ñ", dark: "Ð¢Ñ‘Ð¼Ð½Ð°Ñ", burgundy: "Ð‘Ð¾Ñ€Ð´Ð¾Ð²Ð°Ñ", olive: "ÐžÐ»Ð¸Ð²ÐºÐ¾Ð²Ð°Ñ" },
  de: { light: "Hell", dark: "Dunkel", burgundy: "Bordeaux", olive: "Oliv" },
  fr: { light: "Clair", dark: "Sombre", burgundy: "Bordeaux", olive: "Olive" },
  it: { light: "Chiaro", dark: "Scuro", burgundy: "Bordeaux", olive: "Oliva" },
  el: { light: "Î‘Î½Î¿Î¹Ï‡Ï„ÏŒ", dark: "Î£ÎºÎ¿ÏÏÎ¿", burgundy: "ÎœÏ€Î¿ÏÎ½Ï„ÏŒ", olive: "Î›Î±Î´Î¯" },
  es: { light: "Claro", dark: "Oscuro", burgundy: "Burdeos", olive: "Oliva" },
  et: { light: "Hele", dark: "Tume", burgundy: "Bordoo", olive: "Oliiv" },
  lv: { light: "GaiÅ¡a", dark: "TumÅ¡a", burgundy: "Bordo", olive: "OlÄ«vu" },
  lt: { light: "Å viesi", dark: "Tamsi", burgundy: "Bordo", olive: "AlyvuogiÅ³" },
  pl: { light: "Jasny", dark: "Ciemny", burgundy: "Bordowy", olive: "Oliwkowy" },
};

const ORDER_STATUS_TEXT = {
  fi: { link: "Tilauksen vaihe", title: "Tilauksen vaihe", date: "Tilattu", status: "Vaihe", processing: "Tilauksesi käsitellään", assembling: "Tilauksesi kootaan", in_transit: "Tilauksesi on matkalla", ready_for_pickup: "Tilauksesi odottaa noutoa", empty: "Ei vielä tehtyjä tilauksia." },
  en: { link: "Order status", title: "Order status", date: "Ordered", status: "Status", processing: "Your order is being processed", assembling: "Your order is being assembled", in_transit: "Your order is on the way", ready_for_pickup: "Your order is ready for pickup", empty: "No orders yet." },
  ru: { link: "Стадия заказа", title: "Стадия заказа", date: "Дата заказа", status: "Стадия", processing: "Ваш заказ оформляется", assembling: "Ваш заказ собирается", in_transit: "Ваш заказ в пути", ready_for_pickup: "Ваш заказ ждёт вас на почте", empty: "Пока нет оформленных заказов." },
  de: { link: "Bestellstatus", title: "Bestellstatus", date: "Bestellt", status: "Status", processing: "Ihre Bestellung wird bearbeitet", assembling: "Ihre Bestellung wird zusammengestellt", in_transit: "Ihre Bestellung ist unterwegs", ready_for_pickup: "Ihre Bestellung ist zur Abholung bereit", empty: "Noch keine Bestellungen." },
  fr: { link: "Statut de commande", title: "Statut de commande", date: "Commande passée", status: "Statut", processing: "Votre commande est en cours de traitement", assembling: "Votre commande est en cours de préparation", in_transit: "Votre commande est en route", ready_for_pickup: "Votre commande est prête au retrait", empty: "Pas encore de commandes." },
  it: { link: "Stato dell'ordine", title: "Stato dell'ordine", date: "Ordinato", status: "Stato", processing: "Il tuo ordine è in elaborazione", assembling: "Il tuo ordine è in preparazione", in_transit: "Il tuo ordine è in viaggio", ready_for_pickup: "Il tuo ordine è pronto per il ritiro", empty: "Nessun ordine ancora." },
  el: { link: "Κατάσταση παραγγελίας", title: "Κατάσταση παραγγελίας", date: "Παραγγέλθηκε", status: "Κατάσταση", processing: "Η παραγγελία σας επεξεργάζεται", assembling: "Η παραγγελία σας ετοιμάζεται", in_transit: "Η παραγγελία σας είναι καθ' οδόν", ready_for_pickup: "Η παραγγελία σας είναι έτοιμη για παραλαβή", empty: "Δεν υπάρχουν παραγγελίες ακόμα." },
  es: { link: "Estado del pedido", title: "Estado del pedido", date: "Pedido realizado", status: "Estado", processing: "Tu pedido se está procesando", assembling: "Tu pedido se está preparando", in_transit: "Tu pedido está en camino", ready_for_pickup: "Tu pedido está listo para recoger", empty: "Aún no hay pedidos." },
  et: { link: "Tellimuse staatus", title: "Tellimuse staatus", date: "Tellitud", status: "Staatus", processing: "Teie tellimust töödeldakse", assembling: "Teie tellimust komplekteeritakse", in_transit: "Teie tellimus on teel", ready_for_pickup: "Teie tellimus on valmis järele tulekuks", empty: "Tellimusi veel pole." },
  lv: { link: "Pasūtījuma statuss", title: "Pasūtījuma statuss", date: "Pasūtīts", status: "Statuss", processing: "Jūsu pasūtījums tiek apstrādāts", assembling: "Jūsu pasūtījums tiek komplektēts", in_transit: "Jūsu pasūtījums ir ceļā", ready_for_pickup: "Jūsu pasūtījums ir gatavs saņemšanai", empty: "Vēl nav pasūtījumu." },
  lt: { link: "Užsakymo būsena", title: "Užsakymo būsena", date: "Užsakyta", status: "Būsena", processing: "Jūsų užsakymas apdorojamas", assembling: "Jūsų užsakymas komplektuojamas", in_transit: "Jūsų užsakymas pakeliui", ready_for_pickup: "Jūsų užsakymas paruoštas atsiėmimui", empty: "Dar nėra užsakymų." },
  pl: { link: "Status zamówienia", title: "Status zamówienia", date: "Zamówiono", status: "Status", processing: "Twoje zamówienie jest przetwarzane", assembling: "Twoje zamówienie jest kompletowane", in_transit: "Twoje zamówienie jest w drodze", ready_for_pickup: "Twoje zamówienie jest gotowe do odbioru", empty: "Brak zamówień." },
};

const getInitialTheme = () => {
  if (typeof window === "undefined") {
    return "light";
  }

  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  return THEMES.includes(saved) ? saved : "light";
};

const getAvatarTextColor = (hex) => {
  if (!hex || !hex.startsWith("#")) {
    return "#0c0d0f";
  }

  const normalized = hex.slice(1);
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 160 ? "#0c0d0f" : "#ffffff";
};

export function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isDreadsOpen, setIsDreadsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOrderStatusOpen, setIsOrderStatusOpen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const drawerRef = useRef(null);
  const drawerToggleRef = useRef(null);
  const languageMenu = useRef();
  const accountMenu = useRef();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, languages, t } = useLanguage();
  const user = useSelector((state) => state.auth.user);
  const latestOrder = useSelector((state) => state.orders.latestOrder);
  const settingsText = SETTINGS_TEXT[language] || SETTINGS_TEXT.en;
  const themeLabels =
    language === "ru"
      ? {
          light: "\u0421\u0432\u0435\u0442\u043b\u0430\u044f",
          dark: "\u0422\u0451\u043c\u043d\u0430\u044f",
          burgundy: "\u0411\u043e\u0440\u0434\u043e\u0432\u0430\u044f",
          olive: "\u041e\u043b\u0438\u0432\u043a\u043e\u0432\u0430\u044f",
          forest: "\u041b\u0435\u0441\u043d\u0430\u044f",
          sapphire: "\u0421\u0430\u043f\u0444\u0438\u0440\u043e\u0432\u0430\u044f",
          plum: "\u0421\u043b\u0438\u0432\u043e\u0432\u0430\u044f",
          terracotta: "\u0422\u0435\u0440\u0440\u0430\u043a\u043e\u0442\u043e\u0432\u0430\u044f",
          graphite: "\u0413\u0440\u0430\u0444\u0438\u0442\u043e\u0432\u0430\u044f",
        }
      : THEME_LABELS[language] || THEME_LABELS.en;
  const instantLabel =
    language === "ru"
      ? "\u0413\u043e\u0442\u043e\u0432\u044b\u0435 \u0441\u0435\u0442\u044b"
      : language === "fi"
        ? "Valmiit setit"
        : "Instock";
  const orderLabels = ORDER_STATUS_TEXT[language] || ORDER_STATUS_TEXT.en;
  const customSetContent = getCustomSetContent(language);
  const homeSectionContent = getHomeSectionContent(language);
  const latestOrderDate = latestOrder
    ? new Intl.DateTimeFormat(
        DATE_LOCALES[language] || DATE_LOCALES.en,
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      ).format(new Date(latestOrder.created_at))
    : "";
  const resolvedInstantLabel = t("header.instock");
  const resolvedCurlsOnMiniDreadLabel = t("header.curlsOnMiniDread");

  const avatarFallback = useMemo(() => {
    const source = user?.username || user?.email || "";
    return source.slice(0, 1).toUpperCase() || "?";
  }, [user]);
  const avatarBackgroundStyle = user?.avatar
    ? undefined
    : {
        backgroundColor: user?.avatarColor || "#ffffff",
        color: getAvatarTextColor(user?.avatarColor || "#ffffff"),
      };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (user) {
      dispatch(fetchLatestOrder());
    }
  }, [dispatch, user]);

  useEffect(() => {
    setIsDrawerOpen(false);
    setIsShopOpen(false);
    setIsServicesOpen(false);
    setIsDreadsOpen(false);
  }, [location.pathname, location.hash, location.search]);

  useEffect(() => {
    const handleDocumentPointerDown = (event) => {
      const target = event.target;

      if (
        isDrawerOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(target) &&
        drawerToggleRef.current &&
        !drawerToggleRef.current.contains(target)
      ) {
        closeDrawer();
      }

      if (
        languageMenu.current &&
        !languageMenu.current.contains(target)
      ) {
        setIsLanguageOpen(false);
      }

      if (accountMenu.current && !accountMenu.current.contains(target)) {
        setIsAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleDocumentPointerDown);
    return () => document.removeEventListener("mousedown", handleDocumentPointerDown);
  }, [isDrawerOpen]);

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setIsLanguageOpen(false);
    setIsShopOpen(false);
    setIsServicesOpen(false);
    setIsDreadsOpen(false);
  };

  const handleDrawerNavigate = (path) => {
    closeDrawer();
    navigate(path);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => {
      const nextOpen = !prev;

      if (!nextOpen) {
        setIsShopOpen(false);
        setIsServicesOpen(false);
        setIsDreadsOpen(false);
      }

      return nextOpen;
    });
  };

  const toggleShop = () => {
    setIsShopOpen((prev) => !prev);
    setIsServicesOpen(false);
  };

  const toggleServices = () => {
    setIsServicesOpen((prev) => !prev);
    setIsShopOpen(false);
    setIsDreadsOpen(false);
  };

  const selectLanguage = (code) => {
    setLanguage(code);
    setIsLanguageOpen(false);
  };

  const handleAccountClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setIsAccountOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    await dispatch(fetchLogout());
    setIsSettingsOpen(false);
    setIsOrderStatusOpen(false);
    setIsAccountOpen(false);
    setIsDrawerOpen(false);
    setIsShopOpen(false);
    setIsServicesOpen(false);
    setIsDreadsOpen(false);
    navigate("/");
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles.nav}>
          <button
            type="button"
            ref={drawerToggleRef}
            className={`${styles.menuToggle} ${isDrawerOpen ? styles.menuToggleOpen : ""}`}
            onClick={toggleDrawer}
            aria-label={t("header.menu")}
            aria-expanded={isDrawerOpen}
          >
            <span className={styles.menuToggleBar} />
            <span className={styles.menuToggleBar} />
            <span className={styles.menuToggleBar} />
          </button>
        </div>

        <div className={styles.logo} onClick={() => navigate("/")}>
          <h1>{t("header.brandFirst")}</h1>
          <img src="/image_no_bg__1_-removebg-preview.png" alt="logo" />
          <h1>{t("header.brandSecond")}</h1>
        </div>

        <div
          className={`${styles.mobLogo} ${styles.logo}`}
          onClick={() => navigate("/")}
        >
          <img src="/image_no_bg__1_-removebg-preview.png" alt="logo" />
          <div className={styles.mobText}>
            <h1>{t("header.brandFirst")}</h1>
            <h1>{t("header.brandSecond")}</h1>
          </div>
        </div>

        <div className={styles.menu}>
          <button onClick={() => navigate("/cart")} aria-label={t("header.cart")}>
            <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
              <g data-name="1" id="_1">
                <path
                  d="M397.78,316H192.65A15,15,0,0,1,178,304.33L143.46,153.85a15,15,0,0,1,14.62-18.36H432.35A15,15,0,0,1,447,153.85L412.4,304.33A15,15,0,0,1,397.78,316ZM204.59,286H385.84l27.67-120.48H176.91Z"
                  fill="#ffffff"
                />
                <path
                  d="M222,450a57.48,57.48,0,1,1,57.48-57.48A57.54,57.54,0,0,1,222,450Zm0-84.95a27.48,27.48,0,1,0,27.48,27.47A27.5,27.5,0,0,0,222,365.05Z"
                  fill="#ffffff"
                />
                <path
                  d="M368.42,450a57.48,57.48,0,1,1,57.48-57.48A57.54,57.54,0,0,1,368.42,450Zm0-84.95a27.48,27.48,0,1,0,27.48,27.47A27.5,27.5,0,0,0,368.42,365.05Z"
                  fill="#ffffff"
                />
                <path
                  d="M158.08,165.49a15,15,0,0,1-14.23-10.26L118.14,78H70.7a15,15,0,1,1,0-30H129a15,15,0,0,1,14.23,10.26l29.13,87.49a15,15,0,0,1-14.23,19.74Z"
                  fill="#ffffff"
                />
              </g>
            </svg>
          </button>

          <div className={styles.langMenu} ref={languageMenu}>
            <button
              type="button"
              className={styles.langTrigger}
              onClick={() => setIsLanguageOpen((prev) => !prev)}
            >
              {t(`common.languages.${language}`)}
            </button>
            {isLanguageOpen ? (
              <div className={styles.langDropdown}>
                {languages.map((code) => (
                  <button
                    key={code}
                    type="button"
                    className={language === code ? styles.langActive : ""}
                    onClick={() => selectLanguage(code)}
                  >
                    {t(`common.languages.${code}`)}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className={styles.accountMenu} ref={accountMenu}>
            <button
              onClick={handleAccountClick}
              aria-label={user ? t("header.account") : t("header.login")}
              className={styles.accountButton}
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.username} className={styles.avatarImage} />
              ) : user ? (
                <span className={styles.avatarFallback} style={avatarBackgroundStyle}>
                  {avatarFallback}
                </span>
              ) : (
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="8" fill="#ffffff" r="4" />
                  <path
                    d="M20,19v1a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V19a6,6,0,0,1,6-6h4A6,6,0,0,1,20,19Z"
                    fill="#ffffff"
                  />
                </svg>
              )}
            </button>

            {user && isAccountOpen ? (
              <div className={styles.accountDropdown}>
                <div className={styles.accountSummary}>
                  <div className={styles.accountAvatarLarge}>
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.username} className={styles.avatarImage} />
                    ) : (
                      <span className={styles.avatarFallback} style={avatarBackgroundStyle}>
                        {avatarFallback}
                      </span>
                    )}
                  </div>
                  <div className={styles.accountMeta}>
                    <strong>{user.username}</strong>
                    <span>{user.email}</span>
                  </div>
                </div>

                <div className={styles.accountLinks}>
                  <button
                    type="button"
                    className={styles.accountLink}
                    onClick={() => {
                      setIsAccountOpen(false);
                      navigate("/cart");
                    }}
                  >
                    {t("header.cart")}
                  </button>
                  <button
                    type="button"
                    className={styles.accountLink}
                    onClick={() => {
                      setIsAccountOpen(false);
                      setIsOrderStatusOpen(true);
                    }}
                  >
                    {orderLabels.link}
                  </button>
                  <button
                    type="button"
                    className={styles.accountLink}
                    onClick={() => {
                      setIsAccountOpen(false);
                      setIsSettingsOpen(true);
                    }}
                  >
                    {settingsText.settings}
                  </button>
                </div>

                <button
                  type="button"
                  className={styles.logoutButton}
                  onClick={handleLogout}
                >
                  <span className={styles.logoutIcon} aria-hidden="true">
                    ↪
                  </span>
                  <span>{settingsText.logout}</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {isDrawerOpen ? (
        <button
          type="button"
          className={styles.menuBackdrop}
          onClick={closeDrawer}
          aria-label={t("header.menu")}
        />
      ) : null}

      <aside
        ref={drawerRef}
        className={`${styles.dropMenu} ${isDrawerOpen ? styles.visible : ""}`}
        onClick={(event) => event.stopPropagation()}
      >
        <ul className={styles.menuList}>
          <li>
            <button type="button" className={styles.drawerNavLink} onClick={() => handleDrawerNavigate("/")}>
              {t("header.home")}
            </button>
          </li>

          <li className={styles.shopItem}>
            <div className={styles.shopHeaderRow}>
              <button
                type="button"
                className={styles.drawerNavLink}
                onClick={toggleShop}
              >
                {t("header.shop")}
              </button>
              <button
                type="button"
                className={`${styles.shopToggleButton} ${isShopOpen ? styles.shopToggleOpen : ""}`}
                onClick={toggleShop}
                aria-label={t("header.shop")}
              />
            </div>
            {isShopOpen ? (
              <div className={styles.shopSubmenu}>
                <div className={styles.dreadsGroup}>
                  <div className={styles.dreadsRow}>
                    <button
                      type="button"
                      className={`${styles.drawerNavLink} ${styles.drawerNavLinkNoUnderline}`}
                      onClick={() => setIsDreadsOpen((prev) => !prev)}
                    >
                      {t("header.dreads")}
                    </button>
                    <button
                      type="button"
                      className={`${styles.submenuToggle} ${isDreadsOpen ? styles.submenuToggleOpen : ""}`}
                      onClick={() => setIsDreadsOpen((prev) => !prev)}
                      aria-label={t("header.dreads")}
                    >
                      <span className={styles.submenuCaret} aria-hidden="true" />
                    </button>
                  </div>
                  {isDreadsOpen ? (
                    <div className={styles.dreadsSubmenu}>
                      <Link
                        to="/shop/smooth-dreads"
                        className={styles.drawerNavLink}
                        onClick={closeDrawer}
                      >
                        {t("header.smoothDreads")}
                      </Link>
                      <Link
                        to="/shop/textured-dreads"
                        className={styles.drawerNavLink}
                        onClick={closeDrawer}
                      >
                        {t("header.texturedDreads")}
                      </Link>
                    </div>
                  ) : null}
                </div>
                <Link
                  to="/shop/curls-on-mini-dread"
                  className={styles.drawerNavLink}
                  onClick={closeDrawer}
                >
                  {t("header.curls")}
                </Link>
                <Link
                  to="/shop/braids"
                  className={styles.drawerNavLink}
                  onClick={closeDrawer}
                >
                  {t("header.braids")}
                </Link>
                <Link
                  to="/shop/hair-on-braid"
                  className={styles.drawerNavLink}
                  onClick={closeDrawer}
                >
                  {t("header.hairOnBraid")}
                </Link>
                <Link
                  to="/shop/curls-on-mini-dread"
                  className={styles.drawerNavLink}
                  onClick={closeDrawer}
                >
                  {resolvedCurlsOnMiniDreadLabel}
                </Link>
                <Link
                  to="/custom-set"
                  className={styles.drawerNavLink}
                  onClick={closeDrawer}
                >
                  {customSetContent.navLabel}
                </Link>
                <Link
                  to="/shop/other"
                  className={styles.drawerNavLink}
                  onClick={closeDrawer}
                >
                  {t("header.other")}
                </Link>
              </div>
            ) : null}
          </li>

          <li>
            <button
              type="button"
              className={styles.drawerNavLink}
              onClick={() => handleDrawerNavigate("/instock")}
            >
              {resolvedInstantLabel}
            </button>
          </li>
          <li className={styles.shopItem}>
            <div className={styles.shopHeaderRow}>
              <button
                type="button"
                className={styles.drawerNavLink}
                onClick={toggleServices}
              >
                {homeSectionContent.servicesNavLabel}
              </button>
              <button
                type="button"
                className={`${styles.shopToggleButton} ${isServicesOpen ? styles.shopToggleOpen : ""}`}
                onClick={toggleServices}
                aria-label={homeSectionContent.servicesNavLabel}
              />
            </div>
            {isServicesOpen ? (
              <div className={styles.shopSubmenu}>
                <button
                  type="button"
                  className={styles.drawerNavLink}
                  onClick={() => handleDrawerNavigate(`/#${HOME_SECTION_IDS.about}`)}
                >
                  {homeSectionContent.aboutNavLabel}
                </button>
                <button
                  type="button"
                  className={styles.drawerNavLink}
                  onClick={() => handleDrawerNavigate(`/#${HOME_SECTION_IDS.gallery}`)}
                >
                  {t("home.galleryTitle")}
                </button>
                <button
                  type="button"
                  className={styles.drawerNavLink}
                  onClick={() => handleDrawerNavigate(`/#${HOME_SECTION_IDS.reviews}`)}
                >
                  {t("home.reviewsTitle")}
                </button>
              </div>
            ) : null}
          </li>
          <li>
            <button type="button" className={styles.drawerNavLink} onClick={() => handleDrawerNavigate("/faq")}>
              {homeSectionContent.expertiseNavLabel}
            </button>
          </li>
          <li>
            <button type="button" className={styles.drawerNavLink} onClick={() => handleDrawerNavigate("/contacts")}>
              {t("header.contacts")}
            </button>
          </li>
          {user ? (
            <li>
              <button type="button" className={styles.drawerNavLink} onClick={() => handleDrawerNavigate("/cart")}>
                {t("header.cart")}
              </button>
            </li>
          ) : null}
          {!user ? (
            <li>
              <button type="button" className={styles.drawerNavLink} onClick={() => handleDrawerNavigate("/login")}>
                {t("header.login")}
              </button>
            </li>
          ) : null}
          <li className={styles.drawerLanguageSection}>
            <div className={styles.drawerLanguageLabel}>{settingsText.language}</div>
            <div className={styles.drawerLanguageGrid}>
              {languages.map((code) => (
                <button
                  key={code}
                  type="button"
                  className={language === code ? styles.langActive : ""}
                  onClick={() => selectLanguage(code)}
                >
                  {t(`common.languages.${code}`)}
                </button>
              ))}
            </div>
          </li>
        </ul>
      </aside>

      {user && isSettingsOpen ? (
        <div
          className={styles.settingsOverlay}
          onClick={() => setIsSettingsOpen(false)}
        >
          <div
            className={styles.settingsModal}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className={styles.settingsClose}
              onClick={() => setIsSettingsOpen(false)}
            >
              ×
            </button>

            <div className={styles.settingsHero}>
              <div className={styles.settingsAvatar}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} className={styles.avatarImage} />
                ) : (
                  <span className={styles.avatarFallback} style={avatarBackgroundStyle}>
                    {avatarFallback}
                  </span>
                )}
              </div>
              <div className={styles.settingsMeta}>
                <h2>{user.username}</h2>
                <p>{user.email}</p>
                <span>{user.email}</span>
              </div>
            </div>

            <div className={styles.settingsGrid}>
              <section className={styles.settingsCard}>
                <h3>{settingsText.theme}</h3>
                <div className={styles.choiceRow}>
                  {THEMES.map((themeOption) => (
                    <button
                      key={themeOption}
                      type="button"
                      className={theme === themeOption ? styles.choiceActive : styles.choiceButton}
                      onClick={() => setTheme(themeOption)}
                    >
                      {themeLabels[themeOption] || THEME_LABELS.en[themeOption] || themeOption}
                    </button>
                  ))}
                </div>
              </section>

              <section className={styles.settingsCard}>
                <h3>{settingsText.language}</h3>
                <div className={styles.choiceRow}>
                  {languages.map((code) => (
                    <button
                      key={code}
                      type="button"
                      className={
                        language === code ? styles.choiceActive : styles.choiceButton
                      }
                      onClick={() => setLanguage(code)}
                    >
                      {t(`common.languages.${code}`)}
                    </button>
                  ))}
                </div>
              </section>

              <section className={styles.settingsCard}>
                <h3>{settingsText.security}</h3>
                <p className={styles.securityNote}>{settingsText.passwordHidden}</p>
              </section>

              <section className={styles.settingsCard}>
                <h3>{settingsText.avatarColor}</h3>
                <div className={styles.colorGrid}>
                  {AVATAR_COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`${styles.colorSwatch} ${user.avatarColor === color ? styles.colorSwatchActive : ""}`}
                      style={{ backgroundColor: color }}
                      onClick={() => dispatch(updateUserAvatarColor(color))}
                      aria-label={color}
                    />
                  ))}
                </div>
              </section>
            </div>

            <button
              type="button"
              className={styles.settingsLogout}
              onClick={handleLogout}
            >
              {settingsText.logout}
            </button>
          </div>
        </div>
      ) : null}

      {user && isOrderStatusOpen ? (
        <div
          className={styles.settingsOverlay}
          onClick={() => setIsOrderStatusOpen(false)}
        >
          <div
            className={styles.orderStatusModal}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className={styles.settingsClose}
              onClick={() => setIsOrderStatusOpen(false)}
            >
              ×
            </button>
            <h2>{orderLabels.title}</h2>
            {latestOrder ? (
              <div className={styles.orderStatusInfo}>
                <div className={styles.orderStatusItem}>
                  <span>{orderLabels.date}</span>
                  <strong>{latestOrderDate}</strong>
                </div>
                <div className={styles.orderStatusItem}>
                  <span>{orderLabels.status}</span>
                  <strong>
                    {orderLabels[latestOrder.status] || latestOrder.status_label}
                  </strong>
                </div>
              </div>
            ) : (
              <p className={styles.orderStatusEmpty}>{orderLabels.empty}</p>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}


