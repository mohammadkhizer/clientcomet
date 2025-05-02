import TeamSection from "@/components/sections/team-section";
import CTASection from "@/components/sections/cta-section";

export default function TeamPage() {
  return (
    <main className="pt-24">
      {/* Team Hero */}
      <section className="relative bg-muted py-20 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-1/2 bg-purple/5 rounded-full blur-[120px]" />
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading-1 mb-6">Our <span className="gradient-text">Team</span></h1>
            <p className="body-text text-muted-foreground">
              Meet the talented professionals behind Client Comet. Our diverse team combines expertise, passion, and innovation to deliver exceptional IT solutions for our clients.
            </p>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <TeamSection 
        title="Meet Our Experts"
        subtitle="Our team of talented professionals is dedicated to delivering excellence in every project."
        showAll={true}
      />

      {/* Join Our Team */}
      <section className="section-padding bg-muted">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-2 mb-6">Join Our Team</h2>
            <p className="body-text text-muted-foreground mb-8">
              We're always looking for talented individuals to join our growing team. If you're passionate about technology and innovation, we'd love to hear from you.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {[
                {
                  title: "Collaborative Environment",
                  description: "Work with talented professionals in a supportive and collaborative environment."
                },
                {
                  title: "Professional Growth",
                  description: "Continuous learning opportunities and career advancement paths."
                },
                {
                  title: "Work-Life Balance",
                  description: "Flexible work arrangements and a culture that values well-being."
                }
              ].map((benefit, index) => (
                <div key={index} className="bg-card p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </main>
  );
}