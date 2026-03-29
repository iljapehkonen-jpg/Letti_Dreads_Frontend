import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Home.module.scss";
import { SetItem } from "../../componets";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import axios from "../../axios.js";

const INSTAGRAM_URL = "https://www.instagram.com/letti_dreads/";
const INSTAGRAM_LABELS = {
  fi: "Lisää kuvia Instagramissa",
  en: "More photos on Instagram",
  ru: "Больше фотографий в Instagram",
};

export function Home() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const curlsOnMiniDreadLabel =
    language === "fi" ? "Kiharat pikku rastalla" : t("shop.categories.curls-on-mini-dread");
  const imgInterval = 12;
  const imgs = ["/img_slider1.png", "/img_slider2.png"];
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [showDreadsModal, setShowDreadsModal] = useState(false);
  const popularSets = [
    {
      img: "/homNav/Rastat.jpg",
      name: t("shop.categories.dreads"),
      onClick: () => setShowDreadsModal(true),
    },
    {
      img: "/homNav/Kiharat.jpg",
      name: t("shop.categories.curls"),
      to: "/shop/curls",
    },
    {
      img: "/homNav/Letit.jpg",
      name: t("shop.categories.braids"),
      to: "/shop/braids",
    },
    {
      img: "/homNav/HiuksetLetillä.jpg",
      name: t("shop.categories.hair-on-braid"),
      to: "/shop/hair-on-braid",
    },
    {
      img: "/dreads_card/prototyp1.jpg",
      name: curlsOnMiniDreadLabel,
      to: "/shop/curls-on-mini-dread",
    },
  ];
  const reviewListRef = useRef(null);
  const [imgCount, setImgCount] = useState(imgInterval);
  const [galleryImages, setGalleryImages] = useState([]);
  const [reviewImages, setReviewImages] = useState([]);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const imgVisible = galleryImages.slice(0, imgCount);
  const galleryLightboxImages = imgVisible.slice(1);
  const galleryPreviewImage = imgVisible[0] || "/dreads_card/prototyp1.jpg";
  const instagramLabel = INSTAGRAM_LABELS[language] || INSTAGRAM_LABELS.en;

  useEffect(() => {
    const loadHomeMedia = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/products/home-media/");
        setGalleryImages(response.data?.gallery ?? []);
        setReviewImages(response.data?.reviews ?? []);
      } catch {
        setGalleryImages([]);
        setReviewImages([]);
      }
    };

    loadHomeMedia();
  }, []);

  useEffect(() => {
    if (imgs.length < 2) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % imgs.length);
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, [imgs.length]);

  const showMore = () => {
    setImgCount((prev) => Math.min(prev + imgInterval, galleryImages.length));
  };

  const showLess = () => {
    setImgCount((prev) => Math.max(prev - imgInterval, imgInterval));
  };

  const scroll = (direction) => {
    if (reviewListRef.current) {
      const scrollAmount = 250;
      reviewListRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleDreadChoice = (slug) => {
    setShowDreadsModal(false);
    navigate(`/shop/${slug}`);
  };

  const openLightbox = (images, index) => {
    setLightboxImages(images);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxImages([]);
    setLightboxIndex(0);
  };

  const showPrevLightboxImage = () => {
    setLightboxIndex((prev) =>
      prev === 0 ? lightboxImages.length - 1 : prev - 1,
    );
  };

  const showNextLightboxImage = () => {
    setLightboxIndex((prev) =>
      prev === lightboxImages.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <>
      <div className={styles.home}>
        <div
          className={styles.slider}
          style={{
            backgroundImage: `url(${imgs[currentHeroImage]})`,
            backgroundSize: "cover",
            backgroundPosition:
              currentHeroImage === 1 ? "center center" : "center top",
          }}
        >
          <h2>{t("home.heroTitle")}</h2>

          <div className={styles.more}>
            <Link to="/instock">{t("home.heroMore")}</Link>
          </div>
        </div>

        <div className={styles.popularSets}>
          <div className={styles.setsList}>
            {popularSets.map((set) => (
              <SetItem
                key={set.name}
                img={set.img}
                name={set.name}
                to={set.to}
                onClick={set.onClick}
              />
            ))}
          </div>
        </div>

        <div className={styles.aboutWe}>
          <h2>{t("home.aboutTitle")}</h2>
          <p>{t("home.aboutText")}</p>
        </div>

        <div className={styles.gallery}>
          <h2>{t("home.galleryTitle")}</h2>
          <div className={styles.galleryList}>
            <a
              href={INSTAGRAM_URL}
              className={`${styles.mediaButton} ${styles.instagramCard}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={galleryPreviewImage} alt="Instagram Letti Dreads" />
              <span>{instagramLabel}</span>
            </a>
            {imgVisible.slice(1).map((src, idx) => (
              <button
                type="button"
                key={src + idx}
                className={styles.mediaButton}
                onClick={() => openLightbox(galleryLightboxImages, idx)}
              >
                <img src={src} alt={`Gallery Image ${idx + 2}`} />
              </button>
            ))}
          </div>
          <div className={styles.galleryNav}>
            <button
              className={`${styles.scrollButton} ${styles.up}`}
              onClick={showLess}
              disabled={imgCount <= imgInterval}
            >
              &#8593;
            </button>
            <button
              className={`${styles.scrollButton} ${styles.down}`}
              onClick={showMore}
              disabled={imgCount >= galleryImages.length}
            >
              &#8595;
            </button>
          </div>
        </div>

        <div className={styles.review}>
          <h2>{t("home.reviewsTitle")}</h2>
          <div className={styles.reviewContainer}>
            <button
              className={styles.scrollButton}
              onClick={() => scroll("left")}
            >
              &#8249;
            </button>
            <div className={styles.reviewList} ref={reviewListRef}>
              {reviewImages.map((src, idx) => (
                <button
                  type="button"
                  key={idx}
                  className={styles.mediaButton}
                  onClick={() => openLightbox(reviewImages, idx)}
                >
                  <img src={src} alt={`Review ${idx + 1}`} />
                </button>
              ))}
            </div>
            <button
              className={styles.scrollButton}
              onClick={() => scroll("right")}
            >
              &#8250;
            </button>
          </div>
        </div>
      </div>

      {showDreadsModal ? (
        <div
          className={styles.dreadsModalOverlay}
          onClick={() => setShowDreadsModal(false)}
        >
          <div
            className={styles.dreadsModal}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className={styles.dreadsClose}
              onClick={() => setShowDreadsModal(false)}
            >
              ×
            </button>
            <div className={styles.dreadsChoices}>
              <button
                type="button"
                className={styles.dreadsChoice}
                onClick={() => handleDreadChoice("smooth-dreads")}
              >
                <img src="/dreads_card/prototyp1.jpg" alt={t("shop.categories.smooth-dreads")} />
                <span>{t("shop.categories.smooth-dreads")}</span>
              </button>
              <button
                type="button"
                className={styles.dreadsChoice}
                onClick={() => handleDreadChoice("textured-dreads")}
              >
                <img
                  src="/dreads_card/prototyp1.jpg"
                  alt={t("shop.categories.textured-dreads")}
                />
                <span>{t("shop.categories.textured-dreads")}</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {lightboxImages.length ? (
        <div className={styles.lightboxOverlay} onClick={closeLightbox}>
          <div
            className={styles.lightboxStage}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className={`${styles.lightboxArrow} ${styles.lightboxArrowLeft}`}
              onClick={showPrevLightboxImage}
              aria-label="Previous image"
            >
              ‹
            </button>
            <img
              className={styles.lightboxImage}
              src={lightboxImages[lightboxIndex]}
              alt={`Preview ${lightboxIndex + 1}`}
            />
            <button
              type="button"
              className={`${styles.lightboxArrow} ${styles.lightboxArrowRight}`}
              onClick={showNextLightboxImage}
              aria-label="Next image"
            >
              ›
            </button>
            <button
              type="button"
              className={styles.lightboxClose}
              onClick={closeLightbox}
              aria-label="Close preview"
            >
              ×
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
