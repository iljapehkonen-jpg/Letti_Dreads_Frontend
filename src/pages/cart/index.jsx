import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./Cart.module.scss";
import shopStyles from "../shop/Shop.module.scss";
import {
  fetchCart,
  removeItemFromCart,
  removeSelectedFromCart,
  setCartItemQuantityLocal,
  toggleCartItemLike,
  toggleCartItemSelection,
  toggleSelectAllCartItems,
  updateCartItemDetails,
  updateCartItemQuantity,
} from "../../redux/slices/cartSlice";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { fetchLatestOrder } from "../../redux/slices/orderSlice";

const QUANTITY_STEP = 1;
const MODAL_QUANTITY_STEP = 5;
const MIN_STRAND_QUANTITY = 10;
const MAX_STRAND_QUANTITY = 65;
const LENGTH_OPTIONS = [
  { value: "45-50 cm", label: "45-50 cm" },
  { value: "55-60 cm", label: "55-60 cm" },
];
const COST_LABELS = {
  fi: "Hinta",
  en: "Cost",
  ru: "Стоимость",
};

const ORDER_ARTICLE_LABELS = {
  fi: {
    cardTitle: "Tilauksen tunnus",
    article: "Tilausnumero",
    empty: "Tilauksia ei ole viela tehty.",
  },
  en: {
    cardTitle: "Order article",
    article: "Order number",
    empty: "There are no completed orders yet.",
  },
  ru: {
    cardTitle: "Артикул заказа",
    article: "Номер заказа",
    empty: "Пока нет оформленных заказов.",
  },
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

const PinIcon = ({ active }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={styles.pinIcon}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2.75 14.56 8l5.69.82-4.12 4.01.97 5.67L12 15.79l-5.1 2.71.98-5.67-4.13-4.01L9.44 8 12 2.75Z"
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

export const Cart = () => {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.user);
  const latestOrder = useSelector((state) => state.orders.latestOrder);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedLength, setSelectedLength] = useState(LENGTH_OPTIONS[0].value);
  const [selectedQuantity, setSelectedQuantity] = useState(MIN_STRAND_QUANTITY);
  const [selectedImage, setSelectedImage] = useState("");
  const galleryScrollRef = useRef(null);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchLatestOrder());
    }
  }, [dispatch, user]);

  const sortedCart = useMemo(
    () => [...cart].sort((a, b) => Number(b.liked) - Number(a.liked)),
    [cart],
  );

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
  const latestOrderDate = latestOrder
    ? new Intl.DateTimeFormat(language === "ru" ? "ru-RU" : language === "fi" ? "fi-FI" : "en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(latestOrder.created_at))
    : "";
  const statusLabels = {
    fi: {
      processing: "Tilauksesi käsitellään",
      assembling: "Tilauksesi kootaan",
      in_transit: "Tilauksesi on matkalla",
      ready_for_pickup: "Tilauksesi odottaa noutoa",
      title: "Tilauksen vaihe",
      date: "Tilattu",
      status: "Vaihe",
    },
    en: {
      processing: "Your order is being processed",
      assembling: "Your order is being assembled",
      in_transit: "Your order is on the way",
      ready_for_pickup: "Your order is ready for pickup",
      title: "Order status",
      date: "Ordered",
      status: "Status",
    },
    ru: {
      processing: "Ваш заказ оформляется",
      assembling: "Ваш заказ собирается",
      in_transit: "Ваш заказ в пути",
      ready_for_pickup: "Ваш заказ ждёт вас на почте",
      title: "Стадия заказа",
      date: "Дата заказа",
      status: "Стадия",
    },
  };
  const orderLabels = statusLabels[language] || statusLabels.en;

  const handleQuantityChange = async (id, quantity) => {
    dispatch(
      setCartItemQuantityLocal({
        id,
        quantity,
      }),
    );

    const result = await dispatch(
      updateCartItemQuantity({
        id,
        quantity,
      }),
    );

    if (result.error) {
      await dispatch(fetchCart());
      return;
    }

    await dispatch(fetchCart());
  };

  const handleRemoveItem = async (id) => {
    const result = await dispatch(removeItemFromCart(id));
    if (result.error) {
      await dispatch(fetchCart());
    }
  };

  const handleRemoveSelected = async () => {
    const result = await dispatch(removeSelectedFromCart());
    if (result.error) {
      await dispatch(fetchCart());
    }
  };

  const openItemModal = (item) => {
    setSelectedItem(item);
    setSelectedLength(item.length || LENGTH_OPTIONS[0].value);
    setSelectedQuantity(
      Math.min(
        MAX_STRAND_QUANTITY,
        Math.max(MIN_STRAND_QUANTITY, Number(item.strandQuantity) || MIN_STRAND_QUANTITY),
      ),
    );
    setSelectedImage(item.images?.[0] || item.img || "");
  };

  const closeItemModal = () => {
    setSelectedItem(null);
    setSelectedImage("");
  };

  const adjustModalQuantity = (delta) => {
    setSelectedQuantity((prev) =>
      Math.min(MAX_STRAND_QUANTITY, Math.max(MIN_STRAND_QUANTITY, Number(prev) + delta)),
    );
  };

  const scrollGallery = (direction) => {
    if (!galleryScrollRef.current) {
      return;
    }

    const isMobile = window.innerWidth <= 730;
    const scrollAmount = isMobile ? 140 : 160;

    galleryScrollRef.current.scrollBy({
      top: isMobile ? 0 : direction * scrollAmount,
      left: isMobile ? direction * scrollAmount : 0,
      behavior: "smooth",
    });
  };

  const handleConfirmDetails = async () => {
    if (!selectedItem) {
      return;
    }

    const result = await dispatch(
      updateCartItemDetails({
        id: selectedItem.id,
        productId: selectedItem.productId,
        length: selectedLength,
        color: selectedItem.color || "",
        strandQuantity: selectedQuantity,
        setQuantity: selectedItem.setQuantity,
        name: selectedItem.name,
        description: selectedItem.description,
        img: selectedItem.img,
        images: selectedItem.images,
        unitPrice: selectedItem.unitPrice,
        price: selectedItem.price,
        category: selectedItem.category,
        liked: selectedItem.liked,
      }),
    );

    if (result.error) {
      await dispatch(fetchCart());
      alert(result.payload?.error || "Could not update item");
      return;
    }

    await dispatch(fetchCart());
    closeItemModal();
  };

  const selectedImages = selectedItem?.images?.length
    ? selectedItem.images
    : selectedItem?.img
      ? [selectedItem.img]
      : [];
  const selectedUnitPrice = Number(selectedItem?.unitPrice ?? selectedItem?.price ?? 0);
  const selectedTotalPrice =
    selectedUnitPrice *
    Number(selectedItem?.setQuantity ?? 1) *
    Number(selectedQuantity);

  const handleProceedToPayment = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!sortedCart.length) {
      alert(language === "ru" ? "В корзине нет товаров." : language === "fi" ? "Korissa ei ole tuotteita." : "There are no items in the cart.");
      return;
    }

    navigate("/checkout");
  };

  return (
    <>
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
                  onClick={handleRemoveSelected}
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
                  <div className={`${styles.item} ${item.liked ? styles.itemPinned : ""}`}>
                    <div className={styles.itemCheckboxColumn}>
                      <span
                        className={`${styles.itemCheckbox} ${item.selected ? styles.itemCheckboxChecked : ""}`}
                        onClick={() => dispatch(toggleCartItemSelection(item.id))}
                      />
                    </div>
                    <div className={styles.info}>
                      <img
                        className={styles.itemImage}
                        src={item.img}
                        alt={item.name}
                        width={150}
                        height={150}
                        onClick={() => openItemModal(item)}
                      />
                      <div className={styles.text}>
                        <h3>{item.name}</h3>
                        <p className={styles.optionsLine}>
                          {t("cart.length")}: {item.length}
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
                            handleQuantityChange(
                              item.id,
                              item.setQuantity - QUANTITY_STEP,
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
                            handleQuantityChange(
                              item.id,
                              item.setQuantity + QUANTITY_STEP,
                            )
                          }
                        >
                          +
                        </button>
                      </div>

                      <div className={styles.buttons}>
                        <button
                          className={styles.delete}
                          onClick={() => handleRemoveItem(item.id)}
                          aria-label={t("cart.delete")}
                          title={t("cart.delete")}
                        >
                          <TrashIcon />
                        </button>
                        <button
                          className={`${styles.pinButton} ${item.liked ? styles.pinButtonActive : ""}`}
                          onClick={() => dispatch(toggleCartItemLike(item.id))}
                          aria-label={item.liked ? t("cart.unfavorite") : t("cart.favorite")}
                          title={item.liked ? t("cart.unfavorite") : t("cart.favorite")}
                        >
                          <PinIcon active={item.liked} />
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

          <div className={styles.sidebar}>
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
            <button className={styles.pay} onClick={handleProceedToPayment}>
              {t("cart.proceedToPayment")}
            </button>
            </div>
            <div className={styles.orderStatusCard}>
              <h3>{orderLabels.title}</h3>
              {latestOrder ? (
                <>
                  <div className={styles.orderStatusRow}>
                    <span>{orderLabels.date}:</span>
                    <strong>{latestOrderDate}</strong>
                  </div>
                  <div className={styles.orderStatusRow}>
                    <span>{orderLabels.status}:</span>
                    <strong>{orderLabels[latestOrder.status] || latestOrder.status_label}</strong>
                  </div>
                </>
              ) : (
                <p className={styles.orderEmpty}>
                  {language === "ru"
                    ? "Пока нет оформленных заказов."
                    : language === "fi"
                      ? "Tilauksia ei ole viela tehty."
                      : "There are no completed orders yet."}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedItem ? (
        <div className={shopStyles.modalOverlay} onClick={closeItemModal}>
          <div
            className={shopStyles.productModal}
            onClick={(event) => event.stopPropagation()}
          >
            <button className={shopStyles.closeButton} onClick={closeItemModal}>
              ×
            </button>

            <div className={shopStyles.modalContent}>
              <div className={shopStyles.modalForm}>
                <h2>{selectedItem.name}</h2>
                <p>{selectedItem.description}</p>
                <div className={shopStyles.priceBlock}>
                  <strong>{selectedTotalPrice.toFixed(2)} €</strong>
                  <span>{selectedUnitPrice.toFixed(2)} €</span>
                </div>

                <div className={shopStyles.optionBlock}>
                  <h3>{t("shop.modal.length")}</h3>
                  <div className={shopStyles.lengthOptions}>
                    {LENGTH_OPTIONS.map((length) => (
                      <button
                        key={length.value}
                        type="button"
                        className={
                          selectedLength === length.value ? shopStyles.lengthActive : ""
                        }
                        onClick={() => setSelectedLength(length.value)}
                      >
                        {length.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={shopStyles.optionBlock}>
                  <h3>{t("shop.modal.quantity")}</h3>
                  <div className={shopStyles.quantityControl}>
                    <button
                      type="button"
                      onClick={() => adjustModalQuantity(-MODAL_QUANTITY_STEP)}
                    >
                      -
                    </button>
                    <div className={shopStyles.quantityValue}>{selectedQuantity}</div>
                    <button
                      type="button"
                      onClick={() => adjustModalQuantity(MODAL_QUANTITY_STEP)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className={styles.modalActionRow}>
                  <button className={styles.confirmButton} onClick={handleConfirmDetails}>
                    OK
                  </button>
                </div>
              </div>

              <div className={shopStyles.modalPreview}>
                <div className={shopStyles.previewStage}>
                  {selectedImage ? (
                    <img src={selectedImage} alt={selectedItem.name} />
                  ) : null}
                </div>

                {selectedImages.length > 1 ? (
                  <div className={shopStyles.previewScrollerWrap}>
                    <button
                      type="button"
                      className={shopStyles.previewScrollButton}
                      onClick={() => scrollGallery(-1)}
                      aria-label="Scroll gallery backward"
                    >
                      ‹
                    </button>
                    <div className={shopStyles.previewScroller} ref={galleryScrollRef}>
                      {selectedImages.map((image, imageIndex) => (
                        <button
                          key={`${selectedItem.id}-${imageIndex}`}
                          type="button"
                          className={`${shopStyles.previewThumb} ${selectedImage === image ? shopStyles.previewThumbActive : ""}`}
                          onClick={() => setSelectedImage(image)}
                        >
                          <img
                            src={image}
                            alt={`${selectedItem.name} ${imageIndex + 1}`}
                          />
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      className={shopStyles.previewScrollButton}
                      onClick={() => scrollGallery(1)}
                      aria-label="Scroll gallery forward"
                    >
                      ›
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
