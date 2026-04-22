import React, { useMemo, useState } from "react";

import styles from "./Experience.module.css";
import skills from "../../data/skills.json";
import history from "../../data/history.json";
import { getImageUrl } from "../../utils";
import Reveal from "../common/Reveal";

export const Experience = () => {
  const [hoveredHistoryIndex, setHoveredHistoryIndex] = useState(null);

  const normalizeTechName = (value) =>
    value.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9#+]/g, "");

  const selectedTechSet = useMemo(() => {
    const selected = history[hoveredHistoryIndex];
    if (!selected) return new Set();

    if (Array.isArray(selected.highlightSkills) && selected.highlightSkills.length) {
      return new Set(selected.highlightSkills.map((item) => normalizeTechName(item)));
    }

    const techLine = selected.experiences.find((entry) =>
      entry.toLowerCase().startsWith("tech:")
    );
    if (!techLine) return new Set();

    const techValues = techLine
      .replace(/^tech:\s*/i, "")
      .split(",")
      .flatMap((item) => item.split("/"))
      .map((item) => item.trim())
      .filter(Boolean)
      .map(normalizeTechName);

    return new Set(techValues);
  }, [hoveredHistoryIndex]);

  return (
    <section className={styles.container} id="experience">
      <Reveal>
        <h2 className={styles.title}>Experience</h2>
        <div className={styles.content}>
          <div className={styles.skills}>
            {skills.map((group, groupId) => {
              return (
                <section key={groupId} className={styles.skillGroup}>
                  <h3 className={styles.groupTitle}>{group.category}</h3>
                  <div className={styles.groupItems}>
                    {group.items.map((skill, skillId) => {
                      const isSkillActive = selectedTechSet.has(
                        normalizeTechName(skill.title)
                      );
                      return (
                        <div
                          key={skillId}
                          className={`${styles.skillItem} ${
                            isSkillActive ? styles.skillItemActive : ""
                          }`}
                        >
                          <div className={styles.skillImageContainer}>
                            {skill.imageSrc ? (
                              <img src={getImageUrl(skill.imageSrc)} alt={skill.title} />
                            ) : (
                              <span className={styles.fallbackIcon}>
                                {skill.shortLabel || skill.title.slice(0, 2).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <p>{skill.title}</p>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
          <ul className={styles.history}>
            {history.map((historyItem, id) => {
              return (
                <li
                  key={id}
                  className={`${styles.historyItem} ${
                    hoveredHistoryIndex === id ? styles.historyItemActive : ""
                  }`}
                  tabIndex={0}
                  onMouseEnter={() => setHoveredHistoryIndex(id)}
                  onMouseLeave={() => setHoveredHistoryIndex(null)}
                  onFocus={() => setHoveredHistoryIndex(id)}
                  onBlur={() => setHoveredHistoryIndex(null)}
                >
                  <img
                    src={getImageUrl(historyItem.imageSrc)}
                    alt={`${historyItem.organisation} Logo`}
                  />
                  <div className={styles.historyItemDetails}>
                    <h3 className={styles.historyRole}>{historyItem.role}</h3>
                    <p className={styles.historyOrganisation}>{historyItem.organisation}</p>
                    {historyItem.location && (
                      <p className={styles.historyLocation}>{historyItem.location}</p>
                    )}
                    <p className={styles.historyDate}>{`${historyItem.startDate} - ${historyItem.endDate}`}</p>
                    <ul>
                      {historyItem.experiences.map((experience, id) => {
                        return <li key={id}>{experience}</li>;
                      })}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Reveal>
    </section>
  );
};
