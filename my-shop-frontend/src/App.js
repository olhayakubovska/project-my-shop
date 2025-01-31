import { Route, Routes, Navigate } from "react-router-dom";

import styles from "./App.module.css";
import { useDispatch } from "react-redux";
import { useLayoutEffect } from "react";
import { Header, Modal } from "./components";
import { Main } from "./main/Main";
import {
  Authorization,
  Basket,
  Product,
  ProductForm, 
  ProductsCards,
  Registration,
  Users,
} from "./page";
import { ProductsByCategory } from "./page/product/products-by-category";
import { setUser } from "./reducers/action/set-user-action";

function App() {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    const currentuserDataJSON = sessionStorage.getItem("userData");
    if (!currentuserDataJSON) {
      return;
    }

    const currentuserData = JSON.parse(currentuserDataJSON);

    dispatch(
      setUser({ ...currentuserData, roleId: Number(currentuserData.roleId) })
    );
  }, [dispatch]);

  return (
    <div className={styles.appColum}>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Authorization />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/product/edit" element={<ProductForm />} />
        <Route path="/products/category/:id" element={<ProductsByCategory />} />
        <Route path="/basket" element={<Basket />} />
        <Route path="/users" element={<Users />} />
        <Route
          path="*"
          element={
            <div className={styles.error}>Такая странрица не сущевствует </div>
          }
        />
      </Routes>
      <Modal />
    </div>
  );
}

export default App;
