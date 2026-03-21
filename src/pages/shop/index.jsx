import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ContentLoader from "react-content-loader";
import styles from "./Shop.module.scss";
import { fetchSets } from "../../redux/slices/setSlice";
import { addItemToCart } from "../../redux/slices/cartSlice";
import { SetItem } from "../../componets";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import {
  getCategoryTranslationKey,
  normalizeCategorySlug,
} from "../../utils/categories.js";

const LENGTH_OPTIONS = [
  { value: "45-50 cm", label: "45-50 cm" },
  { value: "55-60 cm", label: "55-60 cm" },
];
const COLOR_OPTIONS = ["Red", "Blue", "Yellow"];
const MIN_QUANTITY = 10;
const DEFAULT_QUANTITY = 60;
const MAX_QUANTITY = 65;
const QUANTITY_STEP = 5;
const PER_PIECE_LABELS = {
  fi: "kpl.",
  en: "pc.",
  ru: "шт.",
};

export function Shop() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sets } = useSelector((state) => state.sets);
  const user = useSelector((state) => state.auth.user);
  const { t, language } = useLanguage();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedLength, setSelectedLength] = useState(LENGTH_OPTIONS[0].value);
  const [selectedQuantity, setSelectedQuantity] = useState(DEFAULT_QUANTITY);
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [selectedImage, setSelectedImage] = useState("");
  const galleryScrollRef = useRef(null);

  useEffect(() => {
    dispatch(fetchSets());
  }, [dispatch]);

  const categoryTitle = useMemo(() => {
    if (!id) {
      return t("shop.title");
    }

    const translationKey = getCategoryTranslationKey(id);
    if (translationKey) {
      return t(translationKey);
    }

    const matchedSet = sets.find(
      (set) => normalizeCategorySlug(set.category) === normalizeCategorySlug(id),
    );

    return matchedSet?.category || id;
  }, [id, sets, t]);

  const filteredSets = useMemo(() => {
    return id
      ? sets.filter(
          (set) => normalizeCategorySlug(set.category) === normalizeCategorySlug(id),
        )
      : sets;
  }, [id, sets]);

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setSelectedLength(LENGTH_OPTIONS[0].value);
    setSelectedQuantity(DEFAULT_QUANTITY);
    setSelectedColor(COLOR_OPTIONS[0]);
    setSelectedImage(product.images?.[0] || product.photo || "");
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    setSelectedImage("");
  };

  const adjustQuantity = (delta) => {
    setSelectedQuantity((prev) =>
      Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, Number(prev) + delta)),
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

  const addCurrentProductToCart = () => {
    if (!selectedProduct) {
      return false;
    }

    if (!user) {
      closeProductModal();
      navigate("/login");
      return false;
    }

    const unitPrice = Number(selectedProduct.price);
    const strandQuantity = Math.min(
      MAX_QUANTITY,
      Math.max(MIN_QUANTITY, Number(selectedQuantity) || DEFAULT_QUANTITY),
    );

    dispatch(
      addItemToCart({
        productId: selectedProduct.id,
        name: selectedProduct.name,
        description: selectedProduct.description,
        img: selectedProduct.photo || selectedProduct.images?.[0] || "",
        images: selectedProduct.images || [],
        unitPrice,
        price: unitPrice,
        strandQuantity,
        setQuantity: 1,
        length: selectedLength,
        color: selectedColor,
        category: selectedProduct.category,
      }),
    );

    return true;
  };

  const handleAddToCart = () => {
    if (addCurrentProductToCart()) {
      closeProductModal();
    }
  };

  const handleBuyNow = () => {
    if (addCurrentProductToCart()) {
      closeProductModal();
      navigate("/cart");
    }
  };

  const selectedImages = selectedProduct?.images?.length
    ? selectedProduct.images
    : selectedProduct?.photo
      ? [selectedProduct.photo]
      : [];
  const selectedUnitPrice = Number(selectedProduct?.price || 0);
  const selectedTotalPrice = selectedUnitPrice * selectedQuantity;
  const perPieceLabel = PER_PIECE_LABELS[language] || PER_PIECE_LABELS.en;

  return (
    <>
      <div className={styles.shop}>
        <h1>{categoryTitle}</h1>
        <div className={styles.shopList}>
          {filteredSets.length
            ? filteredSets.map((set, index) => (
                <SetItem
                  className={styles.shopItem}
                  name={set.name}
                  img={set.photo || set.images?.[0]}
                  price={`${set.price} €`}
                  hideDetails
                  key={index}
                  onClick={() => openProductModal(set)}
                />
              ))
            : new Array(10).fill(0).map((_, index) => (
                <ContentLoader
                  speed={0.5}
                  width={250}
                  height={410}
                  viewBox="0 0 250 410"
                  backgroundColor="#f3f3f3"
                  foregroundColor="#ecebeb"
                  key={index}
                >
                  <rect x="0" y="0" rx="0" ry="0" width="250" height="410" />
                </ContentLoader>
              ))}
        </div>
      </div>

      {selectedProduct ? (
        <div className={styles.modalOverlay} onClick={closeProductModal}>
          <div
            className={styles.productModal}
            onClick={(event) => event.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={closeProductModal}>
              ×
            </button>

            <div className={styles.modalContent}>
              <div className={styles.modalForm}>
                <h2>{selectedProduct.name}</h2>
                <p>{selectedProduct.description}</p>
                <div className={styles.priceBlock}>
                  <strong>{selectedTotalPrice.toFixed(2)} €</strong>
                  <span>
                    {selectedUnitPrice.toFixed(2)} € / {perPieceLabel}
                  </span>
                </div>

                <div className={styles.optionBlock}>
                  <h3>{t("shop.modal.length")}</h3>
                  <div className={styles.lengthOptions}>
                    {LENGTH_OPTIONS.map((length) => (
                      <button
                        key={length.value}
                        type="button"
                        className={
                          selectedLength === length.value ? styles.lengthActive : ""
                        }
                        onClick={() => setSelectedLength(length.value)}
                      >
                        {length.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.optionBlock}>
                  <h3>{t("shop.modal.quantity")}</h3>
                  <div className={styles.quantityControl}>
                    <button
                      type="button"
                      onClick={() => adjustQuantity(-QUANTITY_STEP)}
                    >
                      -
                    </button>
                    <div className={styles.quantityValue}>{selectedQuantity}</div>
                    <button
                      type="button"
                      onClick={() => adjustQuantity(QUANTITY_STEP)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className={styles.optionBlock}>
                  <h3>{t("shop.modal.colors")}</h3>
                  <div className={styles.lengthOptions}>
                    {COLOR_OPTIONS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={
                          selectedColor === color ? styles.lengthActive : ""
                        }
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.actionButtons}>
                  <button className={styles.payNowButton} onClick={handleBuyNow}>
                    {t("shop.modal.buyNow")}
                  </button>
                  <button
                    className={styles.addToCartButton}
                    onClick={handleAddToCart}
                  >
                    {t("shop.modal.addToCart")}
                  </button>
                </div>
              </div>

              <div className={styles.modalPreview}>
                <div className={styles.previewStage}>
                  {selectedImage ? (
                    <img src={selectedImage} alt={selectedProduct.name} />
                  ) : null}
                </div>

                {selectedImages.length > 1 ? (
                  <div className={styles.previewScrollerWrap}>
                    <button
                      type="button"
                      className={`${styles.previewScrollButton} ${styles.previewScrollBack}`}
                      onClick={() => scrollGallery(-1)}
                      aria-label="Scroll gallery backward"
                    >
                      ‹
                    </button>
                    <div className={styles.previewScroller} ref={galleryScrollRef}>
                      {selectedImages.map((image, imageIndex) => (
                        <button
                          key={`${selectedProduct.id}-${imageIndex}`}
                          type="button"
                          className={`${styles.previewThumb} ${selectedImage === image ? styles.previewThumbActive : ""}`}
                          onClick={() => setSelectedImage(image)}
                        >
                          <img
                            src={image}
                            alt={`${selectedProduct.name} ${imageIndex + 1}`}
                          />
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      className={`${styles.previewScrollButton} ${styles.previewScrollForward}`}
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
}
