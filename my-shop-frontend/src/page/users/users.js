import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ROLE } from "../../constants";
import { UpdateUsers } from "./update-users";
import { request } from "../../request";
import { setUsersAction } from "../../reducers/action/set-users-action";
import { onOpenModal } from "../../reducers/action/on-open-modal";
import { ACTION_TYPE } from "../../reducers/action/action-type";
import { setChangeUserAction } from "../../reducers/action/set-change-user-actions";
import styles from "./users.module.css";
import { PrivateContent } from "../../components/PrivateContent/PrivateContent";

export const Users = () => {
  const [roles, setRoles] = useState([]);

  const [error, setError] = useState("");

  const dispatch = useDispatch();

  // const userRole = useSelector(({ user }) => user.roleId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [loadedUsers, loadedRoles] = await Promise.all([
          request("/users"),
          request("/roles"),
        ]);

        if (loadedUsers.error) throw new Error(loadedUsers.error);
        if (loadedRoles.error) throw new Error(loadedRoles.error);

        dispatch(setUsersAction(loadedUsers));
        setRoles(loadedRoles);
      } catch (e) {
        // console.error("Ошибка при загрузке данных:", e.message);
        setError("Доступ только у админа");
      }
    };
    fetchData();
  }, []);

  const saveNewRole = (userId, newUserRole) => {
    dispatch(
      onOpenModal({
        text: "Сохранить изменения в роли?",
        onConfirm: async () => {
          const user = await request(`/users/edit/${userId}`, "PATCH", {
            roleId: newUserRole,
          });

          dispatch(setChangeUserAction(user));
          dispatch({ type: ACTION_TYPE.CLOSE_MODAL });

          const users = await request("/users");
          dispatch(setUsersAction(users));
        },
        onCancel: () => dispatch({ type: ACTION_TYPE.CLOSE_MODAL }),
      })
    );
  };

  const removeUser = (userId) => {
    dispatch(
      onOpenModal({
        text: "Удалить пользователя?",
        onConfirm: async () => {
          request(`/users/${userId}`, "DELETE");

          dispatch({ type: ACTION_TYPE.CLOSE_MODAL });

          const users = await request("/users");

          dispatch(setUsersAction(users));
        },

        onCancel: () => dispatch({ type: ACTION_TYPE.CLOSE_MODAL }),
      })
    );
  };
  const usersFromRedax = useSelector((state) => state.users.users);

  return (
    <>
      <PrivateContent access={[ROLE.ADMIN]} serverError={error}>
        <div className={styles.container}>
          <h2 className={styles.h2}>Пользователи</h2>
          <div className={styles.tableRow}>
            {usersFromRedax.map((user) => (
              <UpdateUsers
                key={user._id}
                id={user._id}
                login={user.login}
                roleId={user.roleId}
                roles={roles}
                saveNewRole={saveNewRole}
                removeUser={removeUser}
              />
            ))}
          </div>
        </div>
      </PrivateContent>
    </>
  );
};
