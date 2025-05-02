import HeroSection from "@/components/sections/hero-section";
import ServicesSection from "@/components/sections/services-section";
import ProjectsSection from "@/components/sections/projects-section";
import TeamSection from "@/components/sections/team-section";
import TestimonialsSection from "@/components/sections/testimonials-section";
import CTASection from "@/components/sections/cta-section";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ServicesSection />
      <ProjectsSection />
      <TeamSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}