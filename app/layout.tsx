import { Bricolage_Grotesque } from "next/font/google";
// import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ReactQueryClientProvider } from "@/components/providers/ReactQueryClientProvider";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  fallback: ["system-ui"],
  display: "swap",
  adjustFontFallback: false,
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryClientProvider>
      <html lang="en">
        <body
          className={`${bricolageGrotesque.className} h-screen bg-[#e7e5e4]`}
        >
          {children}
          <Toaster />
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
