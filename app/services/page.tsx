import ServicesSection from "@/components/sections/services-section";
import CTASection from "@/components/sections/cta-section";

export default function ServicesPage() {
  return (
    <main className="pt-24">
      {/* Services Hero */}
      <section className="relative bg-muted py-20 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-1/2 bg-purple/5 rounded-full blur-[120px]" />
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading-1 mb-6">Our <span className="gradient-text">Services</span></h1>
            <p className="body-text text-muted-foreground">
              We offer a comprehensive range of IT services designed to meet the unique needs of your business. From network infrastructure to creative design, our expert team delivers solutions that drive growth and efficiency.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <ServicesSection 
        title="Comprehensive IT Solutions"
        subtitle="Explore our range of services tailored to meet the technology needs of modern businesses."
        showAll={true}
      />

      {/* CTA */}
      <CTASection />
    </main>
  );
}