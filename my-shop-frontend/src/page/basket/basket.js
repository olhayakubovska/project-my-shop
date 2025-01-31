import { useDispatch, useSelector } from "react-redux";
import styles from "./basket.module.css";
import { useEffect, useState } from "react";
import { request } from "../../request";
import { Link } from "react-router-dom";
import { ACTION_TYPE } from "../../reducers/action/action-type";

export const Basket = () => {
  const [error, setError] = useState("");

  const userId = useSelector(({ user }) => user.id);
  const userProductsFromRedax = useSelector(({ basket }) => basket.basket);

  const dispatch = useDispatch();
  useEffect(() => {
    const fetchBasket = async () => {
      try {
        if (userId) {
          const { userProductsFromServer, error } = await request(
            `/basket/${userId}`
          );

          if (error) {
            throw new Error(error);
          }

          dispatch({
            type: ACTION_TYPE.SET_PRODUCTS_FROM_BASKET,
            payload: userProductsFromServer,
          });
        }
      } catch (e) {
        setError(e.message || "Не удалось загрузить данные из корзины.");
      }
    };
    fetchBasket();
  }, [userId, dispatch]);

  const removeItem = async (idForRemove, userId) => {
    try {
      const { productsFromBasket, error } = await request(
        `basket/${idForRemove}?userId=${userId}`,
        "DELETE"
      );

      dispatch({
        type: ACTION_TYPE.SET_PRODUCTS_FROM_BASKET,
        payload: productsFromBasket,
      });
    } catch (error) {
      console.error("Ошибка при удалении продукта:", error.message);
    }
  };

  const productToDisplay = () => {
    const products = userProductsFromRedax;

    const updatedProducts = products.reduce((acc, prod) => {
      const existingProduct = acc.find(
        (item) => item.productId === prod.productId
      );
      if (existingProduct) {
        existingProduct.countElement = existingProduct.countElement + 1;
      } else {
        acc.push({ ...prod, countElement: 1 });
      }
      return acc;
    }, []);

    return updatedProducts;
  };

  return (
    <>
      {error ? (
        <div>{error}</div>
      ) : (
        <>
          {userId && (
            <div className={styles.container}>
              {productToDisplay().map(
                ({
                  _id,
                  productId,
                  productImage,
                  productName,
                  productPrice,
                  productDescription,
                  countElement,
                }) => (
                  <div key={_id}>
                    <div className={styles.productItem}>
                      <img
                        src={productImage}
                        alt={productName}
                        className={styles.productImage}
                      />

                      <Link to={`/product/${productId}`}>
                        <div className={styles.productInfo}>
                          <div className={styles.productName}>
                            {productName}
                          </div>
                          <div className={styles.productPrice}>
                            Цена: ${productPrice}
                          </div>
                          <div className={styles.productDescription}>
                            {productDescription}
                          </div>
                          <div className={styles.productCount}>
                            Количество элементов в корзине: {countElement}
                          </div>
                        </div>
                      </Link>

                      <div className={styles.btnAndId}>
                        <button
                          className={styles.btn}
                          onClick={() => removeItem(_id, userId)}
                        >
                          удалить из корзины
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}{" "}
        </>
      )}
    </>
  );
};
