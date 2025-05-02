"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Gradient Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-purple/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-brown/5 rounded-full blur-[120px]" />
      </div>

      <div className="container">
        <motion.div
          className="max-w-4xl mx-auto"
          variants={container}
          initial="hidden"
          animate={isVisible ? "show" : "hidden"}
        >
          <motion.h1 
            className="heading-1 mb-6 text-center"
            variants={item}
          >
            Empowering Business Growth Through <span className="gradient-text">Innovative IT Solutions</span>
          </motion.h1>
          
          <motion.p 
            className="body-text text-center text-muted-foreground mb-10"
            variants={item}
          >
            Client Comet delivers premium IT services tailored to meet your specific business needs. From network infrastructure to web applications, we provide comprehensive solutions for businesses of all sizes.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
            variants={item}
          >
            <Button asChild size="lg" className="text-base">
              <Link href="/services">
                Explore Services <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base">
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
            variants={item}
          >
            {[
              { value: "15+", label: "Years Experience" },
              { value: "500+", label: "Projects Completed" },
              { value: "50+", label: "Team Members" },
              { value: "99%", label: "Client Satisfaction" },
            ].map((stat, index) => (
              <div key={index} className="p-4 rounded-xl bg-card">
                <h3 className="gradient-text text-3xl md:text-4xl font-bold mb-1">{stat.value}</h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}