import React from "react";
import styles from "./ProjectCard.module.css";
import { getImageUrl } from "../../utils";

export const ProjectCard = ({
  project: {
    title,
    imageSrc,
    description,
    skills,
    domains,
    demo,
    source,
    hideSource,
    hideDemo,

    // Optional extra info (add in projects.json)
    duration,
    company,
    role,
    teamSize,
    projectType,
    responsibilities,
    highlights,
  },
}) => {
  const detailItems = [
    { label: "Type", value: projectType },
    { label: "Company", value: company },
    { label: "Role", value: role },
    { label: "Duration", value: duration },
    { label: "Team Size", value: teamSize },
  ].filter((item) => item.value);

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

      {detailItems.length > 0 && (
        <dl className={styles.details}>
          {detailItems.map((item) => (
            <React.Fragment key={item.label}>
              <dt className={styles.detailLabel}>{item.label}</dt>
              <dd className={styles.detailValue}>{item.value}</dd>
            </React.Fragment>
          ))}
        </dl>
      )}

      {Array.isArray(domains) && domains.length > 0 && (
        <ul className={styles.domains}>
          {domains.map((domain) => (
            <li key={domain} className={styles.domain}>
              {domain}
            </li>
          ))}
        </ul>
      )}

      {Array.isArray(highlights) && highlights.length > 0 && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>What I Did</h4>
          <ul className={styles.pointList}>
            {highlights.map((item, id) => (
              <li key={id} className={styles.pointItem}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {Array.isArray(responsibilities) && responsibilities.length > 0 && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>My Responsibilities</h4>
          <ul className={styles.pointList}>
            {responsibilities.map((item, id) => (
              <li key={id} className={styles.pointItem}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

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

        {(!source || hideSource) && (
          <span
            className={`${styles.link} ${styles.linkDisabled}`}
            aria-disabled="true"
            title="Source code is private"
          >
            Source Private
          </span>
        )}
      </div>
    </div>
  );
};
