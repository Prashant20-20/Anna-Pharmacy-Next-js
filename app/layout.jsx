import "./globals.css";
import Navbar from "../components/Navbar";
import ConditionalFooter from "../components/ConditionalFooter";
import PageTransition from "../components/PageTransition";
import ScrollProgress from "../components/ScrollProgress";

export const metadata = {
  title: "Anna Pharmacy Group",
  description:
    "Anna Pharmacy Group is a growing network of community pharmacies dedicated to making expert, accessible healthcare available to patients across London and the South East.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
        <link rel="preload" as="image" href="/images/5.jpg" fetchPriority="high" />
      </head>
      <body className="font-sans">
        <ScrollProgress />
        <Navbar />
        <PageTransition>{children}</PageTransition>
        <ConditionalFooter />
      </body>
    </html>
  );
}
