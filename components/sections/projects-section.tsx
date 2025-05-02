"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { PROJECTS } from "@/lib/constants";
import { Project } from "@/lib/types";

export default function ProjectsSection({
  title = "Our Projects",
  subtitle = "Explore our portfolio of successful projects delivered with excellence and innovation.",
  showAll = false,
  limit = 3
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

  const [activeFilter, setActiveFilter] = useState("All");
  
  // Get unique categories
  const categories = ["All", ...Array.from(new Set(PROJECTS.map(project => project.category)))];
  
  // Filter projects
  const filteredProjects = activeFilter === "All" 
    ? PROJECTS 
    : PROJECTS.filter(project => project.category === activeFilter);
    
  // Limit projects if needed
  const displayProjects = showAll 
    ? filteredProjects 
    : filteredProjects.slice(0, limit);

  return (
    <section ref={ref} className="section-padding">
      <div className="container">
        <SectionHeading
          title={title}
          subtitle={subtitle}
          centered={true}
        />

        {showAll && (
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeFilter === category ? "default" : "outline"}
                className="mb-2"
                onClick={() => setActiveFilter(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {displayProjects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={index} 
              inView={inView} 
            />
          ))}
        </motion.div>

        {!showAll && displayProjects.length > 0 && (
          <div className="mt-12 text-center">
            <Button asChild>
              <Link href="/projects">
                View All Projects <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ 
  project, 
  index, 
  inView 
}: { 
  project: Project; 
  index: number; 
  inView: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group rounded-xl overflow-hidden bg-card shadow-md transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/projects/${project.id}`}>
        <div className="relative h-64 overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className={`object-cover transition-transform duration-500 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60" />
          <div className="absolute bottom-0 left-0 p-6">
            <span className="inline-block px-3 py-1 text-sm rounded-full bg-primary/90 text-primary-foreground mb-3">
              {project.category}
            </span>
            <h3 className="text-xl font-semibold text-white">{project.title}</h3>
          </div>
        </div>
        <div className="p-6">
          <p className="text-muted-foreground mb-4">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech, i) => (
              <span 
                key={i} 
                className="px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
          <div className="flex items-center text-primary font-medium">
            View Details <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}