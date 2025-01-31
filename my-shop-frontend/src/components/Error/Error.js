import { useSelector } from "react-redux";
import styles from "./error.module.css";

export const Error = ({ children, error, arrayAccess }) => {
  const roleId = useSelector(({ user }) => user.roleId);

  const errorComponent = arrayAccess.includes(roleId)
    ? null
    : "Доступно только админу :)";
  const errors = errorComponent || error;

  return errors ? <div className={styles.err}>{errors}</div> : children;
};
