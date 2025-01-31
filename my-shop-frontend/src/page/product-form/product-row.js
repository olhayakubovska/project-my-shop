import styles from "./productRow.module.css";

export const ProductRow = ({
  id,
  name,
  image,
  price,
  categoryId,
  description,
  editProduct,
  deleteProduct,
  isSaveButtonDisabled,
}) => {
  return (
    <div key={id}>
      <div className={styles.tableRow}>
        <input className={styles.nameColumn} value={name} onChange={() => {}} />
        <input
          className={styles.priceColumn}
          value={image}
          onChange={() => {}}
        />

        <input
          className={styles.priceColumn}
          value={price}
          onChange={() => {}}
        />

        <input
          className={styles.priceColumn}
          value={categoryId}
          onChange={() => {}}
        />

        <input
          className={styles.priceColumn}
          value={description}
          onChange={() => {}}
        />
        <button
          className={styles.btn}
          onClick={editProduct}
          disabled={isSaveButtonDisabled}
        >
          edit
        </button>

        <button className={styles.btn} onClick={deleteProduct}>
          delete
        </button>
      </div>
    </div>
  );
};
