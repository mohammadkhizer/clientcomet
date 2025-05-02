import ProjectsSection from "@/components/sections/projects-section";
import CTASection from "@/components/sections/cta-section";

export default function ProjectsPage() {
  return (
    <main className="pt-24">
      {/* Projects Hero */}
      <section className="relative bg-muted py-20 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-1/2 bg-purple/5 rounded-full blur-[120px]" />
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading-1 mb-6">Our <span className="gradient-text">Projects</span></h1>
            <p className="body-text text-muted-foreground">
              Explore our portfolio of successful projects delivered for clients across various industries. Each project demonstrates our commitment to excellence, innovation, and client satisfaction.
            </p>
          </div>
        </div>
      </section>

      {/* Projects List */}
      <ProjectsSection 
        title="Recent Work"
        subtitle="Browse through our diverse range of projects spanning different industries and technologies."
        showAll={true}
      />

      {/* CTA */}
      <CTASection />
    </main>
  );
}