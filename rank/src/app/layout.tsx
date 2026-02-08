import React from "react";
import Script from "next/script";
import "../styles/App.css";
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#160f29" />
        <meta name="description" content="Web site to rank anything" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <Script
          src="https://kit.fontawesome.com/50f8af1926.js"
          crossOrigin="anonymous" strategy="beforeInteractive"
        ></Script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Open+Sans&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Slab&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <div id="root">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
