"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const branches = [
  { id: 1, name: "Anna Pharmacy Carshalton", address: ["398 Greenwrythe Lane", "Carshalton Sutton", "SM5 1JF"], email: "info@annapharmacy.com", phone: "020 8640 0404", hours: ["Monday to Friday: 9am–7pm", "Saturday: 9am–5pm", "Sunday Closed"], website: "https://annap.hhhosting.co.uk/carshalton/", image: "/images/Carshalton-Image-Branches.webp" },
  { id: 2, name: "Anna Pharmacy Hackbridge", address: ["186 London Rd", "Hackbridge Wallington", "SM6 7FW"], email: "info@annapharmacy.com", phone: "020 8669 0833", hours: ["Monday to Friday: 9am–6:30pm", "Saturday: 9am–1pm", "Sunday Closed"], website: "https://annap.hhhosting.co.uk/hackbridge/", image: "/images/Hackerbridge-Image-Branches-1.webp" },
  { id: 3, name: "Anna Pharmacy The Tudor", address: ["107 Wrythe Ln", "Sutton, Carshalton", "SM5 2RR"], email: "info@annapharmacy.com", phone: "020 8644 8972", hours: ["Monday to Friday: 9am–7pm", "Saturday: 9am–1pm", "Sunday Closed"], website: "https://annap.hhhosting.co.uk/tudor/", image: "/images/branch-tudor.webp" },
  { id: 4, name: "Nima Pharmacy Stoneleigh", address: ["56–58 The Broadway", "Stoneleigh", "KT17 2HS"], email: "info@nimapharmacy.com", phone: "020 8640 0404", hours: ["Monday to Friday: 9am–6:30pm", "Saturday: 9am–1pm", "Sunday Closed"], website: "#", image: "/images/no-img.webp" },
  { id: 5, name: "Nima Pharmacy Richmond", address: ["50 Friars Stile Road", "Richmond", "TW10 6NQ"], email: "info@nimapharmacy.com", phone: "020 8640 0404", hours: ["Monday to Friday: 9am–6:30pm", "Saturday: 9am–1pm", "Sunday Closed"], website: "#", image: "/images/no-img.webp" },
   { id: 6, name: "Patsons Pharmacy", address: ["66 The Broadway", "Stoneleigh", "KT17 2HS"], email: "info@patsons.com", phone: "020 8640 0404", hours: ["Monday to Friday: 9am–6:30pm", "Saturday: 9am–1pm", "Sunday Closed"], website: "#", image: "/images/no-img.webp" },
   { id: 7, name: "Townsend Pharmacy", address: ["1 Western Parade", "Reigate", "RH2 8AU"], email: "info@townsend.com", phone: "020 8640 0404", hours: ["Monday to Friday: 9am–6:30pm", "Saturday: 9am–1pm", "Sunday Closed"], website: "#", image: "/images/no-img.webp" },
   { id: 8, name: "Wonersh Pharmacy", address: ["The Street, Wonersh", "Guildford", "GU5 0PE"], email: "info@wonersh.com", phone: "020 8640 0404", hours: ["Monday to Friday: 9am–6:30pm", "Saturday: 9am–1pm", "Sunday Closed"], website: "#", image: "/images/no-img.webp" },
   { id: 9, name: "Round The Clock Pharmacy", address: ["69 Church Road", "Barnes", "SW13 9HH"], email: "info@roundtheclock.com", phone: "020 8640 0404", hours: ["Monday to Friday: 9am–6:30pm", "Saturday: 9am–1pm", "Sunday Closed"], website: "#", image: "/images/no-img.webp" },
];

const BranchCard = ({ branch, index }) => {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          delay: index * 0.09,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        }
      );
    }, cardRef);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="card-animate relative cursor-pointer overflow-hidden rounded-2xl
  transition-shadow duration-300 ease-in-out"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ 
        boxShadow: hovered
          ? "0 20px 40px rgba(0,0,0,0.15)"
          : "0 2px 10px rgba(0,0,0,0.08)", 
      }}
    >
      {/* Static layer */}
      <div>
        <div className="relative h-[250px] md:h-[330px] bg-[#707070]">
          <img
            src={branch.image}
            alt={branch.name}
            className="absolute inset-0 top-[0] w-full h-full object-cover z-[2]"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        </div>
        <div className="p-8 bg-white">
          <h3 className="text-xl md:text-[28px] font-bold md:leading-8 text-black mb-4">
            {branch.name}
          </h3>
          {branch.address.map((l, i) => (
            <p className="text-[15px] text-black font-normal" key={i}>{l}</p>
          ))}
        </div>
      </div>

      {/* ── Green overlay: bottom → top via translateY ── */}
      <div
        className={`
        absolute left-0 right-0 bottom-0 top-0 md:top-[85px] z-[9]
        bg-[#2e7d32] flex flex-col justify-start
        overflow-y-auto h-[460px]
        px-[30px] py-[22px]
        transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${hovered ? "translate-y-0" : "translate-y-full"}
      `}
      >
        <h3 className="text-xl md:text-[28px] font-bold md:leading-8 text-white mb-4">
          {branch.name}
        </h3>
        {branch.address.map((l, i) => (
          <p key={i} style={{ color: "#fff", fontSize: 15, lineHeight: 1.5 }}>{l}</p>
        ))}
        <div style={{ marginTop: 10 }}>
          <p style={{ color: "#fff", fontSize: 15 }}>
            <strong style={{ color: "#fff" }}>E. </strong><a href={`mailto:${branch.email}`} style={{ color: "#fff" }}>
  {branch.email}
