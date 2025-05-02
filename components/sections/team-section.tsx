"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { TEAM_MEMBERS } from "@/lib/constants";
import { TeamMember } from "@/lib/types";

export default function TeamSection({
  title = "Our Team",
  subtitle = "Meet our team of experts dedicated to delivering exceptional IT solutions.",
  showAll = false,
  limit = 4
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

  const displayMembers = showAll ? TEAM_MEMBERS : TEAM_MEMBERS.slice(0, limit);

  return (
    <section ref={ref} className="section-padding bg-muted/50">
      <div className="container">
        <SectionHeading
          title={title}
          subtitle={subtitle}
          centered={true}
        />

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {displayMembers.map((member, index) => (
            <TeamMemberCard 
              key={member.id} 
              member={member} 
              index={index} 
              inView={inView} 
            />
          ))}
        </motion.div>

        {!showAll && (
          <div className="mt-12 text-center">
            <Button asChild>
              <Link href="/team">
                View All Team <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

function TeamMemberCard({ 
  member, 
  index, 
  inView 
}: { 
  member: TeamMember; 
  index: number; 
  inView: boolean; 
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative rounded-xl overflow-hidden bg-card shadow-md transition-all duration-300 hover:shadow-lg group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-80 overflow-hidden">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover transition-transform duration-500"
          style={{
            transform: isHovered ? "scale(1.05)" : "scale(1)",
          }}
        />
        
        {/* Overlay with social links */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center p-6 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0.2,
          }}
        >
          <div className="flex gap-3 mb-16">
            {member.social.map((social, i) => (
              <a
                key={i}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-primary transition-colors duration-200"
                aria-label={`Visit ${member.name}'s social profile`}
              >
                <social.icon className="h-5 w-5 text-white" />
              </a>
            ))}
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full p-6 bg-card/80 backdrop-blur-sm transition-transform duration-300">
        <h3 className="text-xl font-semibold">{member.name}</h3>
        <p className="text-primary">{member.role}</p>
      </div>
    </motion.div>
  );
}