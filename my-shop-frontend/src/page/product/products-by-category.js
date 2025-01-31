import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { request } from "../../request";
import { useParams } from "react-router-dom";
import { Categories, Pagination, Search } from "../../components";
import Loader from "../../components/Loader/Loader";
import styles from "../products-cards/productsCards.module.css";

export const ProductsByCategory = () => {
  const { id } = useParams();
  const [searchPhrase, setSearchPhrase] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [productsFromServer, setProducts] = useState([]);
  const [selectedSort, setSelectSort] = useState("desc");

  const limit = 3;
  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        setLoading(true);

        const fetchedCategories = await request("/categories");
        setCategories(fetchedCategories);

        const { productsByCategoryId, error, lastPage } = await request(
          `/products/category/${id}?page=${page}&limit=${limit}`
        );
        setLastPage(lastPage);
        if (error) {
          throw new Error(error);
        }
        setProducts(productsByCategoryId);
      } catch (e) {
        console.error("Ошибка при загрузке данных:", e.message);
        setError(e.message || "Не удалось загрузить данные.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndProducts();
  }, [id, page]);

  const productsToDisplay = () => {
    let updatedProducts = productsFromServer;

    updatedProducts = updatedProducts.filter((product) => {
      return searchPhrase
        ? product.name.toLowerCase().includes(searchPhrase.toLowerCase())
        : true;
    });

    updatedProducts = updatedProducts.sort((a, b) => {
      if (selectedSort === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });

    return updatedProducts;
  };
  return (
    <>
      {error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div className={styles.main}>
          <Search
            setSearchPhrase={setSearchPhrase}
            searchPhrase={searchPhrase}
          />
          {loading ? (
            <Loader />
          ) : (
            <div className={styles.mainSection}>
              <div className={styles.categories}>
                <h2>Категории:</h2>
                <div className={styles.categoryItems}>
                  {categories.map(({ id, category }) => (
                    <Categories category={category} key={id} id={id} />
                  ))}
                </div>
              </div>
              {productsToDisplay().length === 0 ? (
                <div className={styles.noProducts}>
                  Продукты пока что не добавлены
                </div>
              ) : (
                <div className={styles.productsSection}>
                  <div className={styles.sorting}>
                    <select
                      onChange={({ target }) => setSelectSort(target.value)}
                    >
                      <option value="desc">Самое дорогое</option>
                      <option value="asc">Самое дешевое</option>
                    </select>
                  </div>

                  <div className={styles.products}>
                    {productsToDisplay().map(({ _id, name, image, price }) => (
                      <div className={styles.productCard} key={_id}>
                        <Link to={`/product/${_id}`}>
                          <div className={styles.productImage}>
                            <img src={image} alt={name} />
                          </div>
                          <div className={styles.productInfo}>
                            <h3 className={styles.productName}>{name}</h3>
                            <div className={styles.productPrice}>
                              {price} грн
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {lastPage === 1 || productsToDisplay().length === 0 ? null : (
            <Pagination page={page} setPage={setPage} lastPage={lastPage} />
          )}
        </div>
      )}
    </>
  );
};
