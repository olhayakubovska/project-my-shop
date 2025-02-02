import { useDispatch, useSelector } from "react-redux";
import HeaderLogo from "../../image/free-icon-cymric-cat-15370486.png";
import LoginIcon from "../../image/free-icon-bombay-15370478.png";
import styles from "./header.module.css";
import { Link } from "react-router-dom";
import { ROLE } from "../../constants";
import { request } from "../../request";
import { logout } from "../../reducers/action/logout";

export const Header = () => {
  const userLogin = useSelector(({ user }) => user.login);

  const userRole = useSelector(({ user }) => user.roleId);
  const dispatch = useDispatch();
  const userProductsFromRedax = useSelector(({ basket }) => basket.basket);

  const onLogout = () => {
    dispatch(logout());

    sessionStorage.removeItem("userData");
    request("/logout", "POST");
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.icon}>
        <Link to="/">
          <img src={HeaderLogo} alt="Header logo" className={styles.logo} />
        </Link>
        <h1>MY-SHOP</h1>
      </div>

      {userRole === ROLE.GUEST ? (
        <Link className={styles.loginBtn} to="/login">
          войти
        </Link>
      ) : (
        <>
          <div className={styles.icon}>
            <img
              src={LoginIcon}
              alt="Login icon"
              className={styles.loginIcon}
            />
            <span className={styles.loginText}>{userLogin}</span>
            <i
              className="fa fa-sign-in"
              aria-hidden="true"
              onClick={onLogout}
            ></i>
          </div>
        </>
      )}

      <div className={styles.controlPanel}>
        {userRole === ROLE.ADMIN ? (
          <>
            <Link to="/users">
              <div className={styles.users}>
                <i className="fa fa-users" aria-hidden="true" />
              </div>
            </Link>
            <Link to={`/edit`}>
              <div className={styles.edit}>
                <i className="fa fa-pencil" aria-hidden="true"></i>
              </div>
            </Link>
          </>
        ) : (
          userRole !== ROLE.GUEST && (
            <Link to="/basket">
              <div className={styles.basket}>
                <i className="fa fa-shopping-bag" aria-hidden="true"></i>

                <div className={styles.lenghtItems}>
                  {userProductsFromRedax.length}
                </div>
              </div>
            </Link>
          )
        )}
      </div>
    </div>
  );
};
