"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const STYLES = `
  @keyframes navFadeDown {
    from { opacity: 0; transform: translateY(-18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes logoSlideIn {
    from { opacity: 0; transform: translateX(-24px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes navLinkFadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes flipInLeft {
    from { opacity: 0; transform: rotateY(-90deg); }
    to   { opacity: 1; transform: rotateY(0deg); }
  }
  @keyframes subItemIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .nav-bar-animated {
    animation: navFadeDown 0.6s cubic-bezier(0.22,1,0.36,1) forwards;
  }
  .nav-logo-animated {
    opacity: 0;
    animation: logoSlideIn 0.7s cubic-bezier(0.22,1,0.36,1) 0.2s forwards;
  }

  .nav-link-item { opacity: 0; }
  .nav-link-item:nth-child(1) { animation: navLinkFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.25s forwards; }
  .nav-link-item:nth-child(2) { animation: navLinkFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.35s forwards; }
  .nav-link-item:nth-child(3) { animation: navLinkFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.45s forwards; }
  .nav-link-item:nth-child(4) { animation: navLinkFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.55s forwards; }

  /* Desktop nav links */
  .nav-desktop-link {
    position: relative;
    transition: color 0.25s ease, background 0.25s ease;
  }
  .nav-desktop-link::after {
    content: '';
    position: absolute;
    bottom: 4px; left: 12px; right: 12px;
    height: 2px;
    background: #278228;
    border-radius: 2px;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
  }
  .nav-desktop-link:not(.active-link):hover::after { transform: scaleX(1); }
  .nav-desktop-link.active-link::after { display: none; }

  /* ── Desktop Submenu — always mounted, transitions on open/close ── */
  .submenu-wrapper {
    position: absolute;
    top: calc(100% + 10px);
    left: 80%;
    transform: translateX(-50%) translateY(-8px);
    min-width: 190px;
    background: rgba(8, 8, 8, 0.97);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(39,130,40,0.35);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 20px 50px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.03), 0 0 30px rgba(39,130,40,0.08);
    z-index: 200;
    pointer-events: none;
    opacity: 0;
    visibility: hidden;
    transition:
      opacity 0.28s cubic-bezier(0.22,1,0.36,1),
      transform 0.28s cubic-bezier(0.22,1,0.36,1),
      visibility 0.28s;
  }
  .submenu-wrapper.sub-visible {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translateX(-50%) translateY(0px);
  }

  /* Arrow caret */
  .submenu-wrapper::before {
    content: '';
    position: absolute;
    top: -5px;
    left: 50%;
    width: 10px; height: 10px;
    background: rgba(8,8,8,0.97);
    border-left: 1px solid rgba(39,130,40,0.35);
    border-top: 1px solid rgba(39,130,40,0.35);
    transform: translateX(-50%) rotate(45deg);
    border-radius: 2px 0 0 0;
  }

  /* Submenu items */
  .submenu-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 13px 18px;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255,255,255);
    text-decoration: none;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.22s ease, color 0.22s ease, padding-left 0.22s ease;
    position: relative;
  }
  .submenu-item:last-child { border-bottom: none; }

  /* green left bar on hover */
  .submenu-item::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    background: #278228;
    transform: scaleY(0);
    transform-origin: center;
    border-radius: 0 2px 2px 0;
    transition: transform 0.22s cubic-bezier(0.22,1,0.36,1);
  }
  .submenu-item:hover::before,
  .submenu-item.active-sub::before { transform: scaleY(1); }

  .submenu-item:hover {
    background: rgba(39,130,40,0.12);
    color: #7fff7f;
    padding-left: 24px;
  }
  .submenu-item.active-sub {
    background: rgba(39,130,40,0.2);
    color: #7fff7f;
    padding-left: 24px;
  }

  /* staggered appear when sub becomes visible */
  .submenu-wrapper.sub-visible .submenu-item:nth-child(1) {
    animation: subItemIn 0.3s cubic-bezier(0.22,1,0.36,1) 0.05s both;
  }
  .submenu-wrapper.sub-visible .submenu-item:nth-child(2) {
    animation: subItemIn 0.3s cubic-bezier(0.22,1,0.36,1) 0.12s both;
  }

  /* Chevron inside About Us button */
  .about-chevron {
    transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
    opacity: 0.65;
    margin-top: 1px;
  }
  .about-chevron.flipped { transform: rotate(180deg); }

  /* ── Mobile ── */
  .mobile-links-wrap { perspective: 500px; }

  .mobile-flip-link {
    display: flex;
    align-items: center;
    padding: 12px 14px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #fff;
    text-decoration: none;
    margin-bottom: 2px;
    opacity: 0;
    transform-origin: left center;
    transition: background 0.22s ease, color 0.22s ease;
  }
  .mobile-flip-link:hover { background: rgba(255,255,255,0.07); }
  .mobile-flip-link.active-mobile { background: #278228; }

  .flip-open-1 { animation: flipInLeft 0.42s cubic-bezier(0.22,1,0.36,1) 0.05s forwards; }
  .flip-open-2 { animation: flipInLeft 0.42s cubic-bezier(0.22,1,0.36,1) 0.13s forwards; }
  .flip-open-3 { animation: flipInLeft 0.42s cubic-bezier(0.22,1,0.36,1) 0.21s forwards; }
  .flip-open-4 { animation: flipInLeft 0.42s cubic-bezier(0.22,1,0.36,1) 0.29s forwards; }

  /* Mobile About accordion */
  .mobile-about-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 12px 14px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #fff;
    background: transparent;
    border: none;
    cursor: pointer;
    margin-bottom: 2px;
    transition: background 0.22s ease;
  }
  .mobile-about-btn:hover,
  .mobile-about-btn.mob-about-active { background: rgba(39,130,40,0.22); }

  .mob-sub-arrow {
    width: 16px; height: 16px;
    display: flex; align-items: center; justify-content: center;
    transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
  }
  .mob-sub-arrow.rotated { transform: rotate(180deg); }

  .mobile-sub-container {
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    margin-left: 12px;
    transition: max-height 0.38s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease;
  }
  .mobile-sub-container.open { max-height: 140px; opacity: 1; }

  .mobile-sub-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255,255,255);
    text-decoration: none;
    margin-bottom: 3px;
    border-left: 2px solid rgba(39,130,40,0.35);
    transition: background 0.2s, color 0.2s, border-color 0.2s, padding-left 0.2s;
  }
  .mobile-sub-link:hover,
  .mobile-sub-link.active-mobile-sub {
    background: rgba(39,130,40,0.15);
    color: #7fff7f;
    border-color: #278228;
    padding-left: 18px;
  }
