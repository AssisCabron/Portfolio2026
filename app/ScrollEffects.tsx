"use client";

import Lenis from "lenis";
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
    const lenis = new Lenis({
      lerp: 0.082,
      wheelMultiplier: 0.92,
      touchMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
      anchors: false,
      respectReducedMotion: true,
      prevent: (node) =>
        node.hasAttribute("data-lenis-prevent") ||
        Boolean(node.closest("[data-lenis-prevent]")),
    });

    const updateScrollProgress = () => {
      document.documentElement.style.setProperty(
        "--scroll-progress",
        lenis.progress.toFixed(4),
      );
    };

    const unsubscribe = lenis.on("scroll", updateScrollProgress);
    let frame = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };

    updateScrollProgress();
    frame = requestAnimationFrame(raf);

    const handleAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (!anchor) return;

      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;

      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target, {
        offset: -24,
        duration: 1.15,
        easing: (t) => 1 - Math.pow(1 - t, 3),
      });
      history.pushState(null, "", hash);
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      cancelAnimationFrame(frame);
      unsubscribe();
      lenis.destroy();
      document.documentElement.style.removeProperty("--scroll-progress");
    };
  }, []);

  return null;
}
