import Image from "next/image";
import { ArrowRight, CheckCircle } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="pt-24">
      {/* Hero Section */}
      <section className="relative bg-muted py-20 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-1/2 bg-purple/5 rounded-full blur-[120px]" />
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading-1 mb-6">About <span className="gradient-text">Client Comet</span></h1>
            <p className="body-text text-muted-foreground">
              We are a team of dedicated IT professionals committed to delivering innovative solutions that drive business growth and efficiency. With years of experience and expertise, we help businesses of all sizes leverage technology to reach their full potential.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeading 
                title="Our Story"
                subtitle="Founded in 2010, Client Comet began with a simple mission: to make premium IT services accessible to businesses of all sizes."
              />
              <p className="mb-6">
                What started as a small team of passionate tech enthusiasts has grown into a full-service IT agency with expertise across multiple domains. Throughout our journey, we've maintained our commitment to quality, innovation, and client success.
              </p>
              <p className="mb-6">
                Today, we serve clients across various industries, from startups to established enterprises, helping them navigate the ever-evolving technology landscape and achieve their business objectives through strategic IT solutions.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>15+ Years Experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>500+ Projects Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>100+ Happy Clients</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-[500px] rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg"
                  alt="Our team at work"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 p-6 bg-card rounded-xl shadow-lg max-w-xs">
                <h3 className="text-xl font-semibold mb-2 gradient-text">Our Mission</h3>
                <p className="text-muted-foreground">
                  To empower businesses through innovative technology solutions that drive growth, efficiency, and competitive advantage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding bg-muted">
        <div className="container">
          <SectionHeading
            title="Our Values"
            subtitle="These core principles guide everything we do at Client Comet."
            centered={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Excellence",
                description: "We are committed to delivering the highest quality in everything we do, from the solutions we create to the service we provide.",
                icon: "🏆"
              },
              {
                title: "Innovation",
                description: "We continuously explore new technologies and approaches to solve complex problems and create value for our clients.",
                icon: "💡"
              },
              {
                title: "Integrity",
                description: "We operate with honesty, transparency, and ethical standards in all our interactions and business practices.",
                icon: "🤝"
              },
              {
                title: "Client Focus",
                description: "We put our clients' needs first, building lasting relationships through responsive service and tailored solutions.",
                icon: "👥"
              },
              {
                title: "Collaboration",
                description: "We believe in the power of teamwork, both within our organization and in partnership with our clients.",
                icon: "🔄"
              },
              {
                title: "Continuous Learning",
                description: "We invest in ongoing education and skill development to stay at the forefront of technology trends.",
                icon: "📚"
              }
            ].map((value, index) => (
              <div key={index} className="bg-card p-6 rounded-xl shadow-md">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="section-padding">
        <div className="container">
          <SectionHeading
            title="Our Approach"
            subtitle="We follow a proven methodology to ensure successful outcomes for every project."
            centered={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Discovery",
                description: "We start by understanding your business goals, challenges, and requirements through in-depth consultations."
              },
              {
                step: "02",
                title: "Strategy",
                description: "Based on our findings, we develop a comprehensive strategy and roadmap tailored to your specific needs."
              },
              {
                step: "03",
                title: "Implementation",
                description: "Our expert team executes the plan with precision, keeping you informed throughout the process."
              },
              {
                step: "04",
                title: "Support",
                description: "We provide ongoing support and optimization to ensure your solution continues to perform optimally."
              }
            ].map((phase, index) => (
              <div key={index} className="relative">
                <div className="mb-4 text-6xl font-bold text-primary/10">{phase.step}</div>
                <h3 className="text-xl font-semibold mb-3">{phase.title}</h3>
                <p className="text-muted-foreground">{phase.description}</p>
                {index < 3 && (
                  <ArrowRight className="hidden md:block absolute top-10 -right-4 h-8 w-8 text-muted-foreground/20" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-card">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-2 mb-6">Ready to Work With Us?</h2>
            <p className="body-text text-muted-foreground mb-8">
              Join our growing list of satisfied clients and experience the Client Comet difference. Let's discuss how we can help your business thrive.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/contact">
                  Get in Touch
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/services">
                  Our Services
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}