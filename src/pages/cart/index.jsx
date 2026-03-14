import React from "react";
import styles from "./Cart.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart } from "../../redux/slices/cartSlice";
import { useEffect } from "react";
import { use } from "react";

export const Cart = () => {
  const text = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.`;

  const dispatch = useDispatch();
  const { cart, status } = useSelector((state) => state.cart);
  useEffect(() => {
    dispatch(fetchCart(1));
  }, [dispatch]);

  // quantity state for three items (one per .items block)
  const [quantities, setQuantities] = React.useState([1, 1, 1]);
  // liked state to track which items are "liked" (yellow)
  const [liked, setLiked] = React.useState([false, false, false]);
  // state for "select all" checkbox
  const [selectAllChecked, setSelectAllChecked] = React.useState(false);
  // state for individual items selection
  const [selectedItems, setSelectedItems] = React.useState([
    false,
    false,
    false,
  ]);

  const changeQuantity = (index, delta) => {
    console.log("changeQuantity", index, delta);
    setQuantities((prev) => {
      const copy = [...prev];
      copy[index] = Math.max(1, copy[index] + delta);
      return copy;
    });
  };

  const toggleLike = (index) => {
    setLiked((prev) => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  const toggleSelectAll = () => {
    // flip select-all and set every item to the same state
    setSelectAllChecked((prev) => {
      const newChecked = !prev;
      setSelectedItems([newChecked, newChecked, newChecked]);
      return newChecked;
    });
  };

  const toggleItem = (index) => {
    setSelectedItems((prev) => {
      const copy = [...prev];
      if (selectAllChecked) {
        // if select-all is on, clicking any item should turn that item off
        // and unset select-all, leaving other items unchanged
        copy[index] = false;
        setSelectAllChecked(false);
      } else {
        copy[index] = !copy[index];
      }
      return copy;
    });
  };

  return (
    <div className={styles.cart}>
      <h2>Cart</h2>
      <div className={styles.content}>
        <div className={styles.leftInfo}>
          <div className={styles.selectAllPanel}>
            <div
              className={styles.selectAll}
              onClick={toggleSelectAll}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <span
                className={`${styles.checkbox} ${selectAllChecked ? styles.checkboxChecked : ""}`}
              />
              Select all
            </div>
            <div className={styles.buttonPanel}>
              <button className={styles.delete}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13 4H3C2.724 4 2.5 3.7765 2.5 3.5C2.5 3.224 2.724 3 3 3H13C13.276 3 13.5 3.224 13.5 3.5C13.5 3.7765 13.276 4 13 4ZM12.5 14C12.5 14.552 12.052 15 11.5 15H4.5C3.948 15 3.5 14.552 3.5 14V5H12.5V14ZM6.5 1.5C6.5 1.2235 6.724 1 7 1H9C9.276 1 9.5 1.2235 9.5 1.5V2H6.5V1.5ZM13.5 2H10.5V1C10.5 0.448 10.052 0 9.5 0H6.5C5.948 0 5.5 0.448 5.5 1V2H2.5C1.948 2 1.5 2.448 1.5 3V4C1.5 4.552 1.948 5 2.5 5V14C2.5 15.1045 3.3955 16 4.5 16H11.5C12.6045 16 13.5 15.1045 13.5 14V5C14.052 5 14.5 4.552 14.5 4V3C14.5 2.448 14.052 2 13.5 2ZM8 14C8.276 14 8.5 13.7765 8.5 13.5V7.5C8.5 7.224 8.276 7 8 7C7.724 7 7.5 7.224 7.5 7.5V13.5C7.5 13.7765 7.724 14 8 14ZM5.5 14C5.776 14 6 13.7765 6 13.5V7.5C6 7.224 5.776 7 5.5 7C5.224 7 5 7.224 5 7.5V13.5C5 13.7765 5.224 14 5.5 14ZM10.5 14C10.776 14 11 13.7765 11 13.5V7.5C11 7.224 10.776 7 10.5 7C10.224 7 10 7.224 10 7.5V13.5C10 13.7765 10.224 14 10.5 14Z"
                    fill="#C2C2C2"
                  />
                </svg>
              </button>
              <button className={styles.shere}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g mask="url(#mask0_2004_19)">
                    <path
                      d="M16 7.20087L8.85933 1.39429V4.35701C1.89925 4.41376 -0.68256 9.60375 0.150815 14.6055C1.67257 11.4963 4.83566 10.2718 8.85933 10.1323V13.0075L16 7.20087Z"
                      fill="#C2C2C2"
                    />
                  </g>
                </svg>
              </button>
            </div>
          </div>

          <div className={styles.items}>
            <div className={styles.item}>
              <span
                className={`${styles.itemCheckbox} ${selectedItems[0] ? styles.itemCheckboxChecked : ""}`}
                onClick={() => toggleItem(0)}
              />
              <div className={styles.info}>
                <img src="logo.jpeg" alt="imgItem" width={150} height={150} />
                <div className={styles.text}>
                  <h3>item1</h3>
                  <p className={styles.truncate3} title={text}>
                    {text}
                  </p>
                </div>
              </div>

              <div className={styles.price}>
                <h3>300$</h3>
              </div>
              <div className={styles.button}>
                <div className={styles.quantityControl}>
                  <button
                    type="button"
                    className={styles.minus}
                    onClick={() => changeQuantity(0, -1)}
                  >
                    -
                  </button>
                  <div className={styles.quantity}>{quantities[0]}</div>
                  <button
                    type="button"
                    className={styles.plus}
                    onClick={() => changeQuantity(0, 1)}
                  >
                    +
                  </button>
                </div>

                <div className={styles.buttons}>
                  <button className={styles.delete}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13 4H3C2.724 4 2.5 3.7765 2.5 3.5C2.5 3.224 2.724 3 3 3H13C13.276 3 13.5 3.224 13.5 3.5C13.5 3.7765 13.276 4 13 4ZM12.5 14C12.5 14.552 12.052 15 11.5 15H4.5C3.948 15 3.5 14.552 3.5 14V5H12.5V14ZM6.5 1.5C6.5 1.2235 6.724 1 7 1H9C9.276 1 9.5 1.2235 9.5 1.5V2H6.5V1.5ZM13.5 2H10.5V1C10.5 0.448 10.052 0 9.5 0H6.5C5.948 0 5.5 0.448 5.5 1V2H2.5C1.948 2 1.5 2.448 1.5 3V4C1.5 4.552 1.948 5 2.5 5V14C2.5 15.1045 3.3955 16 4.5 16H11.5C12.6045 16 13.5 15.1045 13.5 14V5C14.052 5 14.5 4.552 14.5 4V3C14.5 2.448 14.052 2 13.5 2ZM8 14C8.276 14 8.5 13.7765 8.5 13.5V7.5C8.5 7.224 8.276 7 8 7C7.724 7 7.5 7.224 7.5 7.5V13.5C7.5 13.7765 7.724 14 8 14ZM5.5 14C5.776 14 6 13.7765 6 13.5V7.5C6 7.224 5.776 7 5.5 7C5.224 7 5 7.224 5 7.5V13.5C5 13.7765 5.224 14 5.5 14ZM10.5 14C10.776 14 11 13.7765 11 13.5V7.5C11 7.224 10.776 7 10.5 7C10.224 7 10 7.224 10 7.5V13.5C10 13.7765 10.224 14 10.5 14Z"
                        fill="#C2C2C2"
                      />
                    </svg>
                  </button>
                  <button className={styles.like} onClick={() => toggleLike(0)}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.3375 1.54272H4.85248C4.20443 1.54404 3.5833 1.80207 3.12505 2.26031C2.66683 2.71855 2.4088 3.33967 2.40748 3.98772V13.0677C2.40678 13.3414 2.48241 13.6098 2.62588 13.8428C2.76935 14.0758 2.97498 14.2643 3.21965 14.3869C3.4643 14.5094 3.7383 14.5613 4.01085 14.5368C4.2834 14.5122 4.54368 14.4121 4.76248 14.2477L7.81248 11.9627C7.89455 11.9018 7.99403 11.869 8.09623 11.869C8.19843 11.869 8.2979 11.9018 8.37998 11.9627L11.4275 14.2452C11.646 14.4097 11.9061 14.5099 12.1785 14.5347C12.4509 14.5594 12.7248 14.5078 12.9695 14.3855C13.2141 14.2631 13.4198 14.075 13.5634 13.8422C13.707 13.6095 13.7829 13.3413 13.7825 13.0677V3.98772C13.7812 3.33967 13.5231 2.71855 13.0649 2.26031C12.6067 1.80207 11.9855 1.54404 11.3375 1.54272Z"
                        fill={liked[0] ? "#FFD700" : "#C2C2C2"}
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.items}>
            <div className={styles.item}>
              <span
                className={`${styles.itemCheckbox} ${selectedItems[1] ? styles.itemCheckboxChecked : ""}`}
                onClick={() => toggleItem(1)}
              />
              <div className={styles.info}>
                <img src="logo.jpeg" alt="imgItem" width={150} height={150} />
                <div className={styles.text}>
                  <h3>item1</h3>
                  <p className={styles.truncate3} title={text}>
                    {text}
                  </p>
                </div>
              </div>

              <div className={styles.price}>
                <h3>300$</h3>
              </div>
              <div className={styles.button}>
                <div className={styles.quantityControl}>
                  <button
                    type="button"
                    className={styles.minus}
                    onClick={() => changeQuantity(1, -1)}
                  >
                    -
                  </button>
                  <div className={styles.quantity}>{quantities[1]}</div>
                  <button
                    type="button"
                    className={styles.plus}
                    onClick={() => changeQuantity(1, 1)}
                  >
                    +
                  </button>
                </div>

                <div className={styles.buttons}>
                  <button className={styles.delete}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13 4H3C2.724 4 2.5 3.7765 2.5 3.5C2.5 3.224 2.724 3 3 3H13C13.276 3 13.5 3.224 13.5 3.5C13.5 3.7765 13.276 4 13 4ZM12.5 14C12.5 14.552 12.052 15 11.5 15H4.5C3.948 15 3.5 14.552 3.5 14V5H12.5V14ZM6.5 1.5C6.5 1.2235 6.724 1 7 1H9C9.276 1 9.5 1.2235 9.5 1.5V2H6.5V1.5ZM13.5 2H10.5V1C10.5 0.448 10.052 0 9.5 0H6.5C5.948 0 5.5 0.448 5.5 1V2H2.5C1.948 2 1.5 2.448 1.5 3V4C1.5 4.552 1.948 5 2.5 5V14C2.5 15.1045 3.3955 16 4.5 16H11.5C12.6045 16 13.5 15.1045 13.5 14V5C14.052 5 14.5 4.552 14.5 4V3C14.5 2.448 14.052 2 13.5 2ZM8 14C8.276 14 8.5 13.7765 8.5 13.5V7.5C8.5 7.224 8.276 7 8 7C7.724 7 7.5 7.224 7.5 7.5V13.5C7.5 13.7765 7.724 14 8 14ZM5.5 14C5.776 14 6 13.7765 6 13.5V7.5C6 7.224 5.776 7 5.5 7C5.224 7 5 7.224 5 7.5V13.5C5 13.7765 5.224 14 5.5 14ZM10.5 14C10.776 14 11 13.7765 11 13.5V7.5C11 7.224 10.776 7 10.5 7C10.224 7 10 7.224 10 7.5V13.5C10 13.7765 10.224 14 10.5 14Z"
                        fill="#C2C2C2"
                      />
                    </svg>
                  </button>
                  <button className={styles.like} onClick={() => toggleLike(1)}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.3375 1.54272H4.85248C4.20443 1.54404 3.5833 1.80207 3.12505 2.26031C2.66683 2.71855 2.4088 3.33967 2.40748 3.98772V13.0677C2.40678 13.3414 2.48241 13.6098 2.62588 13.8428C2.76935 14.0758 2.97498 14.2643 3.21965 14.3869C3.4643 14.5094 3.7383 14.5613 4.01085 14.5368C4.2834 14.5122 4.54368 14.4121 4.76248 14.2477L7.81248 11.9627C7.89455 11.9018 7.99403 11.869 8.09623 11.869C8.19843 11.869 8.2979 11.9018 8.37998 11.9627L11.4275 14.2452C11.646 14.4097 11.9061 14.5099 12.1785 14.5347C12.4509 14.5594 12.7248 14.5078 12.9695 14.3855C13.2141 14.2631 13.4198 14.075 13.5634 13.8422C13.707 13.6095 13.7829 13.3413 13.7825 13.0677V3.98772C13.7812 3.33967 13.5231 2.71855 13.0649 2.26031C12.6067 1.80207 11.9855 1.54404 11.3375 1.54272Z"
                        fill={liked[1] ? "#FFD700" : "#C2C2C2"}
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.items}>
            <div className={styles.item}>
              <span
                className={`${styles.itemCheckbox} ${selectedItems[2] ? styles.itemCheckboxChecked : ""}`}
                onClick={() => toggleItem(2)}
              />
              <div className={styles.info}>
                <img src="logo.jpeg" alt="imgItem" width={150} height={150} />
                <div className={styles.text}>
                  <h3>item1</h3>
                  <p className={styles.truncate3} title={text}>
                    {text}
                  </p>
                </div>
              </div>

              <div className={styles.price}>
                <h3>300$</h3>
              </div>
              <div className={styles.button}>
                <div className={styles.quantityControl}>
                  <button
                    type="button"
                    className={styles.minus}
                    onClick={() => changeQuantity(2, -1)}
                  >
                    -
                  </button>
                  <div className={styles.quantity}>{quantities[2]}</div>
                  <button
                    type="button"
                    className={styles.plus}
                    onClick={() => changeQuantity(2, 1)}
                  >
                    +
                  </button>
                </div>

                <div className={styles.buttons}>
                  <button className={styles.delete}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13 4H3C2.724 4 2.5 3.7765 2.5 3.5C2.5 3.224 2.724 3 3 3H13C13.276 3 13.5 3.224 13.5 3.5C13.5 3.7765 13.276 4 13 4ZM12.5 14C12.5 14.552 12.052 15 11.5 15H4.5C3.948 15 3.5 14.552 3.5 14V5H12.5V14ZM6.5 1.5C6.5 1.2235 6.724 1 7 1H9C9.276 1 9.5 1.2235 9.5 1.5V2H6.5V1.5ZM13.5 2H10.5V1C10.5 0.448 10.052 0 9.5 0H6.5C5.948 0 5.5 0.448 5.5 1V2H2.5C1.948 2 1.5 2.448 1.5 3V4C1.5 4.552 1.948 5 2.5 5V14C2.5 15.1045 3.3955 16 4.5 16H11.5C12.6045 16 13.5 15.1045 13.5 14V5C14.052 5 14.5 4.552 14.5 4V3C14.5 2.448 14.052 2 13.5 2ZM8 14C8.276 14 8.5 13.7765 8.5 13.5V7.5C8.5 7.224 8.276 7 8 7C7.724 7 7.5 7.224 7.5 7.5V13.5C7.5 13.7765 7.724 14 8 14ZM5.5 14C5.776 14 6 13.7765 6 13.5V7.5C6 7.224 5.776 7 5.5 7C5.224 7 5 7.224 5 7.5V13.5C5 13.7765 5.224 14 5.5 14ZM10.5 14C10.776 14 11 13.7765 11 13.5V7.5C11 7.224 10.776 7 10.5 7C10.224 7 10 7.224 10 7.5V13.5C10 13.7765 10.224 14 10.5 14Z"
                        fill="#C2C2C2"
                      />
                    </svg>
                  </button>
                  <button className={styles.like} onClick={() => toggleLike(2)}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.3375 1.54272H4.85248C4.20443 1.54404 3.5833 1.80207 3.12505 2.26031C2.66683 2.71855 2.4088 3.33967 2.40748 3.98772V13.0677C2.40678 13.3414 2.48241 13.6098 2.62588 13.8428C2.76935 14.0758 2.97498 14.2643 3.21965 14.3869C3.4643 14.5094 3.7383 14.5613 4.01085 14.5368C4.2834 14.5122 4.54368 14.4121 4.76248 14.2477L7.81248 11.9627C7.89455 11.9018 7.99403 11.869 8.09623 11.869C8.19843 11.869 8.2979 11.9018 8.37998 11.9627L11.4275 14.2452C11.646 14.4097 11.9061 14.5099 12.1785 14.5347C12.4509 14.5594 12.7248 14.5078 12.9695 14.3855C13.2141 14.2631 13.4198 14.075 13.5634 13.8422C13.707 13.6095 13.7829 13.3413 13.7825 13.0677V3.98772C13.7812 3.33967 13.5231 2.71855 13.0649 2.26031C12.6067 1.80207 11.9855 1.54404 11.3375 1.54272Z"
                        fill={liked[2] ? "#FFD700" : "#C2C2C2"}
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.cartPay}>
          <h3>Your cart</h3>
          <div className={styles.cartPayInfo}>
            <div className={styles.textCartPay}>
              <p>Products:</p>
              <p>Discounts:</p>
            </div>
            <div className={styles.periseCartPay}>
              <div>300$</div>
              <div>0$</div>
            </div>
          </div>
          <div className={styles.total}>
            <p>Total:</p>
            <div>300$</div>
          </div>
          <button className={styles.pay}>Proceed to payment</button>
        </div>
      </div>
    </div>
  );
};
