import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chat & Video App",
  description: "Real-time chat and video calling application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}