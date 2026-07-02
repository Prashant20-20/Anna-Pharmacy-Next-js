"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import emailjs from "@emailjs/browser";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ── GSAP ScrollTrigger reveal hook ── */
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

/* ── Animated counter — starts counting when scrolled into view ── */
function Counter({ to, duration = 1200 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        let start = null;
        const step = (ts) => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / duration, 1);
          setVal(Math.round(p * to));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
    });
    return () => st.kill();
  }, [to, duration]);
  return <span ref={ref}>{val}</span>;
}

/* ── EmailJS Config ── */
const EMAILJS_SERVICE_ID       = "service_prashant";
const EMAILJS_TEMPLATE_ID      = "template_jdili6h";   // Admin email
const EMAILJS_AUTOREPLY_ID     = "template_97oqimy";   // User auto-reply
const EMAILJS_PUBLIC_KEY       = "-056hCRVDKEJfG4lk";

export default function ContactUs() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "", email: "", message: "", preference: "", agreed: false,
  });
  const [openPreference, setOpenPreference] = useState(false);
  const [focused, setFocused] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* scroll-reveal refs */
  const formRef = useRef(null);
  const infoRef = useRef(null);
  useReveal(formRef, { from: { opacity: 0, x: -60 }, duration: 0.8, ease: "power3.out" });
  useReveal(infoRef, { from: { opacity: 0, x: 60 }, duration: 0.8, ease: "power3.out" });

  const preferenceOptions = [
    { value: "", label: "Select Communication Preference" },
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
    { value: "either", label: "Either" },
  ];
  const selectedPreference =
    preferenceOptions.find((o) => o.value === form.preference)?.label ||
    "Select Communication Preference";

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = {
        firstName:  form.firstName,
        lastName:   form.lastName,
        phone:      form.phone,
        email:      form.email,
        message:    form.message,
        preference: form.preference || "Not specified",
      };

      // Admin ko email
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formData,
        EMAILJS_PUBLIC_KEY
      );

      // User ko auto-reply
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_AUTOREPLY_ID,
        formData,
        EMAILJS_PUBLIC_KEY
      );

      const params = new URLSearchParams({
        firstName: form.firstName || "",
        email: form.email || "",
      });
      router.push(`/thank-you?${params.toString()}`);

    } catch (err) {
      console.error("EmailJS error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white font-sans text-gray-900 min-h-screen overflow-x-hidden">
      <style>{`
        /* ── Banner parallax text ── */
        @keyframes bannerSlideUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .banner-title { animation: bannerSlideUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.3s both; }

        /* ── Banner image zoom ── */
        @keyframes bannerZoom {
          from { transform: scale(1.12); }
          to   { transform: scale(1); }
        }
        .banner-img { animation: bannerZoom 1.4s cubic-bezier(0.22,1,0.36,1) both; }

        /* ── Underline expand on input focus ── */
        .field-wrap { position: relative; }
        .field-wrap::after {
          content: ""; position: absolute; bottom: 0; left: 0;
          width: 0; height: 2px; background: #278228;
          transition: width 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .field-wrap.textarea-1::after {
          bottom: 5px;
        }
        .field-wrap.active::after { width: 100%; }

        /* ── Border draw — shared ── */
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

        /* ── Social icon bounce ── */
        .social-btn { transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), background 0.2s; }
        .social-btn:hover { transform: scale(1.18) translateY(-3px); }

        /* ── Info card slide ── */
        .info-card {
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s;
        }
        .info-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); }

        /* ── Float label ── */
        .float-label { transition: transform 0.25s ease, font-size 0.25s ease, color 0.25s ease; }
      `}</style>

      {/* ━━ BANNER ━━ */}
      <section className="bg-[#3a3a3a] h-[200px] md:h-[470px] overflow-hidden relative">
        <div className="h-[200px] md:h-full">
          <img
            src="/images/aboutus-main-banner.webp"
            alt="Contact Us"
            className="banner-img w-full h-full object-cover opacity-90"
          />
        </div>
        <div className="h-[60px] md:h-[470px] flex items-center flex-row w-full px-6 md:px-12 absolute top-[120px] md:top-0 md:bg-black/10">
          <h1 className="banner-title text-4xl md:text-[65px] text-white font-extralight">
            <span className="font-bold">Contact</span> Us
          </h1>
        </div>
      </section>

      {/* ━━ MAIN CONTENT ━━ */}
      <section className="px-6 md:px-16 lg:px-28 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-14 lg:gap-20">

          {/* ── LEFT: Form ── */}
          <div ref={formRef}>
            <h2 className="text-2xl md:text-[28px] mb-8">
              <span className="font-bold">Get In Touch</span>{" "}
              <span className="font-light">With Us</span>
            </h2>

            <form onSubmit={submit} className="flex flex-col gap-0">

              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {[
                  { name: "firstName", label: "Your Name*", type: "text" },
                  { name: "lastName",  label: "Last Name*",  type: "text" },
                ].map(({ name, label, type }) => (
                  <div key={name} className="flex flex-col">
                    <label className="text-sm text-gray-700 mb-1">{label}</label>
                    <div className={`field-wrap${focused === name ? " active" : ""}`}>
                      <input
                        type={type} name={name} value={form[name]} onChange={handle}
                        onFocus={() => setFocused(name)} onBlur={() => setFocused("")}
                        required
                        autoComplete="off"
                        className="border-0 border-b border-gray-800 focus:outline-none pb-1 text-sm bg-transparent w-full"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {[
                  { name: "phone", label: "Phone*", type: "tel"   },
                  { name: "email", label: "Email*", type: "email" },
                ].map(({ name, label, type }) => (
                  <div key={name} className="flex flex-col">
                    <label className="text-sm text-gray-700 mb-1">{label}</label>
                    <div className={`field-wrap${focused === name ? " active" : ""}`}>
                      <input
                        type={type} name={name} value={form[name]} onChange={handle}
                        onFocus={() => setFocused(name)} onBlur={() => setFocused("")}
                        required
                        autoComplete="off"
                        className="border-0 border-b border-gray-800 focus:outline-none pb-1 text-sm bg-transparent w-full"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Message */}
              <div className="flex flex-col mb-8">
                <label className="text-sm text-gray-700 mb-1">Message*</label>
                <div className={`textarea-1 field-wrap${focused === "message" ? " active" : ""}`}>
                  <textarea
                    name="message" value={form.message} onChange={handle}
                    onFocus={() => setFocused("message")} onBlur={() => setFocused("")}
                    required rows={3}
                    className="border-0 border-b border-gray-800 focus:outline-none focus:border-gray-800 text-sm bg-transparent resize-none w-full"
                  />
                </div>
              </div>

              {/* Preference dropdown */}
              <div className="flex flex-col mb-8 relative">
                <button
                  type="button"
                  onClick={() => setOpenPreference(!openPreference)}
                  className="w-full border-b border-gray-800 pb-2 text-sm text-gray-600 bg-transparent flex items-center justify-between text-left focus:outline-none"
                  style={{ transition: "border-color 0.3s" }}
                >
                  <span>{selectedPreference}</span>
                  <span
                    className="text-gray-600 text-xs"
                    style={{ display:"inline-block", transition:"transform 0.3s", transform: openPreference ? "rotate(180deg)" : "rotate(0deg)" }}
                  >▼</span>
                </button>
                {openPreference && (
                  <ul
                    className="absolute top-full left-0 w-full bg-white border border-gray-300 shadow-md z-50"
                    style={{ animation: "bannerSlideUp 0.25s ease both" }}
                  >
                    {preferenceOptions.map((option) => (
                      <li
                        key={option.value}
                        onClick={() => { setForm((p) => ({ ...p, preference: option.value })); setOpenPreference(false); }}
                        className="text-sm text-gray-700 px-4 py-2 cursor-pointer hover:bg-green-600 hover:text-white"
                        style={{ transition: "background 0.18s, color 0.18s" }}
                      >
                        {option.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Checkbox */}
              <div className="flex items-start gap-3 mb-8">
                <input
                  type="checkbox" name="agreed" checked={form.agreed} onChange={handle}
                  id="agree"
                  className="mt-0.5 w-4 h-4 border border-gray-400 rounded-sm cursor-pointer accent-green-600 flex-shrink-0"
                />
                <label htmlFor="agree" className="text-[15px] text-black leading-relaxed cursor-pointer">
                  By ticking this box you confirm you have read, understood and accept our{" "}
                  <a href="#" className="underline text-gray-800 hover:text-green-600 transition-colors">privacy policy</a>
                </label>
              </div>

              {/* reCAPTCHA */}
              <div className="hidden flex items-center gap-3 border border-gray-300 rounded-sm px-4 py-3 mb-8 bg-gray-50" style={{ maxWidth: "300px" }}>
                <div className="w-5 h-5 border-2 border-gray-400 rounded-sm flex-shrink-0" />
                <span className="text-sm text-gray-600">I'm not a robot</span>
                <div className="ml-auto flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <p className="text-[9px] text-gray-400 mt-0.5">reCAPTCHA</p>
                  <p className="text-[8px] text-gray-300">Privacy · Terms</p>
                </div>
              </div>

              {/* Submit button */}
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  type="submit"
                  disabled={loading || !form.agreed}
                  className="btn-draw bg-[#278228] hover:bg-black text-white font-normal text-[15px] uppercase px-8 py-4 transition-colors duration-300 self-start disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ borderRadius: "4px" }}
                >
                  <span className="bd-l" /><span className="bd-r" />
                  <span className="btn-text flex items-center gap-2">
                    {loading && (
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                      </svg>
                    )}
                    {loading ? "SENDING..." : "SEND MESSAGE"}
                  </span>
                </button>

                {error && (
                  <p className="text-red-600 text-sm">{error}</p>
                )}
              </div>

            </form>
          </div>

          {/* ── RIGHT: Info ── */}
          <div ref={infoRef} className="flex flex-col gap-4 lg:pt-12">

            {/* Address */}
            <div className="info-card p-2 rounded-sm border border-transparent hover:border-gray-100">
              <h3 className="text-2xl md:text-[28px] font-bold mb-3">
                Anna Pharmacy
              </h3>
              <p className="text-sm text-black leading-relaxed">
                398 Greenwrythe Lane<br />Carshalton<br />SM5 1JF<br />United Kingdom
              </p>
            </div>

            {/* Contact */}
            <div className="info-card py-2 rounded-sm border border-transparent hover:border-gray-100">
              <h3 className="text-xl md:text-[28px] font-bold mb-2">Contact</h3>
              <p className="text-sm text-black">
                E. <a href="mailto:info@annapharmacy.com" className="hover:text-green-600 transition-colors">info@annapharmacy.com</a>
              </p>
              <p className="text-sm text-black">
                T. <a href="tel:02086400404" className="hover:text-green-600 transition-colors">020 8640 0404</a>
              </p>
            </div>

            {/* Social icons */}
            <div className="flex gap-3">
              <a href="#" className="social-btn w-11 h-11 rounded-full bg-gray-900 hover:bg-green-600 flex items-center justify-center transition-colors duration-200">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a href="#" className="social-btn w-11 h-11 rounded-full bg-gray-900 hover:bg-green-600 flex items-center justify-center transition-colors duration-200">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                </svg>
              </a>
            </div>

            {/* QR Code */}
            <div className="info-card flex items-center gap-4 border border-gray-200 rounded-sm p-4" style={{ maxWidth: "280px" }}>
              <div
                className="hidden md:block flex-shrink-0 w-16 h-16 bg-gray-900 rounded-sm"
                style={{
                  backgroundImage: `url("/images/qr-code.jpg")`,
                  backgroundSize: "cover",
                }}
              />
              <div className="hidden md:block ">
                <p className="text-sm text-black">Scan to</p>
                <p className="text-sm font-bold text-black">Connect with us</p>
              </div>
            </div>

            {/* View All Branches */}
            <Link
              href="/branches"
              className="btn-draw bg-black hover:bg-[#278228] text-white mt-4 font-normal text-[15px] uppercase px-6 py-4 transition-colors duration-300 text-center inline-block"
              style={{ maxWidth: "280px", borderRadius: "4px" }}
            >
              <span className="bd-l" />
              <span className="bd-r" />
              <span className="btn-text">VIEW ALL BRANCHES</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
