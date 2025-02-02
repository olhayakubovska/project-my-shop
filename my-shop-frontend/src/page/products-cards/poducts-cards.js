import { Link } from "react-router-dom";

import styles from "./productsCards.module.css";

export const ProductsCards = ({ id, name, image, price }) => {
  return (
    <div  className={styles.productCard}>
      <Link to={`/product/${id}`}>
        <div className={styles.productImage}>
          <img src={image} alt={name} />
        </div>
        <div className={styles.productInfo}>
          <h3 className={styles.productName}>{name}</h3>
          <div className={styles.productPrice}>{price}$ </div>
        </div>
      </Link>
    </div>
  );
};
