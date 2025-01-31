import * as yup from "yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";

import { Link, Navigate } from "react-router-dom";
import styles from "./autorization.module.css";
import { ROLE } from "../../constants";
import { request } from "../../request";
import { setUser } from "../../reducers/action/set-user-action";

const authScheme = yup.object().shape({
  login: yup
    .string()
    .matches(/^\w+$/, "Неверный логин. Допускаються только буквы и цифры")
    .required("Заполните логин")
    .min(3, "Неверный логин. Должно быть не меньше 3 символов")
    .max(15, "Неверный логин. Должно быть не больше 15 символов"),
  password: yup
    .string()
    .required("Пароль обязательный")
    .matches(
      /^[\w#%]+$/,
      "Неверно заполнен пароль. Допускаються только буквы и цифры # %"
    )
    .min(3, "Неверно заполнен пароль. Должно быть не меньше 6 символов")
    .max(30, "Неверно заполнен пароль. Должно быть не больше 30 символов"),
});
export const Authorization = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      login: "",
      password: "",
    },
    resolver: yupResolver(authScheme),
  });

  const dispatch = useDispatch();
  const roleId = useSelector(({ user }) => user.roleId);

  const [serverError, setServerError] = useState("");

  const formError = errors?.login?.message || errors?.password?.message;
  const fullError = serverError || formError;

  const onSubmit = ({ login, password }) => {
    request("/login", "POST", { login, password }).then(({ user, error }) => {
      if (error) {
        setServerError(error);
        return;
      }

      dispatch(setUser(user));
      sessionStorage.setItem("userData", JSON.stringify(user));
    });
  };

  if (roleId !== ROLE.GUEST) {
    return <Navigate to="/" />;
  }

  return (
    <div className={styles.authorizationContainer}>
      <h2 className={styles.heading}>АВТОРИЗАЦИЯ</h2>
      <div className={styles.error}>{fullError}</div>

      <form className={styles.formStyle} onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            placeholder="Login..."
            id="login"
            type="text"
            {...register("login")}
            className={styles.inputField}
          />
        </div>
        <div>
          <input
            placeholder="Password..."
            id="password"
            type="password"
            {...register("password")}
            className={styles.inputField}
          />
        </div>
        <button className={styles.btn} type="submit">
          Войти
        </button>

        <Link className={styles.registerLink} to="/register">
          Зарегистрироваться
        </Link>
      </form>
    </div>
  );
};
