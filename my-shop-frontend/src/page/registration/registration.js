import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import styles from "./registration.module.css";
import { ROLE } from "../../constants";
import { request } from "../../request";
import { setUser } from "../../reducers/action/set-user-action";

const authScheme = yup.object().shape({
  login: yup
    .string()
    .min(3, "Неверная длина логина. Минимум 3")
    .required("Поле логин обязательно для заполнения"),

  password: yup
    .string()
    .min(4, "Неверная длина пароля.Минимум 4")
    .required("Поле пароль обязательно для заполнения"),
  passcheck: yup
    .string()
    .required("Повтор пароля обязательный")
    .oneOf([yup.ref("password"), null], "Повтор пароля не совпадает"),
});

export const Registration = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      login: "",
      password: "",
      passcheck: "",
    },
    resolver: yupResolver(authScheme),
  });

  const dispatch = useDispatch();
  const roleId = useSelector(({ user }) => user.roleId);
  const [serverError, setServerError] = useState("");

  const formError =
    errors?.login?.message ||
    errors?.password?.message ||
    errors?.passcheck?.message;
  const fullError = serverError || formError;

  const onSubmit = ({ login, password }) => {
    request("/register", "POST", { login, password }).then(
      ({ user, error }) => {
        if (error) {
          setServerError(`Ошибка запроса:' ${error}`);
          return;
        }

        dispatch(setUser(user));
        sessionStorage.setItem("userData", JSON.stringify(user));
      }
    );
  };
  if (roleId !== ROLE.GUEST) {
    return <Navigate to="/" />;
  }
  return (
    <div className={styles.registrationContainer}>
      <h2 className={styles.heading}>Регистрация</h2>
      <div className={styles.error}>{fullError}</div>

      <form className={styles.formStyle} onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            placeholder="Логин..."
            id="login"
            type="text"
            {...register("login")}
            className={styles.inputField}
          />
        </div>
        <div>
          <input
            placeholder="Пароль..."
            id="password"
            type="password"
            {...register("password")}
            className={styles.inputField}
          />
        </div>
        <div>
          <input
            placeholder="Повтор пароля..."
            id="passcheck"
            type="password"
            {...register("passcheck")}
            className={styles.inputField}
          />
        </div>
        <button className={styles.btn} type="submit">
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
};
