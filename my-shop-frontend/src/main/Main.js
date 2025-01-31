import { useEffect, useState } from "react";
import { Categories, Search } from "../components";
import { ProductsCards } from "../page";
import Loader from "../components/Loader/Loader";
import { request } from "../request";
import { useDispatch, useSelector } from "react-redux";
import { setProductsAction } from "../reducers/action/set-products-action";
import styles from "./main.module.css"
export const Main = () => {
  const [categories, setCategories] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [selectedSort, setSelectSort] = useState("desc");

  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const producsFromRedax = useSelector(({ products }) => products.products);

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      setLoading(true);
      try {
        const fetchedCategories = await request("/categories");
        setCategories(fetchedCategories);

        const { products, error } = await request("/products");
        if (error) {
          throw new Error(error);
        }

        dispatch(setProductsAction(products));
      } catch (e) {
        setError(e.message || "An error occurred while loading data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndProducts();
  }, [dispatch]);

  const productsToDisplay = () => {
    let products = producsFromRedax;

    products = products.filter((product) => {
      return searchPhrase
        ? product.name.toLowerCase().includes(searchPhrase.toLowerCase())
        : true;
    });

    products = products.sort((a, b) => {
      if (selectedSort === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });

    return products;
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
                  {productsToDisplay().map(
                    ({ _id, name, image, price, categoryId, description }) => (
                      <ProductsCards
                        key={_id}
                        id={_id}
                        name={name}
                        image={image}
                        price={price}
                        categoryId={categoryId}
                        description={description}
                      />
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
