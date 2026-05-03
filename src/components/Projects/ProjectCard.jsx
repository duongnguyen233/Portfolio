import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./ProjectCard.module.css";
import { getImageUrl } from "../../utils";

export const ProjectCard = ({
  variant = "multi",
  project: {
    title,
    imageSrc,
    description,
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
    skills: skillsProp,
  },
}) => {
  const skills = Array.isArray(skillsProp) ? skillsProp : [];
  const [peekOpen, setPeekOpen] = useState(false);
  const containerRef = useRef(null);

  const togglePeek = useCallback(() => {
    setPeekOpen((open) => !open);
  }, []);

  useEffect(() => {
    if (!peekOpen) return;
    const closeOnOutside = (e) => {
      if (containerRef.current?.contains(e.target)) return;
      setPeekOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutside, true);
    return () => document.removeEventListener("pointerdown", closeOnOutside, true);
  }, [peekOpen]);

  useEffect(() => {
    if (!peekOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setPeekOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [peekOpen]);

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${variant === "single" ? styles.containerSingle : styles.containerMulti} ${peekOpen ? styles.containerPeekOpen : ""}`}
    >
      <div className={styles.cardSurface}>
        {/* Thumbnail expands to fill card on image hover / focus / peek */}
        <div
          className={styles.media}
          tabIndex={0}
          role="button"
          aria-expanded={peekOpen}
          aria-label={`${title}: show project details`}
          onPointerUp={(e) => {
            if (e.pointerType !== "touch") return;
            if (e.target.closest?.(`.${styles.hoverPanel}`)) return;
            togglePeek();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              togglePeek();
            }
          }}
        >
          <img
            src={getImageUrl(imageSrc)}
            alt=""
            className={styles.image}
            loading="lazy"
            draggable={false}
          />

          {/* Expanded overlay: scroll wheel or touch drag */}
          <div className={styles.hoverPanel} aria-hidden={!peekOpen}>
            <div className={styles.hoverContent}>
              <p className={styles.hoverTitle}>{title}</p>

              {description && <p className={styles.hoverDesc}>{description}</p>}

            {Array.isArray(highlights) && highlights.length > 0 && (
              <div className={styles.hoverBlock}>
                <h4 className={styles.hoverBlockTitle}>What I did</h4>
                <ul className={styles.hoverList}>
                  {highlights.map((item, id) => (
                    <li key={id}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {Array.isArray(responsibilities) && responsibilities.length > 0 && (
              <div className={styles.hoverBlock}>
                <h4 className={styles.hoverBlockTitle}>My responsibilities</h4>
                <ul className={styles.hoverList}>
                  {responsibilities.map((item, id) => (
                    <li key={id}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className={styles.meta}>
              {projectType && (
                <p>
                  <strong>Type:</strong> {projectType}
                </p>
              )}
              {company && (
                <p>
                  <strong>Company:</strong> {company}
                </p>
              )}
              {role && (
                <p>
                  <strong>Role:</strong> {role}
                </p>
              )}
              {duration && (
                <p>
                  <strong>Duration:</strong> {duration}
                </p>
              )}
              {teamSize && (
                <p>
                  <strong>Team size:</strong> {teamSize}
                </p>
              )}
            </div>
            </div>
          </div>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.cardBodyScroll}>
            <h3 className={styles.title}>{title}</h3>

            {Array.isArray(domains) && domains.length > 0 && (
              <ul className={styles.domains}>
                {domains.map((domain) => (
                  <li key={domain} className={styles.domain}>
                    {domain}
                  </li>
                ))}
              </ul>
            )}

            {skills.length > 0 && (
              <ul className={styles.skills}>
                {skills.map((skill, id) => (
                  <li key={id} className={styles.skill}>
                    {skill}
                  </li>
                ))}
              </ul>
            )}
          </div>

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
      </div>
    </div>
  );
};
