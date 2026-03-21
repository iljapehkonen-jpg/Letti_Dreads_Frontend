import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import {
  AVATAR_COLOR_OPTIONS,
  fetchLogout,
  updateUserAvatarColor,
} from "../../redux/slices/authSlice";
import styles from "./Header.module.scss";

const THEME_STORAGE_KEY = "letti-theme";

const getInitialTheme = () => {
  if (typeof window === "undefined") {
    return "light";
  }

  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  return saved === "dark" ? "dark" : "light";
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
  const [isVisible, setIsVisible] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isDreadsOpen, setIsDreadsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const menu = useRef();
  const languageMenu = useRef();
  const accountMenu = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { language, setLanguage, languages, t } = useLanguage();
  const user = useSelector((state) => state.auth.user);

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

  const handleClick = (e) => {
    if (menu.current && !menu.current.contains(e.target)) {
      setIsVisible(false);
      setIsShopOpen(false);
      setIsDreadsOpen(false);
    }

    if (languageMenu.current && !languageMenu.current.contains(e.target)) {
      setIsLanguageOpen(false);
    }

    if (accountMenu.current && !accountMenu.current.contains(e.target)) {
      setIsAccountOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const closeAndNavigate = (path) => {
    setIsVisible(false);
    setIsShopOpen(false);
    setIsDreadsOpen(false);
    navigate(path);
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
    setIsAccountOpen(false);
    setIsVisible(false);
    setIsShopOpen(false);
    setIsDreadsOpen(false);
    navigate("/");
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles.nav}>
          <button
            onClick={() => setIsVisible((prev) => !prev)}
            aria-label={t("header.menu")}
          >
            <svg
              fill="none"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 6C2 5.44772 2.44772 5 3 5H21C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H3C2.44772 7 2 6.55228 2 6Z"
                fill="#ffffff"
              />
              <path
                d="M2 12.0322C2 11.4799 2.44772 11.0322 3 11.0322H21C21.5523 11.0322 22 11.4799 22 12.0322C22 12.5845 21.5523 13.0322 21 13.0322H3C2.44772 13.0322 2 12.5845 2 12.0322Z"
                fill="#ffffff"
              />
              <path
                d="M3 17.0645C2.44772 17.0645 2 17.5122 2 18.0645C2 18.6167 2.44772 19.0645 3 19.0645H21C21.5523 19.0645 22 18.6167 22 18.0645C22 17.5122 21.5523 17.0645 21 17.0645H3Z"
                fill="#ffffff"
              />
            </svg>
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
                      setIsSettingsOpen(true);
                    }}
                  >
                    {t("header.settings")}
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
                  <span>{t("header.logout")}</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div
        className={`${styles.dropMenu} ${isVisible ? styles.visible : ""}`}
        ref={menu}
      >
        <ul className={styles.menuList}>
          <li onClick={() => closeAndNavigate("/")}>{t("header.home")}</li>

          <li className={styles.shopItem}>
            <button
              type="button"
              className={`${styles.shopToggle} ${isShopOpen ? styles.shopToggleOpen : ""}`}
              onClick={() => setIsShopOpen((prev) => !prev)}
            >
              {t("header.shop")}
            </button>
            {isShopOpen ? (
              <div className={styles.shopSubmenu}>
                <div className={styles.dreadsGroup}>
                  <button
                    type="button"
                    className={`${styles.submenuToggle} ${isDreadsOpen ? styles.submenuToggleOpen : ""}`}
                    onClick={() => setIsDreadsOpen((prev) => !prev)}
                  >
                    <span>{t("header.dreads")}</span>
                    <span className={styles.submenuCaret} aria-hidden="true" />
                  </button>

                  {isDreadsOpen ? (
                    <div className={styles.dreadsSubmenu}>
                      <button
                        type="button"
                        onClick={() => closeAndNavigate("/shop/smooth-dreads")}
                      >
                        {t("header.smoothDreads")}
                      </button>
                      <button
                        type="button"
                        onClick={() => closeAndNavigate("/shop/textured-dreads")}
                      >
                        {t("header.texturedDreads")}
                      </button>
                    </div>
                  ) : null}
                </div>
                <button type="button" onClick={() => closeAndNavigate("/shop/curls")}>
                  {t("header.curls")}
                </button>
                <button type="button" onClick={() => closeAndNavigate("/shop/braids")}>
                  {t("header.braids")}
                </button>
                <button
                  type="button"
                  onClick={() => closeAndNavigate("/shop/hair-on-braid")}
                >
                  {t("header.hairOnBraid")}
                </button>
                <button
                  type="button"
                  onClick={() => closeAndNavigate("/shop/curls-on-mini-dread")}
                >
                  {t("header.curlsOnMiniDread")}
                </button>
              </div>
            ) : null}
          </li>

          <li onClick={() => closeAndNavigate("/contacts")}>
            {t("header.contacts")}
          </li>
          <li onClick={() => closeAndNavigate("/faq")}>{t("header.faq")}</li>
          <li onClick={() => closeAndNavigate("/cart")}>{t("header.cart")}</li>
          {!user ? (
            <li onClick={() => closeAndNavigate("/login")}>{t("header.login")}</li>
          ) : null}
          <li onClick={() => closeAndNavigate("/other")}>{t("header.other")}</li>
        </ul>
      </div>

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
                <h3>{t("header.theme")}</h3>
                <div className={styles.choiceRow}>
                  <button
                    type="button"
                    className={theme === "light" ? styles.choiceActive : styles.choiceButton}
                    onClick={() => setTheme("light")}
                  >
                    {t("header.lightTheme")}
                  </button>
                  <button
                    type="button"
                    className={theme === "dark" ? styles.choiceActive : styles.choiceButton}
                    onClick={() => setTheme("dark")}
                  >
                    {t("header.darkTheme")}
                  </button>
                </div>
              </section>

              <section className={styles.settingsCard}>
                <h3>{t("common.language")}</h3>
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
                <h3>{t("header.security")}</h3>
                <p className={styles.securityNote}>{t("header.passwordHidden")}</p>
              </section>

              <section className={styles.settingsCard}>
                <h3>{t("header.avatarColor")}</h3>
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
              {t("header.logout")}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
