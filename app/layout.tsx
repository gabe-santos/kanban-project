import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import Marquee from "@/components/Marquee";
import { Toaster } from "@/components/ui/toaster";

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
        <Toaster />
      </body>
    </html>
  );
}
