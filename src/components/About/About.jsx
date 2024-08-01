import React from "react";

import styles from "./About.module.css";
import { getImageUrl } from "../../utils";

export const About = () => {
  return (
    <section className={styles.container} id="about">
      <h2 className={styles.title}>About</h2>
      <div className={styles.content}>
        <img
          src={getImageUrl("about/aboutImage.gif")}
          alt="Me sitting with a laptop"
          className={styles.aboutImage}
        />
        <ul className={styles.aboutItems}>
          <li className={styles.aboutItem}>
            <img src={getImageUrl("about/cursorIcon.png")} alt="Cursor icon" />
            <div className={styles.aboutItemText}>
              <h3>Technical Skills</h3>
              <p>
              Proficient in C/C++, C#, Python, Java, JavaScript, and TypeScript,
              with experience using tools, libraries like React, NodeJS, Flask, and Visual Studio.
              </p>
            </div>
          </li>
          <li className={styles.aboutItem}>
            <img src={getImageUrl("about/serverIcon.png")} alt="Server icon" />
            <div className={styles.aboutItemText}>
              <h3>Project and QA Experience</h3>
              <p>
              Skilled in software design, testing, and quality assurance (CMMI, ASPICE),
              with expertise in version control (SVN, Git) and project management tools (JIRA, Redmine).
              Adaptable to new technologies and operating systems.
              </p>
            </div>
          </li>
          <li className={styles.aboutItem}>
            <img src={getImageUrl("about/cursorIcon.png")} alt="UI icon" />
            <div className={styles.aboutItemText}>
              <h3>Personal Attributes</h3>
              <p>
              Passionate about technology, enjoys tackling project-based challenges,
              and committed to diligent task completion.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
};
