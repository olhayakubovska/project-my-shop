import { Link } from "react-router-dom";
import styles from "./categories.module.css";

export const Categories = ({ id, category, onClick }) => {
  return (
    <div className={styles.categoriesContainer} onClick={onClick}>
      <Link to={`/products/category/${id}`}>{category}</Link>
    </div>
  );
};
