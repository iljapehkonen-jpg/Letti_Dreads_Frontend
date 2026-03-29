import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Checkout.module.scss";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { createOrder } from "../../redux/slices/orderSlice";
import { fetchCart } from "../../redux/slices/cartSlice";

const TEXT = {
  fi: {
    title: "Tilaustiedot",
    subtitle: "Täytä pakolliset tiedot ennen maksua.",
    email: "Sähköposti",
    nickname: "Nickname",
    address: "Katuosoite",
    city: "Kaupunki",
    postalCode: "Postinumero",
    phone: "Puhelinnumero",
    summary: "Yhteenveto",
    orderItems: "Tilauksen tuotteet",
    items: "Tuotteet",
    total: "Yhteensä",
    length: "Pituus",
    quantity: "Määrä",
    sets: "Setit",
    submit: "Vahvista tiedot",
    emptyCart: "Korissa ei ole tuotteita.",
    loginRequired: "Kirjaudu sisään ennen tilaamista.",
    nicknameMismatch: "Nickname ei vastaa rekisteröidyn tilin nimeä.",
    cityHint: "Postinumero täytetään automaattisesti tunnetuille kaupungeille.",
    success: "Tiedot tallennettu. Seuraavaksi voidaan lisätä varsinainen maksu.",
  },
  en: {
    title: "Checkout details",
    subtitle: "Fill in the required fields before payment.",
    email: "Email",
    nickname: "Nickname",
    address: "Street address",
    city: "City",
    postalCode: "Postal code",
    phone: "Phone number",
    summary: "Summary",
    orderItems: "Order items",
    items: "Items",
    total: "Total",
    length: "Length",
    quantity: "Quantity",
    sets: "Sets",
    submit: "Confirm details",
    emptyCart: "There are no items in the cart.",
    loginRequired: "Please log in before placing an order.",
    nicknameMismatch: "Nickname must match the one used in your account.",
    cityHint: "Postal code is filled automatically for known cities.",
    success: "Details saved. Payment step can be added next.",
  },
  ru: {
    title: "Данные для заказа",
    subtitle: "Заполни обязательные поля перед оплатой.",
    email: "Укажите почту",
    nickname: "Укажите nickname",
    address: "Домашний адрес",
    city: "Город",
    postalCode: "Почтовый индекс",
    phone: "Номер телефона",
    summary: "Сводка",
    orderItems: "Товары в заказе",
    items: "Товары",
    total: "Итого",
    length: "Длина",
    quantity: "Количество",
    sets: "Комплекты",
    submit: "Подтвердить данные",
    emptyCart: "В корзине нет товаров.",
    loginRequired: "Войди в аккаунт перед оформлением заказа.",
    nicknameMismatch: "Nickname должен совпадать с nickname аккаунта на сайте.",
    cityHint: "Для известных городов индекс подставляется автоматически.",
    success: "Данные сохранены. Следующим шагом можно подключить саму оплату.",
  },
};

const CITY_TO_POSTAL = {
  helsinki: "00100",
  espoo: "02100",
  vantaa: "01300",
  tampere: "33100",
  turku: "20100",
  oulu: "90100",
  jyvaskyla: "40100",
  jyväskylä: "40100",
  lahti: "15100",
  kuopio: "70100",
};

