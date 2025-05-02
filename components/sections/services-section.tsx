"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { ArrowRight, Network, Globe, Smartphone, Computer, Palette, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { SERVICES } from "@/lib/constants";
import { Service } from "@/lib/types";
import { cn } from "@/lib/utils";

const icons = {
  Network,
  Globe,
  Smartphone,
  Computer,
  Palette,
  Video
};

export default function ServicesSection({ 
  title = "Our Services",
  subtitle = "We offer a comprehensive range of IT services to meet all your technology needs.",
  showAll = false,
  limit = 6
}: { 
  title?: string;
  subtitle?: string;
  showAll?: boolean;
  limit?: number;
}) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const displayServices = showAll ? SERVICES : SERVICES.slice(0, limit);

  return (
    <section ref={ref} className="section-padding">
      <div className="container">
        <SectionHeading
          title={title}
          subtitle={subtitle}
          centered={true}
        />

        <motion.div 
          className="grid-layout"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
        >
          {displayServices.map((service, index) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              index={index} 
              inView={inView} 
            />
          ))}
        </motion.div>

        {!showAll && (
          <div className="mt-12 text-center">
            <Button asChild>
              <Link href="/services">
                View All Services <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

function ServiceCard({ 
  service, 
  index, 
  inView 
}: { 
  service: Service; 
  index: number; 
  inView: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = icons[service.icon as keyof typeof icons];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "group relative overflow-hidden rounded-xl bg-card shadow-md transition-all duration-300 hover:shadow-lg",
        isHovered ? "translate-y-[-8px]" : ""
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/services/${service.id}`} className="block p-6">
        <div className="mb-4 p-3 rounded-full w-14 h-14 flex items-center justify-center bg-primary/10">
          {IconComponent && <IconComponent className="h-7 w-7 text-primary" />}
        </div>
        <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
        <p className="text-muted-foreground mb-4">{service.description}</p>
        
        <div className="mt-4 flex items-center text-primary font-medium">
          Learn more <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
        </div>
      </Link>
    </motion.div>
  );
}