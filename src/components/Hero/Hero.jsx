import React from "react";

import styles from "./Hero.module.css";
import { getImageUrl } from "../../utils";

export const Hero = () => {
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Hi, I'm Duong Nguyen</h1>
        <p className={styles.description}>
          Software Engineer with experience in embedded systems, industrial
          automation, and full-stack development. Skilled in C/C++,
          system-level design, and modern web technologies, with a passion for
          building efficient, reliable, and high-performance systems.
        </p>

        <div className={styles.buttonRow}>
          <a href="mailto:duongnguyen6880@gmail.com" className={styles.contactBtn}>
            Contact Me
          </a>
          <a
            href="/Resume/DuongNguyen-Resume.pdf"
            download="DuongNguyen-Resume.pdf"
            className={styles.contactBtn}
          >
            Get Resume
          </a>
        </div>
      </div>

      <div className={styles.heroWrap}>
        <div className={styles.coin}>
          <img
            src={getImageUrl("hero/heroImage.png")}
            alt="Hero front"
            className={`${styles.heroImg} ${styles.front}`}
          />
          <img
            src={getImageUrl("hero/heroImage.jpg")}
            alt="Hero back"
            className={`${styles.heroImg} ${styles.back}`}
          />
        </div>
      </div>

      <div className={styles.topBlur} />
      <div className={styles.bottomBlur} />
    </section>
  );
};
