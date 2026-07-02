"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const Hero = () => {
  const heroRef = useRef(null);
  const bgLayerRef = useRef(null);
  const textLayerRef = useRef(null);

  useEffect(() => {
    const cells = heroRef.current?.querySelectorAll(".cell");
    if (!cells || !cells.length) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cells,
        { opacity: 0, scale: 1.15, filter: "blur(6px)" },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          delay: 0.3,
        }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const layer = document.getElementById("particles-layer");
    if (!layer) return;
    for (let i = 0; i < 22; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      const size = 1.5 + Math.random() * 3;
      const dur  = 6   + Math.random() * 10;
      const del  = Math.random() * dur;
      const drift = (Math.random() - 0.5) * 120;
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        width: ${size}px; height: ${size}px;
        --drift: ${drift}px;
        animation-duration: ${dur}s;
        animation-delay: -${del}s;
        opacity: ${0.3 + Math.random() * 0.5};
      `;
      layer.appendChild(p);
    }
    return () => { if (layer) layer.innerHTML = ""; };
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
      const dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
      if (bgLayerRef.current)
        bgLayerRef.current.style.transform = `translate(${dx * 12}px, ${dy * 8}px)`;
      if (textLayerRef.current)
        textLayerRef.current.style.transform = `translate(${dx * -6}px, ${dy * -4}px)`;
    };
    const onLeave = () => {
      [bgLayerRef, textLayerRef].forEach(r => {
        if (r.current) {
          r.current.style.transition = "transform 0.6s ease-out";
          r.current.style.transform  = "translate(0,0)";
        }
      });
      setTimeout(() => {
        [bgLayerRef, textLayerRef].forEach(r => {
          if (r.current) r.current.style.transition = "transform 0.12s ease-out";
        });
      }, 600);
    };
    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    return () => {
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
  ref={heroRef}
  className="relative h-screen w-full overflow-hidden bg-black"
>
      <style>{`
        @keyframes slowZoom {
          0%,100% { transform: scale(1.08); }
          50%      { transform: scale(1.18); }
        }
        @keyframes panRight {
          0%,100% { transform: scale(1.12) translateX(-4%); }
          50%      { transform: scale(1.12) translateX(4%); }
        }
        @keyframes panLeft {
          0%,100% { transform: scale(1.12) translateX(4%); }
          50%      { transform: scale(1.12) translateX(-4%); }
        }
        @keyframes panUp {
          0%,100% { transform: scale(1.12) translateY(4%); }
          50%      { transform: scale(1.12) translateY(-4%); }
        }
        @keyframes cellReveal {
          from { opacity: 0; transform: scale(1.15); filter: blur(6px); }
          to   { opacity: 1; transform: scale(1);    filter: blur(0); }
        }
        .cell { opacity: 0; overflow: hidden; }
        .cell.revealed { animation: cellReveal 0.9s cubic-bezier(0.22,1,0.36,1) forwards; }

        @keyframes textSlideUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg,
            rgba(255,255,255,0.5) 0%, #fff 30%,
            rgba(255,255,255,0.5) 60%, #fff 80%,
            rgba(255,255,255,0.5) 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear 2.2s infinite;
        }
        .parallax-bg, .parallax-text { transition: transform 0.12s ease-out; }
        .img-cell { width: 100%; height: 100%; object-fit: cover; display: block; }
      `}</style>

      {/* ── BG grid layer — 4 columns x 3 rows = 12 images ── */}
      <div
        ref={bgLayerRef}
        className="parallax-bg absolute inset-0"
      >
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 gap-[3px]">
          {/* Row 1 */}
          <div className="cell" data-delay="0" style={{ gridColumn: "1", gridRow: "1" }}>
            <img src="/collage-img/1.webp" className="img-cell" alt="" style={{ animation: "slowZoom 10s ease-in-out infinite" }} />
          </div>
          <div className="cell" data-delay="80" style={{ gridColumn: "2", gridRow: "1" }}>
            <img src="/collage-img/2.webp" className="img-cell" alt="" style={{ animation: "panRight 14s ease-in-out infinite" }} />
          </div>
          <div className="cell" data-delay="160" style={{ gridColumn: "3", gridRow: "1" }}>
            <img src="/collage-img/3.webp" className="img-cell" alt="" style={{ animation: "panLeft 12s ease-in-out infinite" }} />
          </div>
          <div className="cell" data-delay="240" style={{ gridColumn: "4", gridRow: "1" }}>
            <img src="/collage-img/4.webp" className="img-cell" alt="" style={{ animation: "slowZoom 12s ease-in-out infinite", animationDelay: "-5s" }} />
          </div>

          {/* Row 2 */}
          <div className="cell" data-delay="320" style={{ gridColumn: "1", gridRow: "2" }}>
            <img src="/collage-img/5.webp" className="img-cell" alt="" style={{ animation: "panUp 12s ease-in-out infinite", animationDelay: "-3s" }} />
          </div>
          <div className="cell" data-delay="400" style={{ gridColumn: "2", gridRow: "2" }}>
            <img src="/collage-img/6.webp" className="img-cell" alt="" style={{ animation: "slowZoom 11s ease-in-out infinite", animationDelay: "-4s" }} />
          </div>
          <div className="cell" data-delay="480" style={{ gridColumn: "3", gridRow: "2" }}>
            <img src="/collage-img/7.webp" className="img-cell" alt="" style={{ animation: "panRight 16s ease-in-out infinite", animationDelay: "-6s" }} />
          </div>
          <div className="cell" data-delay="560" style={{ gridColumn: "4", gridRow: "2" }}>
            <img src="/collage-img/8.webp" className="img-cell" alt="" style={{ animation: "panUp 16s ease-in-out infinite", animationDelay: "-7s" }} />
          </div>

          {/* Row 3 */}
          <div className="cell" data-delay="640" style={{ gridColumn: "1", gridRow: "3" }}>
            <img src="/collage-img/9.webp" className="img-cell" alt="" style={{ animation: "slowZoom 13s ease-in-out infinite", animationDelay: "-6s" }} />
          </div>
          <div className="cell" data-delay="720" style={{ gridColumn: "2", gridRow: "3" }}>
            <img src="/collage-img/10.webp" className="img-cell" alt="" style={{ animation: "panLeft 15s ease-in-out infinite", animationDelay: "-2s" }} />
          </div>
          <div className="cell" data-delay="800" style={{ gridColumn: "3", gridRow: "3" }}>
            <img src="/collage-img/11.webp" className="img-cell" alt="" style={{ animation: "slowZoom 14s ease-in-out infinite", animationDelay: "-3s" }} />
          </div>
          <div className="cell" data-delay="880" style={{ gridColumn: "4", gridRow: "3" }}>
            <img src="/collage-img/15.webp" className="img-cell" alt="" style={{ animation: "panUp 14s ease-in-out infinite", animationDelay: "-8s" }} />
          </div>
        </div>
      </div>

      {/* ── Light overlay — lightened so photos stay clearly visible ── */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-black/60" />

      {/* ── Center vignette — light darkening in middle just enough for text readability ── */}
      <div
  className="pointer-events-none absolute inset-0 z-[2]"
  style={{
    background:
      "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(0,0,0,0.18) 0%, transparent 100%)",
  }}
/>

      {/* ── Particles ── */}
      <div
  id="particles-layer"
  className="pointer-events-none absolute inset-0 z-[3] overflow-hidden"
/>

      {/* ── Text layer — no box, no panel, just text on overlay ── */}
      <div
  ref={textLayerRef}
  className="parallax-text absolute inset-0 z-10 flex items-center justify-center px-4 py-20"
>
        <div className="max-w-[800px] text-center">

          <h2
      className="mb-1 text-[clamp(35px,5vw,60px)] font-extralight leading-[1.1] text-white opacity-0 animate-[textSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_1.1s_forwards]"
    >
            Welcome to
          </h2>

          <h1
      className="mb-5 text-[clamp(50px,7vw,80px)] font-extralight leading-[1.1] text-white opacity-0 animate-[textSlideUp_0.9s_cubic-bezier(0.22,1,0.36,1)_1.35s_forwards]"
    >
            Anna Pharmacy Group
          </h1>

          <p className="shimmer-text mb-[14px] text-[clamp(17px,1.5vw,18px)] font-bold opacity-0" style={{ animation: "shimmer 3s linear 2.2s infinite, textSlideUp 0.7s ease 1.85s forwards", }} >
            Investing in Health. Investing in Communities.
          </p>

           <p
      className="mx-auto max-w-[600px] text-[15px] leading-[1.7] text-white opacity-0 animate-[textSlideUp_0.8s_cubic-bezier(0.22,1,0.36,1)_2.1s_forwards]"
    >
            Anna Pharmacy Group is a growing network of community pharmacies dedicated to making expert, accessible healthcare available to patients across London and the South East. We exist to make healthcare more personal and closer to home for every patient who walks through our doors. 
          </p>

        </div>
      </div>

    </div>
  );
};

export default Hero;
