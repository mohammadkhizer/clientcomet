
"use client";

import type { TeamMember } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Linkedin, Github, Twitter, FileText } from 'lucide-react';

interface TeamMemberCardProps {
  member: TeamMember;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <Card className="text-center overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col bg-card">
      <Image
        src={member.imageUrl}
        alt={`Portrait of ${member.name}, ${member.role} at ByteBrusters`}
        width={400}
        height={400}
        data-ai-hint={member.dataAiHint || 'person avatar'}
        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <CardHeader>
        <CardTitle className="text-xl text-card-foreground">{member.name}</CardTitle>
        <p className="text-sm text-muted-foreground font-medium">{member.role}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-4 text-balance">{member.bio}</p>
        <div className="flex justify-center space-x-3">
          {member.socials?.linkedin && (
            <Link href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s LinkedIn Profile`}>
              <Button variant="outline" size="icon" className="hover:bg-primary/10 border-border">
                <Linkedin className="h-5 w-5 text-primary" />
                <span className="sr-only">LinkedIn</span>
              </Button>
            </Link>
          )}
          {member.socials?.github && (
            <Link href={member.socials.github} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s GitHub Profile`}>
              <Button variant="outline" size="icon" className="hover:bg-accent/10 border-border">
                <Github className="h-5 w-5 text-foreground/80" />
                 <span className="sr-only">GitHub</span>
              </Button>
            </Link>
          )}
          {member.socials?.twitter && (
            <Link href={member.socials.twitter} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s Twitter Profile`}>
              <Button variant="outline" size="icon" className="hover:bg-sky-400/10 border-border">
                <Twitter className="h-5 w-5 text-sky-500" />
                 <span className="sr-only">Twitter</span>
              </Button>
            </Link>
          )}
          {member.socials?.cvUrl && (
            <Link href={member.socials.cvUrl} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s CV/Resume`}>
              <Button variant="outline" size="icon" className="hover:bg-green-400/10 border-border">
                <FileText className="h-5 w-5 text-green-500" />
                 <span className="sr-only">CV/Resume</span>
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
    
