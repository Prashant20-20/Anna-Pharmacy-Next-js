"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ANIMATION HOOK — GSAP ScrollTrigger
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function useReveal(ref, { from = { opacity: 0, y: 40 }, duration = 0.8, delay = 0, ease = "power3.out", start = "top 85%" } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el, from, {
        opacity: 1, x: 0, y: 0, scale: 1, duration, delay, ease,
        scrollTrigger: { trigger: el, start, once: true },
      });
    }, ref);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function FadeUp({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  useReveal(ref, { from: { opacity: 0, y: 40 }, duration: 0.8, delay, ease: "power3.out" });
  return <div ref={ref} className={className}>{children}</div>;
}

function FadeDir({ children, dir = "left", delay = 0, className = "" }) {
  const ref = useRef(null);
  const x = dir === "left" ? -50 : 50;
  useReveal(ref, { from: { opacity: 0, x }, duration: 0.9, delay, ease: "power3.out" });
  return <div ref={ref} className={className}>{children}</div>;
}

function ScaleIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  useReveal(ref, { from: { opacity: 0, scale: 0.88 }, duration: 0.7, delay, ease: "back.out(1.4)" });
  return <div ref={ref} className={className}>{children}</div>;
}

function AnimatedLine() {
  const ref = useRef(null);
  useReveal(ref, { from: { scaleY: 0 }, duration: 1, delay: 0.3, ease: "power2.out", start: "top 95%" });
  return (
    <div
      ref={ref}
      className="absolute top-[8px] bottom-[8px] left-[106px] w-[2px] border-l-2 border-dashed border-gray-300 origin-top timeline-line"
    />
  );
}

function StaggerContainer({ children, baseDelay = 0, stagger = 0.12, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = Array.from(el.children);
    if (!items.length) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(items, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
        stagger, delay: baseDelay,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    }, ref);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}

