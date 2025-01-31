import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "../../components";
import { ProductsCards } from "../products-cards/poducts-cards";
import { request } from "../../request";
import { ROLE } from "../../constants";
import { ACTION_TYPE } from "../../reducers/action/action-type";
import styles from "./product.module.css";

export const Product = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState("");
  const [error, setError] = useState("");
  const [searchPhrase, setSearchPhrase] = useState("");

  const userId = useSelector(({ user }) => user.id);
  const userRole = useSelector(({ user }) => user.roleId);

  const productsFromRedax = useSelector(({ products }) => products.products);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { productFromServer, error } = await request(
          `/product/${productId}`
        );

        if (error) {
          throw new Error(error);
        }
        setProduct(productFromServer);
      } catch (e) {
        console.error("Ошибка при загрузке данных:", e.message);
        setError(e.message || "Не удалось загрузить данные.");
      }
    };

    fetchProduct();
  }, [productId]);

  const productsToDisplay = () => {
    let products = productsFromRedax;

    products = products.filter((product) => {
      return searchPhrase
        ? product.name.toLowerCase().includes(searchPhrase.toLowerCase())
        : true;
    });

    return products;
  };

  const addToCart = (id2) => {
    request("/basket", "POST", {
      userId: userId,
      productId: id2,
      productImage: product.image,
      productName: product.name,
      productPrice: product.price,
      productDescription: product.description,
      categoryId: product.categoryId,
      countElement: 0,
    }).then((data) =>
      dispatch({
        type: ACTION_TYPE.SET_PRODUCTS_FROM_BASKET,
        payload: data.userProductsFromBasket,
      })
    );
  };

  return (
    <>
      <Search setSearchPhrase={setSearchPhrase} searchPhrase={searchPhrase} />

      {searchPhrase ? (
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
      ) : (
        <div className={styles.product}>
          <div className={styles.productImg}>
            <img src={product.image} alt={product.name} />
          </div>
          <div className={styles.info}>
            <div className={styles.productName}>{product.name}</div>
            <div className={styles.price}>Цена: ${product.price}</div>
            <div className={styles.description}>
              Описание: {product.description}
            </div>
          </div>
          <div className={styles.btnAndId}>
            {userRole !== ROLE.ADMIN && userRole !== ROLE.GUEST && (
              <button
                className={styles.btn}
                onClick={() => addToCart(productId)}
              >
                добавить в корзину
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};
