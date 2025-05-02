"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import Link from "next/link";
import { SERVICES } from "@/lib/constants";
import { Service } from "@/lib/types";
import ContactForm from "@/components/forms/contact-form";

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const fetchService = async () => {
      try {
        // Find service by ID
        const foundService = SERVICES.find(s => s.id === id);
        
        if (foundService) {
          setService(foundService);
        }
      } catch (error) {
        console.error("Error fetching service:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-60 bg-muted rounded mb-4"></div>
          <div className="h-4 w-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="pt-24 min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="heading-2 mb-4">Service Not Found</h1>
        <p className="body-text text-muted-foreground mb-8">The service you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/services">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Services
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <main className="pt-24">
      {/* Service Hero */}
      <section className="relative bg-muted py-20 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-1/2 bg-purple/5 rounded-full blur-[120px]" />
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <Button variant="ghost" asChild className="mb-6">
              <Link href="/services">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Services
              </Link>
            </Button>
            <h1 className="heading-1 mb-6">{service.title}</h1>
            <p className="body-text text-muted-foreground">
              {service.description}
            </p>
          </div>
        </div>
      </section>

      {/* Service Features */}
      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Column */}
            <div>
              <SectionHeading
                title="Key Features"
                subtitle="Our comprehensive approach ensures your needs are fully met."
              />

              <div className="space-y-6 mt-8">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="mt-1 text-primary">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">{feature}</h3>
                      <p className="text-muted-foreground">
                        Our team of experts ensures that {feature.toLowerCase()} is implemented with the highest standards of quality and efficiency.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="bg-card p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-6">Interested in this service?</h3>
              <p className="text-muted-foreground mb-6">
                Fill out the form below and our team will get back to you with more information about our {service.title.toLowerCase()} services.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-muted">
        <div className="container">
          <SectionHeading
            title="Our Process"
            subtitle={`How we deliver exceptional ${service.title} services.`}
            centered={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
            {[
              {
                title: "Consultation",
                description: "We begin with a detailed discussion to understand your specific needs and objectives."
              },
              {
                title: "Planning",
                description: "Our team develops a comprehensive plan tailored to your requirements."
              },
              {
                title: "Implementation",
                description: "We execute the plan with precision, keeping you informed at every step."
              },
              {
                title: "Support",
                description: "We provide ongoing support to ensure optimal performance and satisfaction."
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="section-padding">
        <div className="container">
          <SectionHeading
            title="Related Services"
            subtitle="Explore other services that complement our offerings."
            centered={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SERVICES.filter(s => s.id !== service.id)
              .slice(0, 3)
              .map((relatedService) => (
                <div key={relatedService.id} className="bg-card p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-3">{relatedService.title}</h3>
                  <p className="text-muted-foreground mb-4">{relatedService.description}</p>
                  <Button asChild variant="outline">
                    <Link href={`/services/${relatedService.id}`}>
                      Learn More
                    </Link>
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}