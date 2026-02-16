import React from "react";
import Script from "next/script";
import "../styles/App.css";
import { Providers } from "./providers";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1a1f36" />
        <meta name="description" content="Web site to rank anything" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <Script
          src="https://kit.fontawesome.com/50f8af1926.js"
          crossOrigin="anonymous" strategy="beforeInteractive"
        ></Script>
      </head>
      <body>
        <Providers>
          <div id="root">
            <Header />
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