export function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const cart = useSelector((state) => state.cart.cart);
  const { language } = useLanguage();
  const labels = TEXT[language] || TEXT.en;
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    email: user?.email || "",
    nickname: user?.username || "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  useEffect(() => {
    if (!user) {
      alert(labels.loginRequired);
      navigate("/login");
      return;
    }

    if (!cart.length) {
      alert(labels.emptyCart);
      navigate("/cart");
    }
  }, [user, cart.length, labels.loginRequired, labels.emptyCart, navigate]);

  const totalSets = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.setQuantity || 0), 0),
    [cart],
  );

  const subtotal = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const unitPrice = Number(item.unitPrice ?? item.price ?? 0);
        return sum + unitPrice * Number(item.strandQuantity || 0) * Number(item.setQuantity || 0);
      }, 0),
    [cart],
  );

  const handleChange = (field, value) => {
    setFormError("");

    if (field === "city") {
      const postalCode = CITY_TO_POSTAL[value.trim().toLowerCase()] || "";
      setForm((prev) => ({
        ...prev,
        city: value,
        postalCode,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      alert(labels.loginRequired);
      navigate("/login");
      return;
    }

    if (!cart.length) {
      alert(labels.emptyCart);
      navigate("/cart");
      return;
    }

    const requiredFields = ["email", "nickname", "address", "city", "postalCode", "phone"];
    const hasEmptyField = requiredFields.some((field) => !String(form[field]).trim());

    if (hasEmptyField) {
      setFormError(labels.subtitle);
      return;
    }

    if (form.nickname.trim() !== String(user.username || "").trim()) {
      setFormError(labels.nicknameMismatch);
      return;
    }

    const result = await dispatch(
      createOrder({
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        postal_code: form.postalCode.trim(),
        phone: form.phone.trim(),
      }),
    );

    if (result.error) {
      setFormError(result.payload?.error || labels.subtitle);
      return;
    }

    await dispatch(fetchCart());
    alert(labels.success);
    navigate("/cart");
  };

  return (
    <div className={styles.checkout}>
      <div className={styles.content}>
        <div className={styles.formCard}>
          <h1>{labels.title}</h1>
          <p className={styles.subtitle}>{labels.subtitle}</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <label>
              <span>{labels.email}</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => handleChange("email", event.target.value)}
                required
              />
            </label>

            <label>
              <span>{labels.nickname}</span>
              <input
                type="text"
                value={form.nickname}
                onChange={(event) => handleChange("nickname", event.target.value)}
                required
              />
            </label>

            <label>
              <span>{labels.address}</span>
              <input
                type="text"
                value={form.address}
                onChange={(event) => handleChange("address", event.target.value)}
                required
              />
            </label>

            <div className={styles.row}>
              <label>
                <span>{labels.city}</span>
                <input
                  type="text"
                  value={form.city}
                  onChange={(event) => handleChange("city", event.target.value)}
                  required
                />
              </label>

              <label>
                <span>{labels.postalCode}</span>
                <input
                  type="text"
                  value={form.postalCode}
                  onChange={(event) => handleChange("postalCode", event.target.value)}
                  required
                />
              </label>
            </div>

            <p className={styles.hint}>{labels.cityHint}</p>

            <label>
              <span>{labels.phone}</span>
              <input
                type="tel"
                value={form.phone}
                onChange={(event) => handleChange("phone", event.target.value)}
                required
              />
            </label>

            {formError ? <p className={styles.error}>{formError}</p> : null}

            <button type="submit" className={styles.submitButton}>
              {labels.submit}
            </button>
          </form>
        </div>

        <aside className={styles.summaryCard}>
          <h2>{labels.summary}</h2>
          <div className={styles.orderItems}>
            <h3>{labels.orderItems}</h3>
            <div className={styles.orderList}>
              {cart.map((item) => (
                <article key={item.id} className={styles.orderItem}>
                  <img
                    src={item.img || item.images?.[0]}
                    alt={item.name}
                    className={styles.orderItemImage}
                  />
                  <div className={styles.orderItemText}>
                    <strong>{item.name}</strong>
                    <span>
                      {labels.length}: {item.length}
                    </span>
                    <span>
                      {labels.quantity}: {item.strandQuantity}
                    </span>
                    <span>
                      {labels.sets}: {item.setQuantity}
                    </span>
                  </div>
                  <div className={styles.orderItemPrice}>
                    {(
                      Number(item.unitPrice ?? item.price ?? 0) *
                      Number(item.strandQuantity || 0) *
                      Number(item.setQuantity || 0)
                    ).toFixed(2)}{" "}
                    €
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className={styles.summaryRow}>
            <span>{labels.items}</span>
            <strong>{totalSets}</strong>
          </div>
          <div className={styles.summaryRow}>
            <span>{labels.total}</span>
            <strong>{subtotal.toFixed(2)} €</strong>
          </div>
        </aside>
      </div>
    </div>
  );
}
