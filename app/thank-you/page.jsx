"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const firstName = searchParams.get("firstName") || "";
  const email = searchParams.get("email") || "";

  /* ── Redirect to home if someone lands here directly ── */
  useEffect(() => {
    if (!firstName && !email) {
      router.replace("/");
    }
  }, [firstName, email, router]);

  /* ── Tick animation trigger ── */
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="bg-white font-sans text-gray-900 min-h-screen overflow-x-hidden">
      <style>{`
        /* ── Banner zoom ── */
        @keyframes bannerZoom {
          from { transform: scale(1.12); }
          to   { transform: scale(1); }
        }
        .banner-img { animation: bannerZoom 1.4s cubic-bezier(0.22,1,0.36,1) both; }

        @keyframes bannerSlideUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .banner-title { animation: bannerSlideUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.3s both; }

        /* ── Card fade-up ── */
        .ty-card {
          opacity: 0;
          transform: translateY(48px);
          transition: opacity 0.75s cubic-bezier(0.22,1,0.36,1),
                      transform 0.75s cubic-bezier(0.22,1,0.36,1);
        }
        .ty-card.in {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Circle draw ── */
        @keyframes circleDraw {
          from { stroke-dashoffset: 314; }
          to   { stroke-dashoffset: 0; }
        }
        .circle-path {
          stroke-dasharray: 314;
          stroke-dashoffset: 314;
          animation: circleDraw 0.8s cubic-bezier(0.22,1,0.36,1) 0.3s forwards;
        }

        /* ── Tick draw ── */
        @keyframes tickDraw {
          from { stroke-dashoffset: 60; opacity: 0; }
          to   { stroke-dashoffset: 0;  opacity: 1; }
        }
        .tick-path {
          stroke-dasharray: 60;
          animation: tickDraw 0.5s ease 0.9s both;
        }

        /* ── Stagger children ── */
        .stagger > *:nth-child(1) { transition-delay: 0.15s; }
        .stagger > *:nth-child(2) { transition-delay: 0.28s; }
        .stagger > *:nth-child(3) { transition-delay: 0.41s; }
        .stagger > *:nth-child(4) { transition-delay: 0.54s; }

        /* ── Button draw border ── */
        .btn-draw { position: relative; transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1) !important; }
        .btn-draw:hover { transform: translateY(0px) !important; }
        .btn-draw:active { transform: translateY(0) scale(0.97) !important; }
        .btn-draw::before {
          content: ""; position: absolute; top: 0; left: 0;
          width: 100%; height: 2px; background: white;
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1) 0s;
          border-radius: 4px 4px 0 0;
        }
        .btn-draw::after {
          content: ""; position: absolute; bottom: 0; right: 0;
          width: 100%; height: 1px; background: white;
          transform: scaleX(0); transform-origin: right;
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1) 0s;
          border-radius: 0 0 4px 4px;
        }
        .btn-draw:hover::before, .btn-draw:hover::after { transform: scaleX(1); }
        .btn-draw .bd-l {
          position: absolute; left: 0; top: 0;
          width: 1px; height: 100%; background: white;
          transform: scaleY(0); transform-origin: top;
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1) 0.18s;
          border-radius: 4px 0 0 4px;
        }
        .btn-draw .bd-r {
          position: absolute; right: 0; bottom: 0;
          width: 1px; height: 100%; background: white;
          transform: scaleY(0); transform-origin: bottom;
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1) 0.18s;
          border-radius: 0 4px 4px 0;
        }
        .btn-draw:hover .bd-l, .btn-draw:hover .bd-r { transform: scaleY(1); }
        .btn-draw .btn-text { position: relative; z-index: 1; }

        /* ── Divider line ── */
        .divider {
          width: 0;
          height: 2px;
          background: #278228;
          transition: width 1s cubic-bezier(0.22,1,0.36,1) 0.6s;
        }
        .divider.in { width: 60px; }
      `}</style>

      {/* ━━ BANNER ━━ */}
      <section className="bg-[#3a3a3a] h-[200px] md:h-[470px] overflow-hidden relative">
        <div className="h-[200px] md:h-full">
          <img
            src="/images/about-main-banner.jpg"
            alt="Thank You"
            className="banner-img w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="h-[60px] md:h-[470px] flex items-center w-full px-6 md:px-12 absolute top-[120px] md:top-0 md:bg-black/70">
          <h1 className="banner-title text-4xl md:text-[65px] text-white font-extralight">
            <span className="font-bold">Thank</span> You
          </h1>
        </div>
      </section>

      {/* ━━ CONTENT ━━ */}
      <section className="px-6 md:px-16 lg:px-28 py-20 md:py-28 flex justify-center">
        <div className={`ty-card stagger${show ? " in" : ""} max-w-3xl w-full text-center flex flex-col items-center gap-6`}>

          {/* Animated tick circle */}
          <div className="mb-2">
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Background circle */}
              <circle cx="50" cy="50" r="48" stroke="#e5e7eb" strokeWidth="2" />
              {/* Animated circle draw */}
              <circle
                className="circle-path"
                cx="50" cy="50" r="48"
                stroke="#278228" strokeWidth="2.5"
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                fill="none"
              />
              {/* Green filled circle */}
              <circle cx="50" cy="50" r="38" fill="#278228" opacity="0.08" />
              <circle cx="50" cy="50" r="30" fill="#278228" opacity="0.12" />
              {/* Tick */}
              <path
                className="tick-path"
                d="M30 50l13 14 27-28"
                stroke="#278228"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>

          {/* Heading */}
          <div>
            {/* <h2 className="text-3xl md:text-[40px] font-extralight leading-tight mb-2">
              {firstName ? (
                <>Message received,{" "}<span className="font-bold">{firstName}!</span></>
              ) : (
                <><span className="font-bold">Message</span> received!</>
              )}
            </h2> */}
            {/* Green divider */}
            <div className={`divider mx-auto${show ? " in" : ""}`} />
          </div>

          {/* Body copy */}
         <h2 className="text-3xl md:text-[40px] font-extralight leading-tight mb-2">Thank you for reaching out to Anna Pharmacy.</h2>
          <p className="text-gray-600 text-[16px] leading-relaxed  ">
           We've received your enquiry and
            one of our team members will be in touch with you shortly.
          </p>

          {/* {email && (
            <p className="text-sm text-gray-500">
              A confirmation has been sent to{" "}
              <span className="font-medium text-gray-800">{email}</span>
            </p>
          )} */}

          {/* Info strip */}
          <div className="w-full border border-gray-100 rounded-sm grid grid-cols-1 md:grid-cols-3 divide-y hidden md:divide-y-0 md:divide-x divide-gray-100 mt-2">
            {[
              {
                icon: (
                  <svg className="w-5 h-5 text-[#278228]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                label: "Response Time",
                value: "Within 24 hours",
              },
              {
                icon: (
                  <svg className="w-5 h-5 text-[#278228]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                ),
                label: "Phone",
                value: "020 8640 0404",
              },
              {
                icon: (
                  <svg className="w-5 h-5 text-[#278228]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
                label: "Email",
                value: "info@annapharmacy.com",
              },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex flex-col items-center gap-1 py-5 px-4">
                {icon}
                <p className="text-xs text-gray-400 uppercase tracking-wide mt-1">{label}</p>
                <p className="text-sm font-medium text-gray-800">{value}</p>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link
              href="/"
              className="btn-draw bg-[#278228] hover:bg-black text-white font-normal text-[15px] uppercase px-8 py-4 transition-colors duration-300"
              style={{ borderRadius: "4px" }}
            >
              <span className="bd-l" /><span className="bd-r" />
              <span className="btn-text">BACK TO HOME</span>
            </Link>
            
          </div>

        </div>
      </section>
    </main>
  );
}

export default function ThankYou() {
  return (
    <Suspense fallback={null}>
      <ThankYouContent />
    </Suspense>
  );
}
