import Navbar from "@/components/Navbar";
import HeroNetwork from "@/components/HeroNetwork";
import Features from "@/components/Features";
import Investors from "@/components/Investors";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function Home() {
  return (
    <main className="bg-[var(--bg-0)] text-[var(--text-0)]">
      <Navbar />
      <HeroNetwork />
      <Features />
      <Investors />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