</a>
          </p>
          <p style={{ color: "#fff", fontSize: 15 }}>
            <strong style={{ color: "#fff" }}>T. </strong><a href={`tel:${branch.phone}`} style={{ color: "#fff" }}>{branch.phone}</a>
          </p>
        </div>
        <div style={{ marginTop: 10 }}>
          <p style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Business Hours</p>
          {branch.hours.map((l, i) => (
            <p key={i} style={{ color: "#fff", fontSize: 15, lineHeight: 1.5 }}>{l}</p>
          ))}
        </div>
        <a
  href={branch.website}
  target="_blank" rel="noopener noreferrer"
  onClick={(e) => e.stopPropagation()}
  className="btn-visit relative inline-block mt-[14px]
  bg-black text-white text-[15px] font-normal
  tracking-[0.04em] uppercase
  px-[18px] py-[10px]
  rounded
  no-underline
  self-start"
   
>
  <style>{`
    .btn-visit { transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1); }
    .btn-visit:hover { transform: translateY(0px); }
    .btn-visit:active { transform: translateY(0) scale(0.97); }

    .btn-visit::before {
      content: "";
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 1px;
      background: white;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.35s cubic-bezier(0.22,1,0.36,1) 0s;
      border-radius: 4px 4px 0 0;
    }
    .btn-visit::after {
      content: "";
      position: absolute;
      bottom: 0; right: 0;
      width: 100%; height: 1px;
      background: white;
      transform: scaleX(0);
      transform-origin: right;
      transition: transform 0.35s cubic-bezier(0.22,1,0.36,1) 0s;
      border-radius: 0 0 4px 4px;
    }
    .btn-visit:hover::before,
    .btn-visit:hover::after { transform: scaleX(1); }

    .btn-visit .b-left {
      position: absolute;
      left: 0; top: 0;
      width: 1px; height: 100%;
      background: white;
      transform: scaleY(0);
      transform-origin: top;
      transition: transform 0.3s cubic-bezier(0.22,1,0.36,1) 0.18s;
      border-radius: 4px 0 0 4px;
    }
    .btn-visit .b-right {
      position: absolute;
      right: 0; bottom: 0;
      width: 1px; height: 100%;
      background: white;
      transform: scaleY(0);
      transform-origin: bottom;
      transition: transform 0.3s cubic-bezier(0.22,1,0.36,1) 0.18s;
      border-radius: 0 4px 4px 0;
    }
    .btn-visit:hover .b-left,
    .btn-visit:hover .b-right { transform: scaleY(1); }

    .btn-visit .btn-text { position: relative; z-index: 1; }
  `}</style>

  <span className="b-left" />
  <span className="b-right" />
  <span className="btn-text">VISIT WEBSITE</span>
</a>
      </div>
    </div>
  );
};

export default function Branches() {
  return (
    <>
      {/* Global animation styles */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateX(-30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .hero-title {
          opacity: 0;
          animation: heroFadeIn 0.7s ease forwards 0.15s;
        }
        .section-heading {
          opacity: 0;
          animation: fadeInUp 0.6s ease forwards 0.3s;
        }
        .card-animate {
          /* initial state now handled by GSAP */
        }
      `}</style>

      <main style={{ backgroundColor: "#fff", fontFamily: "sans-serif", minHeight: "100vh" }}>

        {/* Hero */}
        <section className="bg-[#3a3a3a] h-[200px] md:h-[470px] overflow-hidden relative">
          <p className="h-[200px] md:h-full">
            <img src="/images/Branches-Main-Banner.webp" alt="About Us" className="w-full h-full object-cover opacity-90" />
          </p>
          <div className="h-[60px] md:h-[470px] flex items-center flex-row w-full px-6 md:px-12 absolute top-[120px] md:top-0 md:bg-black/10">
            <h1 className="text-4xl md:text-[65px] text-white font-light hero-title">
              Branches
            </h1>
          </div>
        </section>

        {/* Cards */}
        <section className="py-[65px] px-4 md:px-0">
          <div className="sm:mx-6 md:w-[1260px] md:mx-auto">
            <h2 className="text-3xl md:text-5xl font-light text-black mb-14 leading-snug text-center section-heading">
              A <span className="font-bold">Growing</span> Network
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-x-8 md:gap-y-16">
              {branches.map((b, i) => (
                <BranchCard key={b.id} branch={b} index={i} />
              ))}
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
