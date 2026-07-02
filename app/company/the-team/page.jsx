"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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

function HoverCard({ children, className = "" }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? "0 20px 40px rgba(39,130,40,0.18)" : "none",
        transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease",
      }}>{children}</div>
  );
}

function ParallaxBanner({ src, alt, children, height = "md:h-[470px]" }) {
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
        <img src={src} alt={alt} className="w-full h-full object-cover opacity-90" />
      </div>
      {children}
    </div>
  );
}

function HeroTitle() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);
  return (
    <div className="h-[60px] md:h-[470px] flex items-center w-full px-6 md:px-12 absolute top-[120px] md:top-0 md:bg-black/10">
      <h1 className="text-4xl md:text-[65px] text-white font-extralight" style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 1s ease 0.3s, transform 1s cubic-bezier(0.22,1,0.36,1) 0.3s",
      }}>
        <span className="font-bold">The</span> Team
      </h1>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TEAM CARD — Jaymil style (same overlap layout as Aruna/Mahesh)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const TeamCardSide = ({ name, surname, role, image, bio1, bio2, infoCards = [] }) => {
  const wrapRef = useRef(null);
  const photoRef = useRef(null);
  const textRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useReveal(wrapRef, { from: { opacity: 0, y: 40 }, duration: 0.8, delay: 0.1, ease: "power3.out" });
  useReveal(photoRef, { from: { opacity: 0, x: -40 }, duration: 0.9, delay: 0.25, ease: "power3.out" });
  useReveal(textRef, { from: { opacity: 0, x: 40 }, duration: 0.9, delay: 0.3, ease: "power3.out" });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ── MOBILE ── */
  if (isMobile) {
    return (
      <div style={{ marginBottom: "3rem" }}>
        <div ref={wrapRef} style={{
          borderRadius: "12px", backgroundColor: "#D5F5E3", overflow: "hidden",
        }}>
          <div style={{ width: "100%", height: "320px", overflow: "hidden", position: "relative" }}>
            <img src={image} alt={`${name} ${surname}`} className="w-full h-full object-cover object-[center_top] block" />
            <div className="absolute bottom-4 left-4 bg-white px-[16px] py-[10px] rounded">
              <p style={{ fontSize: "20px", color: "black", margin: 0, lineHeight: 1.2 }}>
                <strong>{name}</strong> <span style={{ fontWeight: 300 }}>{surname}</span>
              </p>
              <p style={{ fontSize: "12px", color: "#278228", fontWeight: 700, letterSpacing: "0.15em", margin: "3px 0 0" }}>{role}</p>
            </div>
          </div>
          <div style={{ padding: "1.5rem" }}>
            {bio1 && <p style={{ fontSize: "15px", color: "black", lineHeight: 1.7, margin: 0 }}>{bio1}</p>}
            {bio2 && <p style={{ fontSize: "15px", color: "black", lineHeight: 1.7, margin: "1rem 0 0" }}>{bio2}</p>}
          </div>
        </div>
        {infoCards.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.25rem" }}>
            {infoCards.map((card, i) => (
              <FadeUp key={i} delay={0.1 + i * 0.15}>
                <HoverCard className="border border-[#278228] bg-white rounded-xl p-6">
                  <p className="text-[15px] text-black leading-relaxed">{card}</p>
                </HoverCard>
              </FadeUp>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ── DESKTOP — unified grid: photo + cards all in same 2-col grid ── */
  return (
    <div ref={wrapRef} style={{ marginBottom: "3rem" }}>
      {/* Single unified 2-col grid — photo spans all rows on left */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>

        {/* Photo — left col, spans all 3 rows */}
        <div ref={photoRef} style={{
          gridColumn: "1 / 2", gridRow: "1 / 4",
          overflow: "hidden", borderRadius: "4px",
        }}>
          <img src={image} alt={`${name} ${surname}`}
            className="w-full h-full object-cover object-top block transition-transform duration-500 ease-in"
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          />
        </div>

        {/* Row 1 right — name + bio */}
        <div ref={textRef} style={{
          gridColumn: "2 / 3", gridRow: "1 / 2",
          paddingBottom: "1rem",
        }}>
          <p className="text-[28px] text-black mb-0.5 leading-tight">
            <strong>{name}</strong> <span style={{ fontWeight: 300 }}>{surname}</span>
          </p>
          <p className="text-[15px] text-[#278228] font-bold tracking-wide mb-5">{role}</p>
          {bio1 && <p style={{ fontSize: "15px", color: "black", lineHeight: 1.7, marginBottom: "1rem" }}>{bio1}</p>}
          {bio2 && <p style={{ fontSize: "15px", color: "black", lineHeight: 1.7 }}>{bio2}</p>}
        </div>

        {/* Row 2 right — Card 1 */}
        {infoCards[0] && (
          <div style={{ gridColumn: "2 / 3", gridRow: "2 / 3" }}>
            <FadeUp delay={0.1}>
              <HoverCard className="border border-[#278228] bg-white rounded-xl p-6 h-full">
                <p className="text-[15px] text-black leading-relaxed">{infoCards[0]}</p>
              </HoverCard>
            </FadeUp>
          </div>
        )}

        {/* Row 3 left — Card 3 */}
        {infoCards[2] && (
          <div style={{ gridColumn: "1 / 2", gridRow: "4 / 5" }}>
            <FadeUp delay={0.2}>
              <HoverCard className="border border-[#278228] bg-white rounded-xl p-6 h-full">
                <p className="text-[15px] text-black leading-relaxed">{infoCards[2]}</p>
              </HoverCard>
            </FadeUp>
          </div>
        )}

        {/* Row 3 right — Card 2 */}
        {infoCards[1] && (
          <div style={{ gridColumn: "2 / 3", gridRow: "4 / 5" }}>
            <FadeUp delay={0.3}>
              <HoverCard className="border border-[#278228] bg-white rounded-xl p-6 h-full">
                <p className="text-[15px] text-black leading-relaxed">{infoCards[1]}</p>
              </HoverCard>
            </FadeUp>
          </div>
        )}
      </div>
    </div>
  );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TEAM CARD — Aruna / Mahesh style
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

  if (isMobile) {
    return (
      <div style={{ marginBottom: "3rem" }}>
        <div ref={cardRef} style={{
          borderRadius: "12px", backgroundColor: "#D5F5E3", overflow: "hidden",
        }}>
          <div style={{ width: "100%", height: "320px", overflow: "hidden", position: "relative" }}>
            <img src={image} alt={`${name} ${surname}`} className="w-full h-full object-cover object-[center_top] block" />
            <div className="absolute bottom-4 left-4 bg-white px-[16px] py-[10px] rounded">
              <p style={{ fontSize: "20px", color: "black", margin: 0, lineHeight: 1.2 }}>
                <strong>{name}</strong> <span style={{ fontWeight: 300 }}>{surname}</span>
              </p>
              <p style={{ fontSize: "12px", color: "#278228", fontWeight: 700, letterSpacing: "0.15em", margin: "3px 0 0" }}>{role}</p>
            </div>
          </div>
          <div style={{ padding: "1.5rem" }}>
            {bio1 && <p style={{ fontSize: "15px", color: "black", lineHeight: 1.7, margin: 0 }}>{bio1}</p>}
            {bio2 && <p style={{ fontSize: "15px", color: "black", lineHeight: 1.7, margin: "1rem 0 0" }}>{bio2}</p>}
          </div>
        </div>
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

  return (
    <div style={{ marginBottom: "3rem" }}>
      <div ref={cardRef} style={{
        position: "relative", paddingTop: "80px",
      }}>
        <div ref={photoRef} className="absolute top-0 bottom-0 left-[2rem] w-[280px] z-10 rounded-lg overflow-hidden">
          <img src={image} alt={`${name} ${surname}`}
            className="w-full h-full object-cover object-top block transition-transform duration-500 ease-in"
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          />
        </div>
        <div className="relative z-[5] rounded-xl bg-[#D5F5E3] overflow-visible">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            <div className="p-8 flex flex-col justify-end min-h-[430px]" />
            <div className="py-12 pr-8 pl-0 flex flex-col justify-center gap-4">
              <p style={{ fontSize: "15px", color: "black", lineHeight: 1.7, margin: 0 }}>{bio1}</p>
              {bio2 && <p style={{ fontSize: "15px", color: "black", lineHeight: 1.7, margin: 0 }}>{bio2}</p>}
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-8 w-[215px] h-[85px] bg-white flex flex-col justify-center px-[20px] z-20">
          <p className="text-[26px] text-black m-0 leading-[1.2]">
            <strong>{name}</strong> <span style={{ fontWeight: 300 }}>{surname}</span>
          </p>
          <p className="text-[13px] text-[#278228] font-bold tracking-[0.15em] mt-[4px] mb-0">{role}</p>
        </div>
      </div>
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
   MAIN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function TheTeam() {
  return (
    <main className="bg-white font-sans text-black">

      <ParallaxBanner src="/images/aboutus-main-banner.webp" alt="The Team">
        <HeroTitle />
      </ParallaxBanner>

      <section className="bg-white px-6 md:px-16 lg:px-32 py-5 md:py-10">
        <div className="md:w-[780px] mx-auto">
          <FadeUp delay={0}>
            <h2 className="text-3xl md:text-5xl font-light text-black mb-8 md:mb-14">
              <span className="font-bold">Leading</span> <span className="font-light">The Way</span>
            </h2>
          </FadeUp>

          <TeamCardSide
            name="Jaymil" surname="Patel" role="Director"
            image="/images/jaymil-n.webp"
            bio1="Jaymil Patel joined the family business in 2013 and now leads the strategic direction of Anna Pharmacy Group. Building on the foundations established in 1987, he has overseen its evolution into a structured, multi-site pharmacy group defined by strong governance, clinical ambition and long-term sustainability."
            bio2="Beyond the organisation, Jaymil plays an active role in shaping the future of community pharmacy."
            infoCards={[
              "He serves as Vice Chair of the South West London LPC and sits on the Surrey LPC, contributing to regional strategic discussions and representing the interests of frontline pharmacy contractors.",
              "His leadership is centred on responsible expansion, disciplined asset stewardship and strengthening the position of community pharmacy within modern primary care.",
              "He remains committed to preserving the values on which the business was built, while shaping a resilient healthcare group designed to endure for generations.",
            ]}
          />

          <TeamCardOverflow
            name="Aruna" surname="Patel" role="Founder"
            image="/images/Aruna-Patel.webp"
            bio1="In 1987, Aruna Patel (Anna), alongside her husband Michael (Mahesh), founded the first Anna Pharmacy with a simple guiding principle: the patient always comes first. For Aruna, community pharmacy was never just about dispensing medicines it was about service, dignity and treating every individual with respect and care."
            bio2="Predominantly based at the counter, she became the familiar face of the pharmacy, welcoming patients by name, listening attentively and ensuring that no one left without feeling heard."
            quotes={[
              "Her philosophy was clear: exceptional customer service is not an add-on, it is the foundation of healthcare.",
              "That unwavering commitment to personal service and community trust remains embedded within Anna Pharmacy Group today, forming the cultural backbone of the organisation as it continues to grow.",
            ]}
          />

          <TeamCardOverflow
            name="Mahesh" surname="Patel" role="Founder"
            image="/images/Mahesh-Patel.webp"
            bio1="Mahesh Patel (Michael), husband of Aruna and father of Jaymil, is a qualified pharmacist who trained at the University of Sunderland. Before establishing the business in the United Kingdom, he practised pharmacy in Tanzania, developing a strong foundation in community-based healthcare and professional discipline."
            bio2="In 1987, Mahesh and Aruna founded their first pharmacy together, starting entirely from scratch. Through hard work, clinical integrity and a deep respect for the communities, they gradually built a trusted local healthcare presence."
            quotes={[
              "The growth of the business was shaped not only by professional commitment, but also by the loyalty and support of local families.",
              "The principles Mahesh brought to the profession, clinical standards, responsibility and long-term thinking, remain embedded within Anna Pharmacy Group today.",
            ]}
          />
        </div>
      </section>

    </main>
  );
}
