import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import Marquee from "@/components/Marquee";

const bricolageGrotesque = Bricolage_Grotesque({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${bricolageGrotesque.className} h-screen`}>
        {children}
      </body>
    </html>
  );
}
