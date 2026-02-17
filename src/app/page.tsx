import Navbar from "@/components/Navbar";
import HeroNetwork from "@/components/HeroNetwork";
import Features from "@/components/Features";
import Investors from "@/components/Investors";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function Home() {
  return (
    <main className="bg-slate-950">
      <Navbar />
      <HeroNetwork />
      <Features />
      <Investors />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
