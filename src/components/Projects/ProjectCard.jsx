import React from "react";

import styles from "./ProjectCard.module.css";
import { getImageUrl } from "../../utils";

export const ProjectCard = ({
  project: {
    title,
    imageSrc,
    description,
    skills,
    demo,
    source,
    hideSource,
    hideDemo,
  },
}) => {
  return (
    <div className={styles.container}>
      <img
        src={getImageUrl(imageSrc)}
        alt={`Image of ${title}`}
        className={styles.image}
      />

      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>

      <ul className={styles.skills}>
        {skills.map((skill, id) => (
          <li key={id} className={styles.skill}>
            {skill}
          </li>
        ))}
      </ul>

      <div className={styles.links}>
        {!hideDemo && demo && (
          <a
            href={demo}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
            onPointerDown={(e) => e.stopPropagation()}
          >
            Demo
          </a>
        )}

        {!hideSource && source && (
          <a
            href={source}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
            onPointerDown={(e) => e.stopPropagation()}
          >
            Source
          </a>
        )}
      </div>

    </div>
  );
};
