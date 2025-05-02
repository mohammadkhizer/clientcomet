"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { TESTIMONIALS } from "@/lib/constants";

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section ref={ref} className="section-padding bg-muted">
      <div className="container">
        <SectionHeading
          title="Client Testimonials"
          subtitle="Hear what our clients have to say about our services and solutions."
          centered={true}
        />

        <motion.div
          className="max-w-4xl mx-auto relative"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Quote icon */}
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/4 opacity-10">
            <Quote className="h-32 w-32 text-primary" />
          </div>

          {/* Testimonials */}
          <div className="relative min-h-[300px]">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="absolute w-full"
                initial={{ opacity: 0, x: 100 }}
                animate={{
                  opacity: activeIndex === index ? 1 : 0,
                  x: activeIndex === index ? 0 : 100,
                  zIndex: activeIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6 relative">
                    <div className="w-20 h-20 rounded-full overflow-hidden">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1">
                      <Quote className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                  <p className="text-lg md:text-xl italic mb-6">"{testimonial.content}"</p>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-muted-foreground">{testimonial.company}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  activeIndex === index ? "bg-primary w-6" : "bg-primary/30"
                }`}
                onClick={() => handleDotClick(index)}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}