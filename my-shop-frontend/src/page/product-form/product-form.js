import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Error } from "../../components";
import { ROLE } from "../../constants";
import { ProductRow } from "./product-row";
import { request } from "../../request";
import { setProductsAction } from "../../reducers/action/set-products-action";
import { onOpenModal } from "../../reducers/action/on-open-modal";
import { ACTION_TYPE } from "../../reducers/action/action-type";
import styles from "./productForm.module.css";
import { setChangeUserAction } from "../../reducers/action/set-change-user-actions";
import { PrivateContent } from "../../components/PrivateContent/PrivateContent";

export const ProductForm = () => {
  const [productId, setProductId] = useState("");
  const [productName, setProductdName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState("");
  const [editedCategory, setEditedCategory] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [buttonAddOrSave, setButtonAddOrSave] = useState(true);
  const [error, setError] = useState("");

  const userRole = useSelector(({ user }) => user.roleId);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
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
      }
    };

    fetchCategoriesAndProducts();
  }, [dispatch, userRole]);

  const editProduct = (id) => {
    request(`/product/${id}`).then(({ productFromServer, error }) => {
      setProductId(id);
      setProductdName(productFromServer.name);
      setProductPrice(productFromServer.price);
      setProductImage(productFromServer.image);
      setEditedCategory(productFromServer.categoryId);
      setProductDescription(productFromServer.description);
    });
    setButtonAddOrSave(false);
  };

  const updateProduct = (id, name, image, price, categoryId, description) => {
    dispatch(
      onOpenModal({
        text: "Сохранить изменения?",
        onConfirm: async () => {
          try {
            const changedProducts = await request(
              `/product/edit/${id}`,
              "PATCH",
              { name, image, price, categoryId, description }
            );
            dispatch(setChangeUserAction(changedProducts));
          } catch (error) {
            console.error("Ошибка при обновлении продукта:", error);
            setError("Ошибка при обновлении продукта");
          }

          dispatch({ type: ACTION_TYPE.CLOSE_MODAL });
          setButtonAddOrSave(!buttonAddOrSave);
        },
        onCancel: () => dispatch({ type: ACTION_TYPE.CLOSE_MODAL }),
      })
    );

    setProductdName("");
    setProductPrice("");
    setProductImage("");
    setEditedCategory("");
    setProductDescription("");
    setButtonAddOrSave(true);
  };

  const addProduct = async (name, image, price, categoryId, description) => {
    dispatch(
      onOpenModal({
        text: "Сохранить новый продукт?",
        onConfirm: async () => {
          try {
            const newProducts = await request("/product/edit", "POST", {
              name,
              image,
              price,
              categoryId,
              description,
            });
            dispatch(setChangeUserAction(newProducts));
          } catch (error) {
            console.error("Ошибка при добавлении продукта:", error);
            setError("Ошибка при обновлении продукта");
          }

          dispatch({ type: ACTION_TYPE.CLOSE_MODAL });
          setButtonAddOrSave(!buttonAddOrSave);

          setProductdName("");
          setProductPrice("");
          setProductImage("");
          setEditedCategory("");
          setProductDescription("");
        },
        onCancel: () => dispatch({ type: ACTION_TYPE.CLOSE_MODAL }),
      })
    );
  };

  const deleteProduct = (productId) => {
    dispatch(
      onOpenModal({
        text: "Удалиь продукт?",
        onConfirm: async () => {
          try {
            const uptadedProducts = await request(
              `/product/edit/${productId}`,
              "DELETE"
            );
            dispatch(setChangeUserAction(uptadedProducts));
            setProductdName("");
            setProductPrice("");
            setProductImage("");
            setEditedCategory("");
            setProductDescription("");
            setButtonAddOrSave(true);
          } catch (error) {
            console.error("Ошибка при удалении продукта:", error);
            setError("Ошибка при удалении продукта");
          }
        },
        onCancel: () => dispatch({ type: ACTION_TYPE.CLOSE_MODAL }),
      })
    );
  };

  const onCategoryChange = ({ target }) => {
    setEditedCategory(target.value);
  };

  const producsFromRedax = useSelector(({ products }) => products.products);
  return (
    <>
      <PrivateContent access={[ROLE.ADMIN]} serverError={error}>
        <div className={styles.container}>
          <div className={styles.newProduct}>
            <div className={styles.text}>
              Блок для добавления и редактирования товара
            </div>
            <input
              value={productName || ""}
              onChange={({ target }) => setProductdName(target.value)}
            />
            <input
              value={productImage || ""}
              onChange={({ target }) => setProductImage(target.value)}
            />
            <input
              value={productPrice || ""}
              onChange={({ target }) => setProductPrice(target.value)}
            />
            <div className="role-column">
              <select value={editedCategory || ""} onChange={onCategoryChange}>
                {categories.map(({ id: categoryId, category }) => (
                  <option key={categoryId} value={categoryId}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <input
              value={productDescription || ""}
              onChange={({ target }) => setProductDescription(target.value)}
            />
            <div className={styles.buttons}>
              {buttonAddOrSave ? (
                <button
                  className={styles.btn}
                  onClick={() =>
                    addProduct(
                      productName,
                      productImage,
                      productPrice,
                      editedCategory,
                      productDescription
                    )
                  }
                >
                  Добавить
                </button>
              ) : (
                <button
                  className={styles.btn}
                  onClick={() =>
                    updateProduct(
                      productId,
                      productName,
                      productImage,
                      productPrice,
                      editedCategory,
                      productDescription
                    )
                  }
                >
                  Сохранить
                </button>
              )}
            </div>
          </div>

          <div className={styles.edit}>
            {producsFromRedax.map((item) => (
              <ProductRow
                key={item._id}
                id={item._id}
                name={item.name}
                image={item.image}
                price={item.price}
                categoryId={item.categoryId}
                description={item.description}
                editProduct={() => editProduct(item._id)}
                deleteProduct={() => deleteProduct(item._id)}
              />
            ))}
          </div>
        </div>
      </PrivateContent>
    </>
  );
};
