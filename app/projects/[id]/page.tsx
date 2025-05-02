"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, CalendarDays, User, Tag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import Link from "next/link";
import { PROJECTS } from "@/lib/constants";
import { Project } from "@/lib/types";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const fetchProject = async () => {
      try {
        // Find project by ID
        const foundProject = PROJECTS.find(p => p.id === id);
        
        if (foundProject) {
          // Add additional mock data for the project detail page
          const extendedProject = {
            ...foundProject,
            content: "This project involved a comprehensive redesign and implementation of the client's technology infrastructure. Our team worked closely with the client to understand their specific needs and challenges, developing a tailored solution that addressed their unique requirements. The project was completed on time and within budget, resulting in significant improvements in efficiency and performance.",
            clientName: "Acme Corporation",
            completionDate: "March 2025",
          };
          
          setProject(extendedProject);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
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

  if (!project) {
    return (
      <div className="pt-24 min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="heading-2 mb-4">Project Not Found</h1>
        <p className="body-text text-muted-foreground mb-8">The project you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <main className="pt-24">
      {/* Project Hero */}
      <section className="relative py-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-full h-full">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover opacity-10"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
          </div>
        </div>
        
        <div className="container">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
            </Link>
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary mb-4">
                {project.category}
              </span>
              <h1 className="heading-1 mb-6">{project.title}</h1>
              <p className="body-text text-muted-foreground mb-8">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">Client: {project.clientName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">Completed: {project.completionDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">Category: {project.category}</span>
                </div>
              </div>
            </div>
            
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <SectionHeading
                title="Project Overview"
                subtitle="A detailed look at the challenges, solutions, and outcomes of this project."
              />
              
              <div className="space-y-6 mt-8">
                <p>{project.content}</p>
                <p>
                  Our approach included thorough planning, close collaboration with the client, and regular updates throughout the implementation phase. We addressed all challenges promptly and effectively, ensuring a smooth transition to the new system.
                </p>
                <p>
                  The final solution not only met but exceeded the client's expectations, providing them with a robust, scalable, and efficient infrastructure that supports their business operations and growth objectives.
                </p>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-xl shadow-md h-fit">
              <h3 className="text-xl font-semibold mb-4">Technologies Used</h3>
              <div className="space-y-3">
                {project.technologies.map((tech, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary" />
                    <span>{tech}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Key Results</h3>
                <div className="space-y-3">
                  {[
                    "50% increase in system efficiency",
                    "Reduced downtime by 90%",
                    "Improved security posture",
                    "Enhanced user experience",
                    "Scalable solution for future growth"
                  ].map((result, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary" />
                      <span>{result}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      <section className="section-padding bg-muted">
        <div className="container">
          <SectionHeading
            title="Related Projects"
            subtitle="Explore other projects in our portfolio."
            centered={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROJECTS.filter(p => p.id !== project.id && p.category === project.category)
              .slice(0, 3)
              .map((relatedProject) => (
                <div key={relatedProject.id} className="bg-card rounded-xl overflow-hidden shadow-md">
                  <div className="relative h-48">
                    <Image
                      src={relatedProject.image}
                      alt={relatedProject.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{relatedProject.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{relatedProject.description}</p>
                    <Button asChild>
                      <Link href={`/projects/${relatedProject.id}`}>
                        View Project
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-2 mb-6">Interested in a Similar Project?</h2>
            <p className="body-text text-muted-foreground mb-8">
              Let's discuss how we can help you achieve your business objectives with our expertise and solutions.
            </p>
            <Button asChild size="lg">
              <Link href="/contact">
                Get in Touch
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}