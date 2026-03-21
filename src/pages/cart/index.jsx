import React, { useEffect, useMemo } from "react";
import styles from "./Cart.module.scss";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCart,
  removeItemFromCart,
  removeSelectedFromCart,
  toggleCartItemLike,
  toggleCartItemSelection,
  toggleSelectAllCartItems,
  updateCartItemQuantity,
} from "../../redux/slices/cartSlice";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

const QUANTITY_STEP = 1;
const COST_LABELS = {
  fi: "Hinta",
  en: "Cost",
  ru: "Стоимость",
};

const TrashIcon = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={styles.trashIcon}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 3.75h6l.45 1.5H20.25v1.5h-1.2l-.84 11.02a2.25 2.25 0 0 1-2.24 2.08H8.03a2.25 2.25 0 0 1-2.24-2.08L4.95 6.75h-1.2v-1.5H8.55L9 3.75Zm-2.55 3 .83 10.9a.75.75 0 0 0 .75.7h7.94a.75.75 0 0 0 .75-.7l.83-10.9H6.45Zm3.3 2.1h1.5v6.75h-1.5V8.85Zm3 0h1.5v6.75h-1.5V8.85Z"
      fill="currentColor"
    />
  </svg>
);

export const Cart = () => {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const sortedCart = useMemo(() => {
    return [...cart].sort((a, b) => Number(b.liked) - Number(a.liked));
  }, [cart]);

  const allSelected = sortedCart.length
    ? sortedCart.every((item) => item.selected)
    : false;

  const subtotal = sortedCart.reduce((sum, item) => {
    const unitPrice = Number(item.unitPrice ?? item.price);
    return sum + unitPrice * Number(item.strandQuantity) * Number(item.setQuantity);
  }, 0);

  const totalSets = sortedCart.reduce(
    (sum, item) => sum + Number(item.setQuantity),
    0,
  );

  const costLabel = COST_LABELS[language] || COST_LABELS.en;

  return (
    <div className={styles.cart}>
      <h2>{t("cart.title")}</h2>
      <div className={styles.content}>
        <div className={styles.leftInfo}>
          <div className={styles.selectAllPanel}>
            <div
              className={styles.selectAll}
              onClick={() => dispatch(toggleSelectAllCartItems(!allSelected))}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <span
                className={`${styles.checkbox} ${allSelected ? styles.checkboxChecked : ""}`}
              />
              {t("cart.selectAll")}
            </div>
            <div className={styles.buttonPanel}>
              <button
                className={styles.delete}
                onClick={() => dispatch(removeSelectedFromCart())}
                aria-label={t("cart.deleteSelected")}
                title={t("cart.deleteSelected")}
              >
                <TrashIcon />
              </button>
            </div>
          </div>

          {sortedCart.length ? (
            sortedCart.map((item) => (
              <div className={styles.items} key={item.id}>
                <div className={styles.item}>
                  <span
                    className={`${styles.itemCheckbox} ${item.selected ? styles.itemCheckboxChecked : ""}`}
                    onClick={() => dispatch(toggleCartItemSelection(item.id))}
                  />
                  <div className={styles.info}>
                    <img
                      src={item.img}
                      alt={item.name}
                      width={150}
                      height={150}
                    />
                    <div className={styles.text}>
                      <h3>{item.name}</h3>
                      <p className={styles.optionsLine}>
                        {t("cart.length")}: {item.length}
                      </p>
                      <p className={styles.optionsLine}>
                        {t("cart.color")}: {item.color}
                      </p>
                      <p className={styles.optionsLine}>
                        {t("shop.modal.quantity")}: {item.strandQuantity}
                      </p>
                      <p className={styles.truncate3} title={item.description}>
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className={styles.price}>
                    <h3>
                      {(
                        Number(item.unitPrice ?? item.price) *
                        Number(item.strandQuantity) *
                        Number(item.setQuantity)
                      ).toFixed(2)}{" "}
                      €
                    </h3>
                  </div>
                  <div className={styles.button}>
                    <div className={styles.quantityControl}>
                      <button
                        type="button"
                        className={styles.minus}
                        onClick={() =>
                          dispatch(
                            updateCartItemQuantity({
                              id: item.id,
                              quantity: item.setQuantity - QUANTITY_STEP,
                            }),
                          )
                        }
                      >
                        -
                      </button>
                      <div className={styles.quantity}>{item.setQuantity}</div>
                      <button
                        type="button"
                        className={styles.plus}
                        onClick={() =>
                          dispatch(
                            updateCartItemQuantity({
                              id: item.id,
                              quantity: item.setQuantity + QUANTITY_STEP,
                            }),
                          )
                        }
                      >
                        +
                      </button>
                    </div>

                    <div className={styles.buttons}>
                      <button
                        className={styles.delete}
                        onClick={() => dispatch(removeItemFromCart(item.id))}
                        aria-label={t("cart.delete")}
                        title={t("cart.delete")}
                      >
                        <TrashIcon />
                      </button>
                      <button
                        className={styles.like}
                        onClick={() => dispatch(toggleCartItemLike(item.id))}
                        aria-label={item.liked ? t("cart.unfavorite") : t("cart.favorite")}
                      >
                        {item.liked ? "★" : "☆"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>{t("common.noItems")}</div>
          )}
        </div>

        <div className={styles.cartPay}>
          <h3>{t("cart.yourCart")}</h3>
          <div className={styles.cartPayInfo}>
            <div className={styles.textCartPay}>
              <p>{costLabel}:</p>
              <p>{t("cart.products")}:</p>
            </div>
            <div className={styles.periseCartPay}>
              <div>{subtotal.toFixed(2)} €</div>
              <div>{totalSets}</div>
            </div>
          </div>
          <div className={styles.total}>
            <p>{t("cart.total")}:</p>
            <div>{subtotal.toFixed(2)} €</div>
          </div>
          <button className={styles.pay}>{t("cart.proceedToPayment")}</button>
        </div>
      </div>
    </div>
  );
};
