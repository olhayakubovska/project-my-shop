import styles from "./users.module.css";
import { useState } from "react";

export const UpdateUsers = ({
  id: userId,
  roles,
  login,
  roleId,
  saveNewRole,
  removeUser,
}) => {
  const [newRole, setNewRole] = useState(roleId);
  // const [errorFromServer, setError] = useState("");
  // const [flag, setFlag] = useState(false);

  const onRoleChange = ({ target }) => {
    setNewRole(Number(target.value));
  };

  const unsavedRole = newRole !== roleId;

  return (
    <div>
      <div key={userId} className={styles.column}>
        <div className={styles.login}>{login}</div>

        <select
          className={styles.selectRoles}
          value={newRole}
          onChange={onRoleChange}
        >
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>

        <button
          className={unsavedRole ? styles.btnUnsaved : styles.btn}
          onClick={() => saveNewRole(userId, newRole)}
        >
          Save
        </button>

        <button onClick={() => removeUser(userId)} className={styles.btn}>
          Remove
        </button>
      </div>
    </div>
  );
};