`;

const ABOUT_SUB = [
  { to: "/company/about-us", label: "About Us" },
  { to: "/company/the-team", label: "The Team" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [flipKey, setFlipKey] = useState(0);
  const [subOpen, setSubOpen] = useState(false);
  const [mobSub, setMobSub] = useState(false);
  const leaveTimer = useRef(null);

  

  const handleOpen = () => {
    const next = !open;
    setOpen(next);
    if (next) setFlipKey((k) => k + 1);
    if (!next) setMobSub(false);
  };

  const onAboutEnter = () => { clearTimeout(leaveTimer.current); setSubOpen(true); };
  const onAboutLeave = () => { leaveTimer.current = setTimeout(() => setSubOpen(false), 100); };

  const isHome = pathname === "/";
  const isBranches = pathname === "/branches";
  const isContact = pathname === "/contact";
  const isAboutSection = pathname.startsWith("/company");

  
    return (
  <>
    <style
      dangerouslySetInnerHTML={{
        __html: STYLES,
      }}
    />

    <div className="absolute top-0 left-0 w-full z-50 nav-bar-animated">
      <div className="flex items-center justify-between px-6 md:px-12 py-4">
        {/* Logo */}
        <div className="flex items-center p-2 nav-logo-animated">
          <Link href="/"><img src="/logo.svg" alt="Logo" className="w-[140px] md:w-[170px] !outline-none" /></Link>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 text-sm font-medium tracking-[1.69px] text-white items-center">
          {/* Home */}
          <li className="nav-link-item">
            <Link
              href="/"
              className={`nav-desktop-link px-3 py-1.5 rounded-[5px] uppercase block !outline-none ${
                isHome ? "active-link bg-[#278228] text-white" : "hover:text-green-400"}`}>
              Home
            </Link>
          </li>

          {/* About Us — always-mounted dropdown */}
          <li
            className="nav-link-item relative"
            onMouseEnter={onAboutEnter}
            onMouseLeave={onAboutLeave}
          >
            <Link
              href="#"
              className={`nav-desktop-link px-3 py-1.5 rounded-[5px] uppercase inline-flex items-center gap-1.5 !outline-none ${
                isAboutSection ? "active-link  text-white" : "hover:text-green-400"}`}>
              Company
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none"
                className={`about-chevron ${subOpen ? "flipped" : ""}`}>
                <path d="M2 3.5l3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.7"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            {/* Dropdown — always in DOM, CSS transition controls visibility */}
            <div
              className={`submenu-wrapper ${subOpen ? "sub-visible" : ""}`}
              onMouseEnter={onAboutEnter}
              onMouseLeave={onAboutLeave}
            >
              {ABOUT_SUB.map(({ to, label }) => (
                <Link key={to} href={to}
                  className={`submenu-item ${pathname === to ? "active-sub" : ""}`}
                  onClick={() => setSubOpen(false)}>
                  {label}
                </Link>
              ))}
            </div>
          </li>

          {/* Branches */}
          <li className="nav-link-item">
            <Link
              href="/branches"
              className={`nav-desktop-link px-3 py-1.5 rounded-[5px] uppercase block !outline-none ${
                isBranches ? "active-link bg-[#278228] text-white" : "hover:text-green-400"}`}>
              Branches
            </Link>
          </li>

          {/* Contact */}
          <li className="nav-link-item">
            <Link
              href="/contact"
              className={`nav-desktop-link px-3 py-1.5 rounded-[5px] uppercase block !outline-none ${
                isContact ? "active-link bg-[#278228] text-white" : "hover:text-green-400"}`}>
              Contact Us
            </Link>
          </li>
        </ul>

        {/* Hamburger */}
        <div onClick={handleOpen}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 cursor-pointer relative z-[60]">
          <span className="absolute w-6 h-[2px] bg-white" style={{
            transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)",
            transform: open ? "translateY(0) rotate(45deg)" : "translateY(-8px)",
          }} />
          <span className="absolute w-6 h-[2px] bg-white" style={{
            transition: "opacity 0.25s ease, transform 0.25s ease",
            opacity: open ? 0 : 1,
            transform: open ? "scaleX(0)" : "scaleX(1)",
          }} />
          <span className="absolute w-6 h-[2px] bg-white" style={{
            transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)",
            transform: open ? "translateY(0) rotate(-45deg)" : "translateY(8px)",
          }} />
        </div>
      </div>

      {/* Mobile Backdrop */}
      <div onClick={() => setOpen(false)}
        className="md:hidden fixed inset-0 bg-black/90 backdrop-blur-sm z-40 h-screen"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }} />

      {/* Mobile Drawer */}
      <div
        className="md:hidden fixed top-0 left-0 h-full w-full bg-black/95 backdrop-blur-md text-white z-50"
        style={{
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.38s cubic-bezier(0.22,1,0.36,1)",
          boxShadow: open ? "4px 0 24px rgba(0,0,0,0.4)" : "none",
        }}
      >
        <div className="px-6 pt-6 pb-4 border-b border-white/10">
          <img src="/logo.svg" alt="Logo" className="w-[140px]" />
        </div>

        <div className="mobile-links-wrap px-4 py-5">
          {/* Home */}
          <Link key={`home-${flipKey}`} href="/" onClick={() => setOpen(false)}
            className={`mobile-flip-link flip-open-1 ${isHome ? "active-mobile" : ""}`}>
            Home
          </Link>

          {/* About Us accordion */}
          <div style={{ opacity: 0, animation: "flipInLeft 0.42s cubic-bezier(0.22,1,0.36,1) 0.13s forwards" }}>
            <button
              className={`mobile-about-btn ${mobSub ? "mob-about-active" : ""}`}
              onClick={() => setMobSub((p) => !p)}>
              <span>Company</span>
              <span className={`mob-sub-arrow ${mobSub ? "rotated" : ""}`}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 5l4 4 4-4" stroke="white" strokeWidth="1.6"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>

            <div className={`mobile-sub-container ${mobSub ? "open" : ""}`}>
              {ABOUT_SUB.map(({ to, label }) => (
                <Link key={to} href={to}
                  onClick={() => { setOpen(false); setMobSub(false); }}
                  className={`mobile-sub-link ${pathname === to ? "active-mobile-sub" : ""}`}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Branches */}
          <Link key={`branches-${flipKey}`} href="/branches" onClick={() => setOpen(false)}
            className={`mobile-flip-link flip-open-3 ${isBranches ? "active-mobile" : ""}`}>
            Branches
          </Link>

          {/* Contact */}
          <Link key={`contact-${flipKey}`} href="/contact" onClick={() => setOpen(false)}
            className={`mobile-flip-link flip-open-4 ${isContact ? "active-mobile" : ""}`}>
            Contact Us
          </Link>
        </div>
      </div>
        </div>
  </>
 
  );
};

export default Navbar;
