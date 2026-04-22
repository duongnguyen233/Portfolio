import React from "react";

import styles from "./Domains.module.css";
import domains from "../../data/domains.json";
import Reveal from "../common/Reveal";

export const Domains = () => {
  return (
    <section className={styles.container} id="domains">
      <Reveal>
        <h2 className={styles.title}>Domain Expertise</h2>

        <div className={styles.tagRow}>
          {domains.map((domain) => (
            <span key={domain.tag} className={styles.tag}>
              {domain.tag}
            </span>
          ))}
        </div>

        <div className={styles.grid}>
          {domains.map((domain) => (
            <article key={domain.title} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{domain.title}</h3>
                <span className={styles.years}>{domain.years}</span>
              </div>

              <p className={styles.company}>{domain.company}</p>
              <p className={styles.summary}>{domain.summary}</p>

              <ul className={styles.techList}>
                {domain.tech.map((item) => (
                  <li key={item} className={styles.techItem}>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
};
