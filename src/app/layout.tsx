import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Neuro-Nest | AI-Powered Career Synthesis",
  description: "Accelerate your career trajectory with personalized neural mastery maps engineered by Gemini 2.5 Flash.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children?: any;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-background text-foreground antialiased selection:bg-primary/20`}>
        <AuthProvider>
          <div className="relative min-h-screen">
            {/* Ambient Neural Gradients */}
            <div className="fixed inset-0 pointer-events-none z-0">
              <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[160px] animate-pulse-slow" />
              <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary/5 blur-[160px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,245,255,0.02)_0%,transparent_70%)]" />
            </div>
            
            <main className="relative z-10">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
