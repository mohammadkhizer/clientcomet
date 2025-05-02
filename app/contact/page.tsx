import Image from "next/image";
import { SectionHeading } from "@/components/ui/section-heading";
import ContactForm from "@/components/forms/contact-form";
import { CONTACT_INFO } from "@/lib/constants";
import { Mail, Phone, Clock, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="pt-24">
      {/* Contact Hero */}
      <section className="relative bg-muted py-20 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-1/2 bg-purple/5 rounded-full blur-[120px]" />
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading-1 mb-6">Get in <span className="gradient-text">Touch</span></h1>
            <p className="body-text text-muted-foreground">
              Have a question or want to discuss a project? We'd love to hear from you. Fill out the form below and our team will get back to you promptly.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-card p-8 rounded-xl shadow-md">
              <SectionHeading
                title="Send us a Message"
                subtitle="Fill out the form below and we'll get back to you as soon as possible."
              />
              <ContactForm />
            </div>

            {/* Contact Info */}
            <div>
              <SectionHeading
                title="Contact Information"
                subtitle="Here's how you can reach us directly."
              />

              <div className="space-y-8 mt-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Our Location</h3>
                    <p className="text-muted-foreground">{CONTACT_INFO.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Email Us</h3>
                    <a 
                      href={`mailto:${CONTACT_INFO.email}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {CONTACT_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Call Us</h3>
                    <a 
                      href={`tel:${CONTACT_INFO.phone}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {CONTACT_INFO.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Business Hours</h3>
                    <p className="text-muted-foreground">{CONTACT_INFO.hours}</p>
                  </div>
                </div>
              </div>

              {/* Map Image */}
              <div className="mt-12 relative h-[300px] rounded-xl overflow-hidden">
                <Image
                  src="https://images.pexels.com/photos/4386442/pexels-photo-4386442.jpeg"
                  alt="Office Location Map"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}