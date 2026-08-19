"use client";

import { useEffect } from "react";

const animatedSelectors = [
  ".hero",
  ".manifesto",
  ".section-title",
  ".project-card",
  ".archive",
  ".about-intro",
  ".about-grid",
  ".tech-rail",
  "footer",
].join(",");

export function ScrollEffects() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!prefersReducedMotion) {
      document.documentElement.classList.add("motion-ready");

      const targets = Array.from(
        document.querySelectorAll<HTMLElement>(animatedSelectors),
      );

      targets.forEach((target, index) => {
        target.classList.add("reveal-target");
        target.style.setProperty("--reveal-delay", `${Math.min(index * 55, 220)}ms`);
      });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
      );

      targets.forEach((target) => observer.observe(target));

      return () => {
        targets.forEach((target) => observer.unobserve(target));
        observer.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (!anchor) return;

      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;

      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", hash);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
