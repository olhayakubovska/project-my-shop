import { useSelector } from "react-redux";
import styles from "./Modal.module.css";

export const Modal = () => {
  const onConfirm = useSelector(({app}) => app.modal.onConfirm);
  const onCancel = useSelector(({app}) => app.modal.onCancel);
  const text = useSelector(({app}) => app.modal.text);
  const isOpen = useSelector(({app}) => app.modal.isOpen);

  if (!isOpen) {
    return;
  }

  return (
    <div className={styles.container}>
      <div className={styles.overlay}></div>
      <div className={styles.box}>
        <h3>{text}</h3>
        <div className="buttons">
          <button className={styles.btn} onClick={onConfirm}>
            ДА
          </button>
          <button className={styles.btn} onClick={onCancel}>
            ОТМЕНА
          </button>
        </div>
      </div>
    </div>
  );
};
