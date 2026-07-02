"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Animates a ref'd element in when it scrolls into view, using GSAP + ScrollTrigger.
 * Drop-in replacement for the old IntersectionObserver-based `useInView` hooks —
 * but instead of just returning a boolean, it directly drives the tween.
 */
export function useGsapReveal(
  ref,
  {
    from = { opacity: 0, y: 40 },
    duration = 0.8,
    delay = 0,
    ease = "power3.out",
    start = "top 85%",
    once = true,
  } = {}
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        from,
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration,
          delay,
          ease,
          scrollTrigger: {
            trigger: el,
            start,
            once,
          },
        }
      );
    }, ref);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * Wrapper component version — use for simple "wrap children, reveal on scroll" cases.
 * Replaces FadeUp / FadeDir / ScaleIn from the old code.
 */
export function Reveal({
  children,
  className = "",
  from,
  duration,
  delay,
  ease,
  start,
  as: Tag = "div",
  style,
}) {
  const ref = useRef(null);
  useGsapReveal(ref, { from, duration, delay, ease, start });
  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}

/** Stagger a group of direct children in on scroll. */
export function StaggerReveal({ children, className = "", baseDelay = 0, stagger = 0.12, from = { opacity: 0, y: 30 } }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = Array.from(el.children);
    if (!items.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        from,
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger,
          delay: baseDelay,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, ref);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