function HoverCard({ children, className = "" }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? "0 20px 40px rgba(39,130,40,0.18)" : "none",
        transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease",
      }}
    >
      {children}
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TEAM CARD — Aruna/Mahesh style
   FIX: Mobile pe stack layout, Desktop pe overlap layout
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const TeamCardOverflow = ({ name, surname, role, image, bio1, bio2, quotes = [] }) => {
  const cardRef = useRef(null);
  const photoRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useReveal(cardRef, { from: { opacity: 0, y: 40 }, duration: 0.8, delay: 0.1, ease: "power3.out" });
  useReveal(photoRef, { from: { opacity: 0, x: -40 }, duration: 0.9, delay: 0.25, ease: "power3.out" });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ── MOBILE LAYOUT ── */
  if (isMobile) {
    return (
      <div style={{ marginBottom: "3rem" }}>
        <div
          ref={cardRef}
          style={{
            borderRadius: "12px",
            backgroundColor: "#D5F5E3",
            overflow: "hidden",
          }}
        >
          {/* Photo — full width on mobile */}
          <div style={{ width: "100%", height: "320px", overflow: "hidden", position: "relative" }}>
            <img
              src={image}
              alt={`${name} ${surname}`}
              className="w-full h-full object-cover object-[center_top] block"
            />
            {/* Name badge over image bottom */}
            <div
              className="absolute bottom-4 left-4 bg-white px-[16px] py-[10px] rounded"
            >
              <p style={{ fontSize: "20px", color: "black", margin: 0, lineHeight: 1.2 }}>
                <strong>{name}</strong>{" "}
                <span style={{ fontWeight: 300 }}>{surname}</span>
              </p>
              <p style={{ fontSize: "12px", color: "#278228", fontWeight: 700, letterSpacing: "0.15em", margin: "3px 0 0" }}>
                {role}
              </p>
            </div>
          </div>

          {/* Bio text below image */}
          <div style={{ padding: "1.5rem" }}>
            {bio1 && <p style={{ fontSize: "15px", color: "black", lineHeight: 1.7, margin: 0 }}>{bio1}</p>}
            {bio2 && <p style={{ fontSize: "15px", color: "black", lineHeight: 1.7, margin: "1rem 0 0" }}>{bio2}</p>}
          </div>
        </div>

        {/* Quote cards */}
        {quotes.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.25rem" }}>
            {quotes.map((q, i) => (
              <FadeUp key={i} delay={0.1 + i * 0.15}>
                <HoverCard className="bg-gray-900 text-white rounded-xl p-6">
                  <p className="text-sm leading-relaxed">{q}</p>
                </HoverCard>
              </FadeUp>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ── DESKTOP LAYOUT (original overlap design) ── */
  return (
    <div style={{ marginBottom: "3rem" }}>
      <div
        ref={cardRef}
        style={{
          position: "relative",
          paddingTop: "80px",
        }}
      >
        {/* 1. PHOTO */}
        <div
        ref={photoRef}
        className={`
    absolute top-0 bottom-0 left-[2rem] w-[280px] z-10
    rounded-lg overflow-hidden 
  `}
        >
          <img
            src={image}
            alt={`${name} ${surname}`}
            className="w-full h-full object-cover object-top block transition-transform duration-500 ease-in"
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          />
        </div>

        {/* 2. GREEN CARD */}
        <div
          className="relative z-[5] rounded-xl bg-[#D5F5E3] overflow-visible"
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            <div className="p-8 flex flex-col justify-end min-h-[430px]" />
            <div className="py-12 pr-8 pl-0 flex flex-col justify-center gap-4">
              <p style={{ fontSize: "15px", color: "black", lineHeight: 1.7, margin: 0 }}>{bio1}</p>
              {bio2 && <p style={{ fontSize: "15px", color: "black", lineHeight: 1.7, margin: 0 }}>{bio2}</p>}
            </div>
          </div>
        </div>

        {/* 3. WHITE NAME BOX */}
        <div
          className="absolute bottom-8 left-8 w-[215px] h-[85px] bg-white flex flex-col justify-center px-[20px] z-20"
        >
          <p className="text-[26px] text-black m-0 leading-[1.2]">
            <strong>{name}</strong>{" "}
            <span style={{ fontWeight: 300 }}>{surname}</span>
          </p>
          <p className="text-[13px] text-[#278228] font-bold tracking-[0.15em] mt-[4px] mb-0">
            {role}
          </p>
        </div>
      </div>

      {/* Quote cards */}
      {quotes.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1.25rem" }}>
          {quotes.map((q, i) => (
            <FadeUp key={i} delay={0.1 + i * 0.15}>
              <HoverCard className="bg-gray-900 text-white rounded-xl p-6 h-full">
                <p className="text-sm leading-relaxed">{q}</p>
              </HoverCard>
            </FadeUp>
          ))}
        </div>
      )}
    </div>
  );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TEAM CARD — Jaymil style
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const TeamCardSide = ({ name, surname, role, image, bio1, bio2, infoCards = [] }) => (
  <div className="mb-16 last:mb-0">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
      <FadeDir dir="left" delay={0}>
        <div className="w-full">
          <div className="w-full aspect-square rounded-sm overflow-hidden" style={{ overflow: "hidden" }}>
            <img
              src={image}
              alt={`${name} ${surname}`}
              className="w-full h-full object-cover object-top"
              style={{ transition: "transform 0.7s ease" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.06)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
        </div>
      </FadeDir>

      <FadeDir dir="right" delay={0.1}>
        <div>
          <p className="text-2xl md:text-[28px] text-black mb-0.5">
            <span className="font-bold">{name}</span> <span className="font-light">{surname}</span>
          </p>
          <p className="text-[15px] text-[#278228] font-bold tracking-wide mb-5">{role}</p>
          {bio1 && <p className="text-[15px] text-black leading-relaxed mb-4">{bio1}</p>}
          {bio2 && <p className="text-[15px] text-black leading-relaxed mb-6">{bio2}</p>}
          {infoCards.length > 0 && (
            <div className="flex flex-col gap-3">
              {infoCards.map((card, i) => (
                <FadeUp key={i} delay={0.2 + i * 0.12}>
                  <HoverCard className="border border-[#278228] rounded-xl p-6 bg-white">
                    <p className="text-[15px] text-black leading-relaxed">{card}</p>
                  </HoverCard>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </FadeDir>
    </div>
  </div>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PARALLAX BANNER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ParallaxBanner({ src, alt, children, height = "md:h-[470px]", overlay = true }) {
  const ref = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current || !imgRef.current) return;
      const rect = ref.current.getBoundingClientRect();
      const ratio = rect.top / window.innerHeight;
      imgRef.current.style.transform = `translateY(${ratio * 40}px)`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={ref} className={`bg-[#3a3a3a] h-[200px] ${height} overflow-hidden relative`}>
      <div ref={imgRef} className="absolute inset-0" style={{ willChange: "transform" }}>
        <img src={src} alt={alt} className={`w-full h-full object-cover ${overlay ? "opacity-90" : ""}`} />
      </div>
      {children}
    </div>
  );
}

function HeroTitle() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);
  return (
    <div className="h-[60px] md:h-[470px] flex items-center flex-row w-full px-6 md:px-12 absolute top-[120px] md:top-0 md:bg-black/10">
      <h1
        className="text-4xl md:text-[65px] text-white font-extralight"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 1s ease 0.3s, transform 1s cubic-bezier(0.22,1,0.36,1) 0.3s",
        }}
      >
        <span className="font-bold">About</span> Us
      </h1>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MAIN COMPONENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function AboutUs() {
  return (
    <main className="bg-white font-sans text-black">

      <style>{`
        @media (min-width: 768px) {
          .timeline-line { left: 187px !important; }
        }
      `}</style>

      {/* ━━ PAGE TITLE ━━ */}
      <ParallaxBanner src="/images/aboutus-main-banner.webp" alt="About Us">
        <HeroTitle />
      </ParallaxBanner>

      {/* ━━ BUILT ON FAMILY VALUES ━━ */}
      <section className="bg-white px-6 md:px-16 lg:px-32 py-14 md:py-20">
        <div className="md:w-[780px] mx-auto">
          <FadeUp delay={0}>
            <h2 className="text-3xl md:text-5xl text-black mb-14 leading-snug font-light">
              Built On Family Values.<br />
              <span className="font-bold">Growing With Purpose.</span>
            </h2>
          </FadeUp>

          <div className="relative">
            <AnimatedLine />

            {[
              {
                year: "1987", sub: "The Beginning",
                paras: [
                  "Anna Pharmacy Group was founded in 1987, when Michael and Anna established a single community pharmacy with a simple belief: healthcare should be personal, accessible and rooted in trust.",
                  "From those early days, the pharmacy grew with the support of the local community - built not just on prescriptions dispensed, but on relationships formed across generations.",
                ],
              },
              {
                year: "2013", sub: "New Generation",
                paras: [
                  "In 2013, the next generation joined the business, bringing renewed clinical ambition and a structured vision for growth. What began as a single family pharmacy has evolved into a carefully built group of community pharmacies, united by shared standards, governance and long-term stewardship.",
                ],
              },
              { year: "Today", sub: null, today: true },
            ].map(({ year, sub, paras, today }, i) => (
              <FadeUp key={year} delay={i * 0.18}>
                <div className={`flex items-start ${i < 2 ? "mb-12" : ""}`}>
                  <div className="flex-shrink-0 text-left pr-2 md:w-[180px]">
                    <p className="text-2xl md:text-5xl text-black font-extralight w-[90px] md:w-full">{year}</p>
                    {sub && <p className="text-sm md:text-lg font-bold text-black tracking-wide mt-0.5 w-[90px] md:w-full">{sub}</p>}
                  </div>
                  <div
                    className="flex-shrink-0 w-4 h-4 rounded-full border-2 border-green-500 bg-white mt-1.5 z-10"
                    style={{ transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.5)"; e.currentTarget.style.boxShadow = "0 0 0 6px rgba(39,130,40,0.15)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                  <div className="flex-1 pl-4 pt-0.5">
                    {paras && paras.map((p, j) => (
                      <p key={j} className={`text-sm text-black leading-relaxed ${j > 0 ? "mt-3" : ""}`}>{p}</p>
                    ))}
                    {today && (
                      <p className="text-sm text-black leading-relaxed">
                        We Remain <strong>Proudly Independent</strong><br />And Intentionally Ambitious.
                      </p>
                    )}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ━━ OUR PHILOSOPHY ━━ */}
      <section className="px-6 md:px-16 lg:px-32 pb-0">
        <div className="md:w-[780px] mx-auto">
          <ScaleIn delay={0}>
            <div className="relative rounded-[15px] overflow-hidden h-56 md:h-[345px] bg-gray-700 text-center">
              <img src="/images/About-Us-Our-Philosophy.webp" alt="Our Philosophy" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute inset-0 bg-[#278228]/10" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 md:p-12">
                <FadeUp delay={0.3}>
                  <h2 className="text-white text-3xl md:text-5xl font-bold mb-4">Our Philosophy</h2>
                </FadeUp>
                <FadeUp delay={0.5}>
                  <p className="text-white text-sm md:text-base max-w-xs md:max-w-lg mx-auto leading-relaxed text-center">
                    We believe community pharmacy is one of the most powerful yet underutilised assets within the NHS.
                  </p>
                </FadeUp>
              </div>
            </div>
          </ScaleIn>
        </div>
      </section>

      <section className="bg-white px-6 md:px-16 lg:px-32 py-14">
        <div className="md:w-[780px] mx-auto">
          <FadeUp delay={0}>
            <p className="text-center text-xl md:text-[22px] text-black font-bold mb-10">Our Approach Combines</p>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { img: "/images/users-icon.svg", label: "Strong family values and local accountability" },
              { img: "/images/ai-governance-lifecycle.svg", label: "Robust governance and regulatory excellence" },
              { img: "/images/clinic-medical.svg", label: "Investment in workforce development and community wellbeing" },
            ].map((c, i) => (
              <FadeUp key={c.label} delay={i * 0.14}>
                <HoverCard className="flex flex-col items-center text-center gap-3 border border-[#E9E9E9] rounded-xl p-4 md:p-7 h-full">
                  <img src={c.img} alt={c.label} className="w-12 h-12 object-contain" />
                  <p className="text-sm text-black leading-relaxed max-w-[200px]">{c.label}</p>
                </HoverCard>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={0.1}>
            <div className="bg-gray-900 text-white text-center py-7 px-6 rounded-lg">
              <p className="text-xl md:leading-9">
                We are not short-term operators. We build<br />
                <span className="text-[#278228] font-medium uppercase">SUSTAINABLE </span>
                <span className="font-bold">HEALTHCARE INFRASTRUCTURE.</span>
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ━━ ROOTED IN COMMUNITY ━━ */}
      <section className="px-6 md:px-16 lg:px-32 py-14 md:py-20" style={{ backgroundColor: "#D5F5E3" }}>
        <div className="md:w-[780px] mx-auto">
          <FadeUp delay={0}>
            <h2 className="text-3xl md:text-5xl font-normal text-black leading-[40px] md:leading-[56px] mb-6">
              <span className="font-bold">Rooted</span> in Community,<br />
              Focused on the <span className="text-green-600 font-bold">Future</span>
            </h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-10">
            <FadeDir dir="left" delay={0.1}>
              <p className="text-sm text-black leading-relaxed">Every branch remains locally grounded serving its own community with care, familiarity and professionalism.</p>
            </FadeDir>
            <FadeDir dir="right" delay={0.15}>
              <p className="text-sm text-black leading-relaxed">At the same time, we are building a modern pharmacy group designed to thrive in a changing healthcare landscape. We actively invest in:</p>
            </FadeDir>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {[
              { content: <><p className="text-3xl font-bold italic">NHS</p><p className="text-sm leading-relaxed">Expanded NHS<br />clinical services</p></> },
              { content: <><img src="/images/Fi-Br-Doctor.svg" alt="" /><p className="text-base leading-relaxed">Responsible private<br />service development</p></> },
              { content: <><img src="/images/Leaderboard-Star.svg" alt="" /><p className="text-base leading-relaxed">Workforce capability<br />and leadership</p></> },
            ].map((c, i) => (
              <FadeUp key={i} delay={i * 0.13}>
                <HoverCard className="bg-[#278228] text-white rounded-xl py-5 px-4 md:py-10 md:px-6 flex flex-col items-center text-center gap-3 h-full">
                  {c.content}
                </HoverCard>
              </FadeUp>
            ))}
          </div>
          <div className="grid grid-cols-1 md:flex gap-4">
            <FadeUp delay={0.1}>
              <HoverCard className="bg-[#278228] text-white rounded-xl py-5 px-4 md:py-10 md:px-6 flex flex-col items-center text-center gap-3 h-full lg:w-[340px]">
                <img src="/images/Healthcare.svg" alt="" />
                <p className="text-base leading-relaxed">Preventative healthcare and<br />long-term condition support</p>
              </HoverCard>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="bg-gray-900 text-white rounded-xl py-5 px-4 md:py-10 md:px-6 flex flex-col items-center justify-center text-center h-full lg:w-[420px]">
                <p className="text-lg font-semibold leading-relaxed">
                  Community pharmacy is evolving.<br />We intend to lead that evolution,<br />not react to it.
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ━━ RESPONSIBLE GROWTH ━━ */}
      <section className="bg-white px-6 md:px-16 lg:px-32 py-14 md:py-20">
        <div className="md:w-[780px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 items-start">
            <FadeDir dir="left" delay={0}>
              <div>
                <h2 className="text-3xl md:text-5xl font-normal text-black">Responsible</h2>
                <h2 className="text-3xl md:text-5xl font-bold text-[#278228] mb-4 md:mb-6">Growth</h2>
                <p className="text-sm md:text-[22px] font-semibold text-black mb-4 md:mb-8 leading-8">Our growth has been <br className="hidden md:block" />deliberate and disciplined</p>
                <p className="text-sm md:text-xl text-black leading-relaxed mb-5">We acquire and integrate pharmacies <br className="hidden md:block" />where we get:</p>
                <ul className="space-y-3.5 mb-8">
                  {["Strengthen clinical deliverables", "Improve operational structure", "Protect community access to healthcare", "Provide continuity for patients and staff"].map((item, i) => (
                    <FadeUp key={item} delay={0.1 + i * 0.1}>
                      <li className="flex items-start gap-3 text-[15px] font-medium text-black">
                        <span className="text-white bg-[#278228] rounded-full w-[18px] h-[18px] text-center text-[12px] mt-0.5 flex-shrink-0">✓</span>
                        {item}
                      </li>
                    </FadeUp>
                  ))}
                </ul>
              </div>
            </FadeDir>
            <FadeDir dir="right" delay={0.15}>
              <div>
                <div className="w-full md:h-[470px] overflow-hidden">
                  <div className="relative w-full h-[470px]">
                    {[
                      { src: "/images/Responsible-Growth-image1.webp", alt: "Pharmacy 1", cls: "absolute top-0 left-0 w-full md:w-[55%] h-[48%] object-cover rounded-xl" },
                      { src: "/images/Responsible-Growth-image2.webp", alt: "Pharmacy 2", cls: "absolute top-[20%] left-[25%] w-full md:w-[55%] h-[55%] object-cover rounded-xl shadow-lg z-10" },
                      { src: "/images/Responsible-Growth-image3.webp", alt: "Pharmacy 3", cls: "absolute bottom-0 left-0 w-full md:w-[55%] h-[48%] object-cover rounded-xl" },
                    ].map((img, i) => (
                      <img
                        key={img.alt}
                        src={img.src}
                        alt={img.alt}
                        className={img.cls}
                        style={{ transition: "transform 0.5s ease, box-shadow 0.5s ease" }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.zIndex = "20"; e.currentTarget.style.boxShadow = "0 20px 50px rgba(0,0,0,0.25)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.zIndex = i === 1 ? "10" : ""; e.currentTarget.style.boxShadow = ""; }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </FadeDir>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 items-start mt-8">
            <p className="text-[15px] text-black leading-relaxed">We embrace conversations with independent pharmacy owners considering succession, and will always proceed with a caring, forward-thinking process.</p>
            <p className="text-15px text-black leading-relaxed">Growth for us is not about scale alone. It's about building a reputation, and building that as a group.</p>
          </div>
        </div>
      </section>

      {/* ━━ OUR COMMITMENT ━━ */}
      <section className="px-6 md:px-16 lg:px-32 pb-0">
        <div className="md:w-[780px] mx-auto">
          <ScaleIn delay={0}>
            <div className="relative rounded-[15px] overflow-hidden h-56 md:h-[345px] text-center">
              <img src="/images/About-Us-Our-Commitment.webp" alt="Our Philosophy" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute inset-0 bg-[#278228]/10" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 md:p-12">
                <FadeUp delay={0.3}>
                  <h2 className="text-white text-3xl md:text-5xl font-bold mb-4">Our Commitment</h2>
                </FadeUp>
                <FadeUp delay={0.5}>
                  <p className="text-white text-sm md:text-base max-w-xs md:max-w-lg mx-auto leading-relaxed text-center">
                    Anna Pharmacy Group provides patient-centred pharmacy services going beyond dispensing to deliver genuine care.
                  </p>
                </FadeUp>
              </div>
            </div>
          </ScaleIn>
        </div>
      </section>

      <section className="bg-white px-6 md:px-16 lg:px-32 py-14">
        <div className="md:w-[780px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { img: "/images/Integrity.svg", label: "Integrity" },
              { img: "/images/Accountability.svg", label: "Accountability" },
              { img: "/images/Long-term-thinking.svg", label: "Long-term thinking" },
            ].map((c, i) => (
              <FadeUp key={c.label} delay={i * 0.14}>
                <HoverCard className="flex flex-col items-center text-center gap-3 border border-[#E9E9E9] rounded-xl p-4 md:p-7 h-full">
                  <img src={c.img} alt={c.label} className="w-12 h-12 object-contain" />
                  <p className="text-sm text-black leading-relaxed max-w-[200px]">{c.label}</p>
                </HoverCard>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={0.1}>
            <div className="bg-black text-white text-center py-7 px-6 rounded-lg">
              <p className="text-[15px] tracking-wide leading-8">
                Anna Pharmacy Group exists to deliver high-quality community healthcare today - while <br className="hidden md:block" />building a stable, generational healthcare business for tomorrow.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

       

      {/* ━━ SERVING COMMUNITIES ━━ */}
      <section className="md:w-[780px] mx-auto mb-12">
        <FadeUp delay={0}>
          <div className="bg-[#278228] px-6 md:px-16 lg:px-20 py-16 mx-6 md:mx-0 text-left rounded-xl">
            <h2 className="text-white text-2xl md:text-[28px] font-light mb-5">
              <span className="font-bold">Serving Communities</span> Across The UK
            </h2>
            <p className="text-green-100 text-[15px] max-w-2xl mx-auto leading-relaxed mb-8">
              From London to the South East and beyond, Anna Pharmacy Group is committed to bringing expert, community-led pharmacy care to more patients every year. Whether you are a patient looking for your nearest branch or an independent pharmacy owner considering your next step, we welcome the conversation.
            </p>
            <Link
        href="/branches"
        onClick={() => window.scrollTo(0, 0)}
        className="btn-branches"
        style={{
          position: "relative",
          display: "inline-block",
          padding: "14px 32px",
          background: "black",
          color: "white",
          fontSize: "15px",
          letterSpacing: "4%",
          textTransform: "uppercase",
          textDecoration: "none",
          fontWeight: 400,
        }}
      >
        <style>{`
          .btn-branches { transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1); }
          .btn-branches:hover { transform: translateY(0px); }
          .btn-branches:active { transform: translateY(0) scale(0.97); }

          /* Top border — left to right */
          .btn-branches::before {
            content: "";
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 1px;
            background: white;
            transform: scaleX(0);
            transform-origin: left;
            transition: transform 0.35s cubic-bezier(0.22,1,0.36,1) 0s;
          }
          /* Bottom border — right to left */
          .btn-branches::after {
            content: "";
            position: absolute;
            bottom: 0; right: 0;
            width: 100%; height: 1px;
            background: white;
            transform: scaleX(0);
            transform-origin: right;
            transition: transform 0.35s cubic-bezier(0.22,1,0.36,1) 0s;
          }
          .btn-branches:hover::before,
          .btn-branches:hover::after { transform: scaleX(1); }

          /* Left border — top to bottom */
          .btn-branches .b-left {
            position: absolute;
            left: 0; top: 0;
            width: 1px; height: 100%;
            background: white;
            transform: scaleY(0);
            transform-origin: top;
            transition: transform 0.3s cubic-bezier(0.22,1,0.36,1) 0.18s;
          }
          /* Right border — bottom to top */
          .btn-branches .b-right {
            position: absolute;
            right: 0; bottom: 0;
            width: 1px; height: 100%;
            background: white;
            transform: scaleY(0);
            transform-origin: bottom;
            transition: transform 0.3s cubic-bezier(0.22,1,0.36,1) 0.18s;
          }
          .btn-branches:hover .b-left,
          .btn-branches:hover .b-right { transform: scaleY(1); }

          .btn-branches .btn-text { position: relative; z-index: 1; }
        `}</style>

        <span className="b-left" />
        <span className="b-right" />
        <span className="btn-text">VIEW ALL BRANCHES</span>
      </Link>
          </div>
        </FadeUp>
      </section>

    </main>
  );
}
