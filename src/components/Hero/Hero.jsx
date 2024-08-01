import React from "react";

import styles from "./Hero.module.css";
import { getImageUrl } from "../../utils";

export const Hero = () => {
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Hi, I'm Duong Nguyen</h1>
        <p className={styles.description}>
        A dedicated software developer with a passion for crafting clean, efficient,
        and well-structured code to build high-quality, reliable products.
        </p>
        <a href="mailto:duongnguyen6880@gmail.com" className={styles.contactBtn}>
          Contact Me
        </a> <br/>
        <a href="/Resume/DuongNguyen-Resume.pdf" download="DuongNguyen-Resume.pdf" className={styles.contactBtn}>
          Get Resume
        </a>
      </div>
      <img
        src={getImageUrl("hero/heroImage.png")}
        alt="Hero image of me"
        className={styles.heroImg}
      />
      <div className={styles.topBlur} />
      <div className={styles.bottomBlur} />
    </section>
  );
};
