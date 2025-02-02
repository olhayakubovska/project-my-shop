import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import {
  addProduct,
  catigories,
  updateProduct,
  getProduct,
  getProducts,
  getProductsByCategory,
  deleteProduct,
  deleteProductFromBasket,
} from "./controller/product.controller.js";
import {
  changeUserRole,
  deleteUser,
  getRoles,
  getUsers,
  login,
  register,
} from "./controller/user.controller.js";
import { userMap } from "./map/userMap.js";
import { authenticated } from "./middlewares/authenticated.js";
import {
  addProductFromBasket,
  getUserProductsFromBasket,
} from "./controller/basket.controller.js";
// import { basketMap } from "./map/basketMap.js";
import { productMap } from "./map/productMap.js";
import { hasRole } from "./middlewares/hasRole.js";
import { ROLE } from "./model/role.js";
import cors from "cors";
import path from "path";


const app = express();
// app.use(cors());
// app.use(cors({ origin: "*" }));  // Разрешаем все домены для теста

// app.use(cors({ origin: "http://localhost:3000" }));

// app.use((req, res, next) => {
//   res.set(
//     "Cache-Control",
//     "no-store, no-cache, must-revalidate, proxy-revalidate"
//   );
//   res.set("Pragma", "no-cache");
//   res.set("Expires", "0");
//   next();
// });

app.use(cookieParser());
app.use(express.json());

app.use(express.static("../my-shop-frontend/build"));
// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, "my-shop-frontend", "build")));

const port = 3001;

app.post("/register", async (req, res) => {
  try {
    const { user, token } = await register(req.body.login, req.body.password);

    res
      .cookie("token", token, { httpOnly: true })
      .send({ user: userMap(user), error: undefined });
  } catch (e) {
    res.status(500).send({ error: "Ошибка регестрации" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { user, token } = await login(req.body.login, req.body.password);

    res
      .cookie("token", token, { httpOnly: true })
      .send({ user: userMap(user), error: undefined });
  } catch (e) {
    res.status(500).send({ error: "Неверный логин" });
  }
});

app.post("/logout", async (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
    })
    .send({});
});

app.get("/products", async (req, res) => {
  try {
    const products = await getProducts();
    res.send({ products, error: undefined });
  } catch (e) {
    res.status(500).send({
      error: "Произошла ошибка при загрузке данных ;( Попробуйте еще раз",
    });
  }
});

app.get("/products/category/:id", async (req, res) => {
  try {
    const { productsByCategoryId, lastPage } = await getProductsByCategory(
      req.params.id,
      req.query.page,
      req.query.limit
    );
    res.send({ productsByCategoryId, error: undefined, lastPage });
  } catch (e) {
    console.error(e);

    res.status(500).send({
      error: "Произошла ошибка при загрузке данных ;( Попробуйте еще раз",
    });
  }
});

app.get("/categories", (req, res) => {
  const categories = catigories();
  res.send(categories);
});

app.get("/product/:id", async (req, res) => {
  try {
    const productFromServer = await getProduct(req.params.id);

    if (!productFromServer) {
      return res.status(404).send({
        error: "Продукт не найден.",
      });
    }

    res.send({
      productFromServer: productMap(productFromServer),
      error: undefined,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      error: "Произошла ошибка при загрузке продукта. Попробуйте еще раз.",
    });
  }
});

app.use(authenticated);

app.get("/basket/:userId", async (req, res) => {
  try {
    const userProductsFromServer = await getUserProductsFromBasket(
      req.params.userId
    );

    if (!userProductsFromServer || userProductsFromServer.length === 0) {
      return res.status(404).send({
        error: "Корзина пуста или не найдены продукты.",
      });
    }

    res.send({
      userProductsFromServer,
      error: undefined,
    });
  } catch (e) {
    console.error("Ошибка при получении продуктов из корзины:", e.message);
    res.status(500).send({
      error: "Произошла ошибка при получении данных корзины. Попробуйте снова.",
    });
  }
});

app.delete("/basket/:idForRemove", async (req, res) => {
  try {
    const productsFromBasket = await deleteProductFromBasket(
      req.params.idForRemove,
      req.query.userId
    );

    if (!productsFromBasket) {
      return res.status(404).send({
        error: "Ошибка при удалении из корзины.",
      });
    }
    res.send({
      productsFromBasket,
      error: undefined,
    });
  } catch (e) {
    console.error("Ошибка при добавлении в корзину:", e.message);
    res.status(500).send({
      error:
        "Произошла ошибка при добавлении продукта в корзину. Попробуйте снова.",
    });
  }
});

