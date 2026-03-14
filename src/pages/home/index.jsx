import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.scss";
import { SetItem } from "../../componets";

export function Home() {
  const imgInterval = 10;
  const imgs = ["/img_slider1.png", "/img_slider2.png"];
  const [imgSrc, setImgSrc] = useState(0);
  const reviewListRef = useRef(null);
  const [imgCount, setImgCount] = useState(imgInterval);
  const galleryImages = Array(20)
    .fill(0)
    .map((_, i) => `/dreads_card/prototyp1.jpg`);
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
        style={{ backgroundImage: `url(${imgs[imgSrc]})` }}
      >
        <h2>SETS IN STOCK</h2>

        <div className={styles.more}>
          <Link to={"/shop"}>More </Link>
        </div>
      </div>
      <div className={styles.popularSets}>
        <h3>POPULAR SETS</h3>
        <div className={styles.setsList}>
          <SetItem
            img={"/dreads_card/prototyp1.jpg"}
            name={"öalksdfjaölskdfjaösldkf"}
            price={"from 300€"}
          />
          <SetItem
            img={"/dreads_card/prototyp1.jpg"}
            name={"öalksdfjaölskdfjaösldkf"}
            price={"from 300€"}
          />
          <SetItem
            img={"/dreads_card/prototyp1.jpg"}
            name={"öalksdfjaölskdfjaösldkf"}
            price={"from 300€"}
          />
          <SetItem
            img={"/dreads_card/prototyp1.jpg"}
            name={"öalksdfjaölskdfjaöslasdfasdfasdfasdfdkf"}
            price={"from 300€"}
          />
          <SetItem
            img={"/dreads_card/prototyp1.jpg"}
            name={"öalksdasdfasdfasdfasdfasdffjaölskdfjaösldkf"}
            price={"from 300€"}
          />
        </div>
      </div>
      <div className={styles.aboutWe}>
        <h2>Who we are?</h2>
        <p>
          Letti Dreads is a creative hair studio with more than seven years of
          experience in the world of alternative hair styling. Since the
          beginning, our mission has been simple: to help people express their
          individuality through unique, high-quality hair designs. We specialize
          in handcrafted synthetic hair styles, including dreadlocks, braids,
          and curls. Every piece is carefully made with attention to detail,
          ensuring durability, comfort, and a natural look. Our work combines
          craftsmanship, creativity, and professional technique to create styles
          that truly stand out. In addition to producing custom synthetic hair
          pieces, we also provide professional installation and safe removal
          services. This allows our clients to enjoy their new look with
          confidence, knowing that their hair is treated with care and expertise
          at every stage. Over the years, Letti Dreads has grown thanks to the
          trust of our clients and our passion for what we do. We believe that
          hair is more than just a style — it is a form of self-expression,
          identity, and creativity. That is why we dedicate ourselves to
          creating looks that make every client feel unique and confident.
        </p>
      </div>
      <div className={styles.gallery}>
        <h2>Gallery</h2>
        <div className={styles.galleryList}>
          {imgVisible.map((src, idx) => (
            <img key={idx} src={src} alt={`Gallery Image ${idx + 1}`} />
          ))}
        </div>
        <div className={styles.galleryNav}>
          {
            <button
              className={`${styles.scrollButton} ${styles.up}`}
              onClick={showLess}
              disabled={imgCount <= imgInterval}
            >
              &#8593;
            </button>
          }
          {
            <button
              className={`${styles.scrollButton} ${styles.down}`}
              onClick={showMore}
              disabled={imgCount >= galleryImages.length}
            >
              &#8595;
            </button>
          }
        </div>
      </div>
      <div className={styles.review}>
        <h2>Reviews</h2>
        <div className={styles.reviewContainer}>
          <button
            className={styles.scrollButton}
            onClick={() => scroll("left")}
          >
            &#8249;
          </button>
          <div className={styles.reviewList} ref={reviewListRef}>
            <img src={"/dreads_card/prototyp1.jpg"} alt="Gallery Image 1" />
            <img src={"/dreads_card/prototyp1.jpg"} alt="Gallery Image 2" />
            <img src={"/dreads_card/prototyp1.jpg"} alt="Gallery Image 3" />
            <img src={"/dreads_card/prototyp1.jpg"} alt="Gallery Image 1" />
            <img src={"/dreads_card/prototyp1.jpg"} alt="Gallery Image 2" />
            <img src={"/dreads_card/prototyp1.jpg"} alt="Gallery Image 3" />
            <img src={"/dreads_card/prototyp1.jpg"} alt="Gallery Image 1" />
            <img src={"/dreads_card/prototyp1.jpg"} alt="Gallery Image 2" />
            <img src={"/dreads_card/prototyp1.jpg"} alt="Gallery Image 3" />
            <img src={"/dreads_card/prototyp1.jpg"} alt="Gallery Image 1" />
            <img src={"/dreads_card/prototyp1.jpg"} alt="Gallery Image 2" />
            <img src={"/dreads_card/prototyp1.jpg"} alt="Gallery Image 3" />
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
