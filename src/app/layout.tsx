import type { Metadata } from "next";
import { Inter, Kanit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"], // Adjust subsets as needed
  weight: ["400", "600"], // Optional: Specify weights
  variable: "--font-inter", // Adds a CSS variable
});

const kanit = Kanit({
  subsets: ["latin"], // Specify subsets as needed
  weight: ["300", "400", "500", "700"], // Specify font weights (e.g., Regular and Bold)
  variable: "--font-kanit", // Define a CSS variable for the font
});

export const metadata: Metadata = {
  title: "Web3 Crowdfunding Platform",
  description:
    "Using blockchain and smart contracts to facilitate smooth and secure transactions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${kanit.variable}`}>
      <body className="bg-black-100 font-sans text-white">
        <ThirdwebProvider>
          <Navbar />
          {children}
        </ThirdwebProvider>
      </body>
    </html>
  );
}
