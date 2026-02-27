import { DM_Sans, DM_Serif_Display } from "next/font/google";
import AppShell from "@/components/AppShell";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: ["400"] });

export const metadata = {
  title: "VCIntel – AI Scout",
  description: "VC intelligence interface powered by AI enrichment",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerif.variable}`}>
      <head />
      <body style={{ margin: 0, padding: 0, background: "#020817", fontFamily: "var(--font-dm-sans, 'DM Sans', system-ui, sans-serif)", color: "#e2e8f0" }}>
        <style>{`
          *, *::before, *::after { box-sizing: border-box; }
          ::-webkit-scrollbar { width: 5px; }
          ::-webkit-scrollbar-track { background: #0f172a; }
          ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
          @keyframes pulse { 0%,100%{transform:scale(0.8);opacity:0.4} 50%{transform:scale(1.2);opacity:1} }
          input::placeholder, textarea::placeholder { color: #475569; }
          select option { background: #1e293b; }
        `}</style>
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