app.post("/basket", async (req, res) => {
  req.body.userId;
  try {
    const userProductsFromBasket = await addProductFromBasket(
      req.body,
      req.body.userId
    );

    if (userProductsFromBasket.length === 0) {
      throw new Error("корзина пустая");
    }

    res.send({
      userProductsFromBasket,
      error: undefined,
    });
  } catch (e) {
    console.error("Ошибка при добавлении в корзину:", e.message);
    res.status(500).send({
      error:
        "Произошла ошибка при добавлении продукта в корзину. Попробуйте снова.",
    });
  }
});

app.get("/users", hasRole([ROLE.ADMIN]), async (req, res) => {
  try {
    const users = await getUsers();

    if (!users || users.length === 0) {
      return res.status(404).send({
        error: "Пользователи не найдены.",
      });
    }

    res.send(users);
  } catch (e) {
    console.error("Ошибка при получении пользователей:", e.message);
    res.status(500).send({
      error: "Произошла ошибка при получении пользователей. Попробуйте снова.",
    });
  }
});

app.get("/roles", hasRole([ROLE.ADMIN]), (req, res) => {
  const roles = getRoles();
  res.send(roles);
});

app.patch("/users/edit/:userId", hasRole([ROLE.ADMIN]), async (req, res) => {
  try {
    const newUser = await changeUserRole(req.params.userId, req.body.roleId);

    if (!newUser) {
      return res.status(404).send({
        error: "Пользователь не найден.",
      });
    }

    res.send(newUser);
  } catch (e) {
    console.error("Ошибка при изменении роли пользователя:", e.message);
    res.status(500).send({
      error:
        "Произошла ошибка при изменении роли пользователя. Попробуйте снова.",
    });
  }
});
app.delete("/users/:userId", hasRole([ROLE.ADMIN]), async (req, res) => {
  try {
    await deleteUser(req.params.userId);
    res.status(200).send({ message: "Пользователь успешно удален." });
  } catch (e) {
    console.error("Ошибка при удалении пользователя:", e.message);
    res.status(500).send({
      error: "Произошла ошибка при удалении пользователя.",
    });
  }
});

app.post("/edit", hasRole([ROLE.ADMIN]), async (req, res) => {
  try {
    const products = await addProduct(req.body);
    res.status(200).send(products);
  } catch (e) {
    console.error("Ошибка при добавлении продукта:", e.message);
    res.status(500).send({
      error: "Произошла ошибка при добавлении продукта.",
    });
  }
});

app.post("/edit/:productId", hasRole([ROLE.ADMIN]), async (req, res) => {
  try {
    const products = await deleteProduct(req.params.productId);
    res.status(200).send(products);
  } catch (e) {
    console.error("Ошибка при удалении продукта:", e.message);
    res.status(500).send({
      error: "Произошла ошибка при удалении продукта.",
    });
  }
});

app.patch("/edit/:id", hasRole([ROLE.ADMIN]), async (req, res) => {
  try {
    const changedProducts = await updateProduct(req.params.id, req.body);
    res.status(200).send(changedProducts);
  } catch (e) {
    console.error("Ошибка при обновлении продукта:", e.message);
    res.status(500).send({
      error: "Произошла ошибка при обновлении продукта.",
    });
  }
});

app.delete("/edit/:productId", hasRole([ROLE.ADMIN]), async (req, res) => {
  try {
    const changedProducts = await deleteProduct(req.params.productId);
    res.status(200).send(changedProducts);
  } catch (e) {
    console.error("Ошибка при удалении продукта:", e.message);
    res.status(500).send({
      error: "Произошла ошибка при удалении продукта.",
    });
  }
});
app.get("/edit", hasRole([ROLE.ADMIN]), async (req, res) => {
  try {
    const products = await getProducts();
    res.send({ products, error: undefined });
  } catch (e) {
    res.status(500).send({
      error: "Произошла ошибка при загрузке данных ;( Попробуйте еще раз",
    });
  }
});

mongoose
  .connect(
    "mongodb+srv://oyakubovska:qwerty123@cluster0.abt5c.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(port, () => {
      console.log("Server started...");
    });
  });
