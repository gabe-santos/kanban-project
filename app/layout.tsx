import { Bricolage_Grotesque } from "next/font/google";
// import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const bricolageGrotesque = Bricolage_Grotesque({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${bricolageGrotesque.className} h-screen bg-[#e7e5e4]`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
