import React from "react";
import { Link } from "react-router-dom";
import styles from "./SetItem.module.scss";

export function SetItem({
  img,
  name,
  price,
  category,
  to,
  onClick,
  hideDetails = false,
  className = "",
}) {
  const content = (
    <>
      <img src={img} alt={name || "set image"} />
      {!hideDetails ? <h4>{name}</h4> : null}
      {!hideDetails && category ? (
        <span className={styles.category}>{category}</span>
      ) : null}
      {!hideDetails && price ? <p>{price}</p> : null}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`${styles.setItem} ${className}`.trim()}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        className={`${styles.setItem} ${styles.setItemButton} ${className}`.trim()}
        onClick={onClick}
      >
        {content}
      </button>
    );
  }

  return <div className={`${styles.setItem} ${className}`.trim()}>{content}</div>;
}
