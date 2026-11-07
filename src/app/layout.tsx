import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { NotesProvider } from "@/components/ui";
import { Navbar, Footer } from "@/components/Navbar";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trust Pass — Digital Service Passport",
  description: "A portable Digital Service Passport for transparent repair and maintenance in Bangladesh.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} font-sans antialiased`}>
        <StoreProvider>
          <NotesProvider>
            <Navbar />
            <main className="min-h-[60vh]">{children}</main>
            <Footer />
          </NotesProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
