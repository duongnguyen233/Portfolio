import React from "react";
import styles from "./Projects.module.css";

import projects from "../../data/projects.json";
import { ProjectCard } from "./ProjectCard";

export const Projects = () => {
  return (
    <section className={styles.container} id="projects">
      <div className={styles.header}>
        <h2 className={styles.title}>Projects</h2>
      </div>

      <div className={styles.projectsGrid}>
        {projects.map((project, projectIndex) => (
          <div
            key={project.title}
            className={styles.item}
            style={{
              "--i": projectIndex,
            }}
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </section>
  );
};
