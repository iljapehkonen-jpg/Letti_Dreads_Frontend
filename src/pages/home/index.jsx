import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.scss";
import { SetItem } from "../../componets";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

export function Home() {
  const { t } = useLanguage();
  const imgInterval = 10;
  const imgs = ["/img_slider1.png", "/img_slider2.png"];
  const popularSets = [
    {
      img: "/dreads_card/prototyp1.jpg",
      name: t("home.popularCards.shop"),
      to: "/shop",
    },
    {
      img: "/dreads_card/prototyp1.jpg",
      name: t("home.popularCards.dreads"),
      to: "/shop/smooth-dreads",
    },
    {
      img: "/dreads_card/prototyp1.jpg",
      name: t("home.popularCards.curls"),
      to: "/shop/curls",
    },
    {
      img: "/dreads_card/prototyp1.jpg",
      name: t("home.popularCards.braids"),
      to: "/shop/braids",
    },
    {
      img: "/dreads_card/prototyp1.jpg",
      name: t("home.popularCards.canikalons"),
      to: "/shop/canikalons",
    },
  ];
  const reviewListRef = useRef(null);
  const [imgCount, setImgCount] = useState(imgInterval);
  const galleryImages = Array(20)
    .fill(0)
    .map(() => "/dreads_card/prototyp1.jpg");
  const imgVisible = galleryImages.slice(0, imgCount);

  const showMore = () => {
    if (galleryImages.length - imgCount > imgInterval) {
      setImgCount((prev) => prev + imgInterval);
    } else {
      setImgCount(galleryImages.length);
    }
  };

  const showLess = () => {
    if (imgCount > imgInterval) {
      setImgCount((prev) => prev - imgInterval);
    } else {
      setImgCount(imgInterval);
    }
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

  return (
    <div className={styles.home}>
      <div
        className={styles.slider}
        style={{ backgroundImage: `url(${imgs[0]})` }}
      >
        <h2>{t("home.heroTitle")}</h2>

        <div className={styles.more}>
          <Link to="/shop">{t("home.heroMore")}</Link>
        </div>
      </div>

      <div className={styles.popularSets}>
        <h3>{t("home.popularTitle")}</h3>
        <div className={styles.setsList}>
          {popularSets.map((set) => (
            <SetItem key={set.name} img={set.img} name={set.name} to={set.to} />
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
          {imgVisible.map((src, idx) => (
            <img key={idx} src={src} alt={`Gallery Image ${idx + 1}`} />
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
            <img src="/dreads_card/prototyp1.jpg" alt="Review 1" />
            <img src="/dreads_card/prototyp1.jpg" alt="Review 2" />
            <img src="/dreads_card/prototyp1.jpg" alt="Review 3" />
            <img src="/dreads_card/prototyp1.jpg" alt="Review 4" />
            <img src="/dreads_card/prototyp1.jpg" alt="Review 5" />
            <img src="/dreads_card/prototyp1.jpg" alt="Review 6" />
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
  );
}
