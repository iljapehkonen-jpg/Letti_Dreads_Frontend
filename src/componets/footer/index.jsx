import { Link } from "react-router-dom";
import styles from "./footer.module.scss";

export function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.footerItem}>
        <img
          src="/image_no_bg (1).png"
          alt="Letti Dreads Logo"
          className={styles.footerLogo}
        />
      </div>
      <div className={styles.footerItem}>
        <ul className={styles.menuList}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/cart">Cart</Link>
          </li>
          <li>
            <Link to="/contacts">Contacts</Link>
          </li>
          <li>
            <Link to="/make_to_order">Make to order</Link>
          </li>
          <li>
            <Link to="/users">Users</Link>
          </li>
        </ul>
      </div>
      <div className={styles.footerItem}>
        <div className={styles.contactInfo}>
          <p>Phone: +358 99 9999999</p>
          <p>Email: info@lettidreads.fi</p>
          <p>Address: Helsinki, Finland</p>
        </div>
      </div>
    </div>
  );
}
