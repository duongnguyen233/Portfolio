import React, { useMemo } from "react";
import styles from "./Projects.module.css";

import projects from "../../data/projects.json";
import { ProjectCard } from "./ProjectCard";

const CATEGORY_ORDER = [
  "automotive",
  "semiconductorMachines",
  "webCloudAi",
];

const CATEGORY_LABELS = {
  automotive: "Automotive",
  semiconductorMachines: "Semiconductor & machines",
  webCloudAi: "Web & cloud · AI & implementations",
};

export const Projects = () => {
  const { sections, animationIndexByTitle } = useMemo(() => {
    const grouped = Object.fromEntries(
      CATEGORY_ORDER.map((id) => [id, []]),
    );

    for (const project of projects) {
      const key = project.category;
      if (grouped[key]) {
        grouped[key].push(project);
      }
    }

    const sectionsList = CATEGORY_ORDER.filter(
      (id) => grouped[id]?.length > 0,
    ).map((id) => ({
      id,
      label: CATEGORY_LABELS[id],
      projects: grouped[id],
    }));

    let i = 0;
    const animationIndexByTitle = {};
    for (const section of sectionsList) {
      for (const project of section.projects) {
        animationIndexByTitle[project.title] = i++;
      }
    }

    return { sections: sectionsList, animationIndexByTitle };
  }, []);

  return (
    <section className={styles.container} id="projects">
      <div className={styles.header}>
        <h2 className={styles.title}>Projects</h2>
      </div>

      {sections.map((section) => (
        <div key={section.id} className={styles.categorySection}>
          <h3 className={styles.categoryTitle}>{section.label}</h3>
          <div
            className={
              section.projects.length > 3
                ? `${styles.projectsGrid} ${styles.projectsGridScroll}`
                : `${styles.projectsGrid} ${styles.projectsGridFit}`
            }
          >
            {section.projects.map((project) => (
              <div
                key={project.title}
                className={styles.item}
                style={{
                  "--i": animationIndexByTitle[project.title] ?? 0,
                }}
              >
                <ProjectCard
                  project={project}
                  variant={section.projects.length === 1 ? "single" : "multi"}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};
