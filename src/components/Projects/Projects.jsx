import React, { useEffect, useRef } from "react";
import styles from "./Projects.module.css";

import projects from "../../data/projects.json";
import { ProjectCard } from "./ProjectCard";

export const Projects = () => {
  const sliderRef = useRef(null);

  // drag state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);

  // inertia state
  const lastX = useRef(0);
  const lastT = useRef(0);
  const velocity = useRef(0);
  const rafId = useRef(null);

  const stopInertia = () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = null;
  };

  const runInertia = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    // friction (bigger = stops faster)
    const friction = 0.92;

    const step = () => {
      // stop when slow
      if (Math.abs(velocity.current) < 0.15) {
        velocity.current = 0;
        rafId.current = null;
        return;
      }

      slider.scrollLeft -= velocity.current;
      velocity.current *= friction;
      rafId.current = requestAnimationFrame(step);
    };

    stopInertia();
    rafId.current = requestAnimationFrame(step);
  };

  const onPointerDown = (e) => {
    const slider = sliderRef.current;
    if (!slider) return;

    stopInertia();
    isDragging.current = true;

    slider.classList.add(styles.dragging);
    slider.setPointerCapture?.(e.pointerId);

    startX.current = e.clientX;
    startScrollLeft.current = slider.scrollLeft;

    lastX.current = e.clientX;
    lastT.current = performance.now();
    velocity.current = 0;
  };

  const onPointerMove = (e) => {
    const slider = sliderRef.current;
    if (!slider || !isDragging.current) return;

    e.preventDefault();

    const dx = e.clientX - startX.current;
    slider.scrollLeft = startScrollLeft.current - dx;

    // velocity for inertia
    const now = performance.now();
    const dt = now - lastT.current || 16;
    const vx = (e.clientX - lastX.current) / dt; // px/ms
    velocity.current = vx * 20; // tune feel

    lastX.current = e.clientX;
    lastT.current = now;
  };

  const endDrag = (e) => {
    const slider = sliderRef.current;
    if (!slider) return;

    isDragging.current = false;
    slider.classList.remove(styles.dragging);

    // let inertia glide
    runInertia();
    slider.releasePointerCapture?.(e.pointerId);
  };

  // ✅ Wheel scroll -> horizontal slide when mouse is over projects
  const onWheelProjects = (e) => {
    const slider = sliderRef.current;
    if (!slider) return;

    // convert vertical wheel to horizontal scroll
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      slider.scrollLeft += e.deltaY;
    }
  };

  // Buttons (optional but nice)
  const scrollByCards = (direction) => {
    const slider = sliderRef.current;
    if (!slider) return;

    // move ~1 card + gap
    const cardWidth = 380; // matches your card flex-basis
    const gap = 15;
    const amount = (cardWidth + gap) * direction;

    slider.scrollBy({ left: amount, behavior: "smooth" });
  };

  // ✅ Keep this empty effect (no wheel listener here now)
  useEffect(() => {
    return () => {};
  }, []);

  return (
    <section className={styles.container} id="projects">
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Projects</h2>

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => scrollByCards(-1)}
            aria-label="Scroll projects left"
          >
            ‹
          </button>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => scrollByCards(1)}
            aria-label="Scroll projects right"
          >
            ›
          </button>
        </div>
      </div>

      <div className={styles.carouselShell}>
        <div
          className={styles.projects}
          ref={sliderRef}
          onWheelCapture={onWheelProjects}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={() => {
            // if user drags out, finish nicely
            if (isDragging.current) {
              isDragging.current = false;
              sliderRef.current?.classList.remove(styles.dragging);
              runInertia();
            }
          }}
        >
          {projects.map((project, id) => (
            <div
              key={id}
              className={styles.item}
              style={{ "--i": id }}
              aria-label={`Project card ${id + 1}`}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
