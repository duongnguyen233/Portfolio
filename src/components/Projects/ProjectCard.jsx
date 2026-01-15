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

    // Optional extra info (add in projects.json)
    duration,
    company,
    role,
  },
}) => {
  return (
    <div className={styles.container}>
      {/* BIG image */}
      <div className={styles.media}>
        <img
          src={getImageUrl(imageSrc)}
          alt={`Image of ${title}`}
          className={styles.image}
          loading="lazy"
        />

        {/* Hover panel: show description + company + duration */}
        <div className={styles.hoverPanel} aria-hidden="true">
          <div className={styles.hoverContent}>
            {/* keep text readable but not huge */}
            {description && <p className={styles.hoverDesc}>{description}</p>}

            <div className={styles.meta}>
              {company && (
                <p>
                  <strong>Company:</strong> {company}
                </p>
              )}
              {duration && (
                <p>
                  <strong>Duration:</strong> {duration}
                </p>
              )}
              {role && (
                <p>
                  <strong>Role:</strong> {role}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Under image: name */}
      <h3 className={styles.title}>{title}</h3>

      {/* Under image: skills */}
      <ul className={styles.skills}>
        {skills.map((skill, id) => (
          <li key={id} className={styles.skill}>
            {skill}
          </li>
        ))}
      </ul>

      {/* Under image: buttons (keep your style) */}
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
