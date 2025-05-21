
import type { Metadata } from 'next';
import { FadeIn } from '@/components/motion/fade-in';
import { getTeamMembers } from '@/services/teamService';
import type { TeamMember } from '@/types';
import { Loader2, Users as TeamIcon } from 'lucide-react';
import { TeamMemberCard } from '@/components/team/TeamMemberCard';
import { Skeleton } from '@/components/ui/skeleton';

const TeamPageSkeleton = () => (
  <div className="container mx-auto section-padding">
    <FadeIn>
      <section className="text-center mb-16">
        <Skeleton className="h-16 w-16 rounded-full mx-auto mb-6" />
        <Skeleton className="h-12 w-1/2 md:w-1/3 mx-auto mb-4" />
        <Skeleton className="h-6 w-3/4 md:w-2/3 mx-auto" />
      </section>
    </FadeIn>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {[...Array(4)].map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  </div>
);

const CardSkeleton = () => (
  <div className="bg-card rounded-lg shadow-lg overflow-hidden">
    <Skeleton className="w-full h-64" />
    <div className="p-6 text-center">
      <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
      <Skeleton className="h-4 w-1/2 mx-auto mb-4 text-primary" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-5/6 mb-4" />
      <div className="flex justify-center space-x-3">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  </div>
);


export default async function TeamPage() {
  let teamMembers: TeamMember[] = [];
  let isLoading = true;

  try {
    teamMembers = await getTeamMembers();
    isLoading = false;
  } catch (error) {
    console.error("Failed to fetch team members:", error);
    isLoading = false;
  }

  if (isLoading) {
    return <TeamPageSkeleton />;
  }

  return (
    <div className="container mx-auto section-padding">
      <FadeIn>
        <section className="text-center mb-16">
          <TeamIcon className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="section-title inline-block">Meet Our Team</h1>
          <p className="text-xl text-muted-foreground mt-4 max-w-3xl mx-auto text-balance">
            The driving force behind ByteBrusters. A collective of creative minds, strategic thinkers, and tech wizards dedicated to your success.
          </p>
        </section>
      </FadeIn>

      {teamMembers.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <FadeIn key={member.id} delay={index * 100}>
              <TeamMemberCard member={member} />
            </FadeIn>
          ))}
        </div>
      ) : (
        <FadeIn>
          <p className="text-center text-muted-foreground text-lg py-12">
            Our team information is currently being updated. Please check back soon!
          </p>
        </FadeIn>
      )}
    </div>
  );
}
