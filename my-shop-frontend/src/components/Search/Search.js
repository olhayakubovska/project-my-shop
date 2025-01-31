import styles from "./search.module.css";

export const Search= ({ searchPhrase,setSearchPhrase }) => {
  return (
    <div className={styles.searchSection}>
    <div className={styles.search}>
      <input
        className={styles.searchInput}
        placeholder="Search..."
        value={searchPhrase}
        onChange={({ target }) => setSearchPhrase(target.value)}
      />
      <div className={styles.searchIcon}>
        <i className="fa fa-search" aria-hidden="true"></i>
      </div>
    </div>
  </div>
  );
};

