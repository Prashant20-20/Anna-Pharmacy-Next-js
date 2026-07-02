const Footer = () => {
  return (
    <>
      {/* ━━ FOOTER ━━ */}
      <footer className="bg-black py-10 md:py-16 flex flex-col items-center">
        {/* APG Logo SVG — exact match to screenshot */}
        <div className="mb-4">
          <img
            src="/footer-logo.svg"
            alt="Logo"
            className="w-[150px] md:w-[190px]"
          />
        </div>

        {/* Green divider line */}
        <div className="w-10 h-px mb-8" style={{ backgroundColor: "#22c55e" }} />

        {/* Copyright */}
        <p className="text-white text-sm tracking-wide text-center leading-8">
          © 2026 Anna Pharmacy. All rights reserved. <br className="md:hidden" />Created by{" "}
          <a
            href="https://haartyhanks.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-green-500"
          >
            Haarty Hanks
          </a>
        </p>
      </footer>
    </>
  );
};

export default Footer;
