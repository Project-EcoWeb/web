import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { ImpactStats } from "@/components/impact-stats";
import { SolutionsSection } from "@/components/soluctions-section";
import { Footer } from "@/components/footer";
export default function Home() {
  return (
    <div className='min-h-screen'>
      <Header />
      <HeroSection />
      <ImpactStats />
      <SolutionsSection />
      <Footer />
    </div>
  );
}
