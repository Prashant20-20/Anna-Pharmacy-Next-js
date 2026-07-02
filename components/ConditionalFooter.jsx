"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

const ConditionalFooter = () => {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <Footer />;
};

export default ConditionalFooter;
