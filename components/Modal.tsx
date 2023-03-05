import { useState } from "react";
import styles from "../styles/Components/Modal.module.scss";

export default function Modal({ handleClose, show, children }: any) {
  const showHideClassName = show ? styles.displayBlock : styles.displayNone;

  return (
    <div className={showHideClassName}>
      <section className={styles.modalMain}>
        {children}
        <button type="button" onClick={handleClose}>
          Close
        </button>
      </section>
    </div>
  );
}
