import { useSelector } from "react-redux";
import styles from "./private-content.module.css";

const checkAccess = (access, userRole) => access.includes(userRole);

export const PrivateContent = ({ children, access, serverError = null }) => {
  const userRole = useSelector(({ user }) => user.roleId);

  const accessError = checkAccess(access, userRole) ? null : "Доступ запрещен!";
  const error = serverError || accessError;

  return error ? <div className={styles.error}> {error}</div> : children;
};
