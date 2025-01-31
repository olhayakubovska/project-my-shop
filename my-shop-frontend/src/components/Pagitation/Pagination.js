import styles from "./Pagination.module.css";

export const Pagination = ({ page, setPage, lastPage }) => {
  return (
    <div className={styles.container}>
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className={styles.button}
      >
        Предыдущая
      </button>
      <button
        onClick={() => {
          setPage(page + 1);
        }}
        disabled={lastPage === page}
        className={styles.button}
      >
        Следущая
      </button>
    </div>
  );
};
