import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./Projects.module.css";

import projects from "../../data/projects.json";
import { ProjectCard } from "./ProjectCard";

const ScrollChevron = ({ dir }) => (
  <svg
    className={styles.scrollNavIcon}
    width="22"
    height="22"
    viewBox="0 0 24 24"
    aria-hidden
  >
    {dir === "prev" ? (
      <path
        fill="currentColor"
        d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
      />
    ) : (
      <path
        fill="currentColor"
        d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
      />
    )}
  </svg>
);

const ProjectsCarousel = ({ children }) => {
  const stripRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateNav = useCallback(() => {
    const el = stripRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const max = scrollWidth - clientWidth;
    const eps = 4;
    setCanPrev(scrollLeft > eps);
    setCanNext(scrollLeft < max - eps);
  }, []);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    updateNav();
    el.addEventListener("scroll", updateNav, { passive: true });
    const ro = new ResizeObserver(updateNav);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateNav);
      ro.disconnect();
    };
  }, [updateNav]);

  const scrollByDir = (direction) => {
    const el = stripRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction * Math.max(240, el.clientWidth * 0.75),
      behavior: "smooth",
    });
  };

  return (
    <div className={styles.scrollOuter}>
      <button
        type="button"
        className={`${styles.scrollNavBtn} ${styles.scrollNavPrev}`}
        disabled={!canPrev}
        onClick={() => scrollByDir(-1)}
        aria-label="Previous projects"
      >
        <ScrollChevron dir="prev" />
      </button>
      <div
        ref={stripRef}
        className={`${styles.projectsGrid} ${styles.projectsGridScroll}`}
      >
        {children}
      </div>
      <button
        type="button"
        className={`${styles.scrollNavBtn} ${styles.scrollNavNext}`}
        disabled={!canNext}
        onClick={() => scrollByDir(1)}
        aria-label="Next projects"
      >
        <ScrollChevron dir="next" />
      </button>
    </div>
  );
};

const CATEGORY_ORDER = [
  "automotive",
  "industrialAutomation",
  "webCloudAi",
];

const CATEGORY_LABELS = {
  automotive: "Automotive",
  industrialAutomation: "Industrial & automation systems",
  webCloudAi: "Web, e-commerce & AI",
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
          {section.projects.length > 3 ? (
            <ProjectsCarousel>
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
            </ProjectsCarousel>
          ) : (
            <div
              className={`${styles.projectsGrid} ${styles.projectsGridFit}`}
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
          )}
        </div>
      ))}
    </section>
  );
};
