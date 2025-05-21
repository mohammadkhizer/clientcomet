
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Loader2, Users, Briefcase, Award } from 'lucide-react';
import { FadeIn } from '@/components/motion/fade-in';
import Image from 'next/image';
import { getServices } from '@/services/serviceService';
import { getIconComponent } from '@/lib/iconUtils';
import { getProjects } from '@/services/projectService';
import type { Service, Project, HomePageContent, SiteKeyStats, KeyStatsData } from '@/types';
import { getHomePageContent } from '@/services/homePageContentService';
import { getKeyStats } from '@/services/siteKeyStatsService';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatedStatItem } from '@/components/home/AnimatedStatItem'; // Updated import if filename changed

const KeyStatsSectionSkeleton = () => (
  <section className="section-padding bg-primary/5">
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row justify-around items-center gap-8 py-8">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex flex-col items-center text-center p-4">
            <Skeleton className="h-16 w-16 rounded-full mb-4"/>
            <Skeleton className="h-12 w-20 mx-auto mb-2"/>
            <Skeleton className="h-6 w-32 mx-auto"/>
          </div>
        ))}
      </div>
    </div>
  </section>
);


const HomePageContentSkeleton = () => (
  <>
    {/* Hero Section Skeleton */}
    <FadeIn>
      <section className="section-padding bg-gradient-to-br from-background to-muted/30 text-center">
        <div className="container mx-auto">
          <Skeleton className="h-12 w-3/4 md:h-16 lg:h-20 mx-auto mb-6" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto mb-10" />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Skeleton className="h-12 w-36" />
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
      </section>
    </FadeIn>

    {/* Featured Services Section Skeleton */}
    <FadeIn>
      <section className="section-padding">
        <div className="container mx-auto">
          <Skeleton className="h-10 w-1/2 md:w-1/3 mx-auto mb-4" />
          <Skeleton className="h-5 w-3/4 md:w-1/2 mx-auto mb-12" />
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="text-center h-full">
                <CardHeader><div className="mx-auto bg-muted rounded-full p-4 w-20 h-20 mb-4 flex items-center justify-center"><Skeleton className="h-10 w-10 rounded-full"/></div><Skeleton className="h-6 w-3/4 mx-auto" /></CardHeader>
                <CardContent><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6 mt-2" /></CardContent>
                 <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12"><Skeleton className="h-8 w-48 mx-auto" /></div>
        </div>
      </section>
    </FadeIn>
    
    {/* Why Choose Us Section Skeleton */}
     <FadeIn>
        <section className="section-padding bg-muted">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Skeleton className="h-10 w-1/2 md:w-1/3 mb-4" />
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-5 w-5/6 mb-6" />
                <ul className="space-y-4 mb-8">
                  {[...Array(4)].map((_,i) => <li key={i} className="flex items-start"><Skeleton className="h-6 w-6 rounded-full mr-3 mt-1 shrink-0" /><Skeleton className="h-5 w-3/4" /></li>)}
                </ul>
                <Skeleton className="h-12 w-40" />
              </div>
              <div className="hidden lg:block relative aspect-square">
                 <Skeleton className="rounded-lg object-cover shadow-xl w-full h-full" />
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

    <KeyStatsSectionSkeleton />

    {/* Featured Projects Section Skeleton */}
    <FadeIn>
        <section className="section-padding">
            <div className="container mx-auto">
                <Skeleton className="h-10 w-1/2 md:w-1/3 mx-auto mb-4" />
                <Skeleton className="h-5 w-3/4 md:w-1/2 mx-auto mb-12" />
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(3)].map((_, index) => (
                        <Card key={index} className="overflow-hidden h-full">
                            <Skeleton className="w-full h-48" />
                            <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                            <CardContent><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6 mt-2" /></CardContent>
                            <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
                        </Card>
                    ))}
                </div>
                <div className="text-center mt-12"><Skeleton className="h-8 w-48 mx-auto" /></div>
            </div>
        </section>
    </FadeIn>
    
    {/* Final CTA Skeleton */}
    <FadeIn>
       <section className="section-padding text-center bg-muted/50">
          <div className="container mx-auto">
            <Skeleton className="h-10 w-1/2 md:w-2/3 mx-auto mb-4" />
            <Skeleton className="h-5 w-3/4 md:w-1/2 mx-auto mb-8" />
            <Skeleton className="h-12 w-36 mx-auto" />
          </div>
        </section>
    </FadeIn>
  </>
);


export default async function HomePage() {
  let pageContent: HomePageContent | null = null;
  let featuredServices: Service[] = [];
  let featuredProjects: Project[] = [];
  let keyStats: SiteKeyStats | null = null;
  let isLoadingContent = true;
  let isLoadingServices = true;
  let isLoadingProjects = true;
  let isLoadingKeyStats = true;


  try {
    pageContent = await getHomePageContent();
    isLoadingContent = false;
  } catch (error) {
    console.error("Error fetching home page content:", error);
    isLoadingContent = false;
  }

  try {
    featuredServices = (await getServices()).filter(s => s.status === 'Active').slice(0, 3);
    isLoadingServices = false;
  } catch (error) {
    console.error("Error fetching services:", error);
    isLoadingServices = false;
  }
  
  try {
    featuredProjects = (await getProjects()).filter(p => p.status === 'Completed' || p.status === 'In Progress').slice(0, 3);
    isLoadingProjects = false;
  } catch (error) {
    console.error("Error fetching projects:", error);
    isLoadingProjects = false;
  }

  try {
    keyStats = await getKeyStats();
    isLoadingKeyStats = false;
  } catch (error) {
    console.error("Error fetching key stats:", error);
    isLoadingKeyStats = false;
  }
  
  const statItemsDisplayConfig = [
    {
      key: 'satisfiedClients' as keyof KeyStatsData,
      title: "Satisfied Clients",
      Icon: 'Users', // Changed to string name
    },
    {
      key: 'projectsCompleted' as keyof KeyStatsData,
      title: "Projects Completed",
      Icon: 'Briefcase', // Changed to string name
    },
    {
      key: 'yearsOfExperience' as keyof KeyStatsData,
      title: "Years of Experience",
      Icon: 'Award', // Changed to string name
    },
  ];

  if (isLoadingContent || isLoadingServices || isLoadingProjects || isLoadingKeyStats) {
    return <HomePageContentSkeleton />;
  }

  if (!pageContent) {
     // This can happen if getHomePageContent itself returns null or an error state
     return (
        <div className="container mx-auto section-padding text-center">
            <p className="text-xl text-destructive">Failed to load essential page content. Please try again later.</p>
        </div>
    );
  }


  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <FadeIn>
        <section className="section-padding bg-gradient-to-br from-background to-muted/30 text-center">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" dangerouslySetInnerHTML={{ __html: pageContent.heroTitle }}></h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-balance">
              {pageContent.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="button-primary w-full sm:w-auto">Get Started</Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline" className="button-outline w-full sm:w-auto">Our Services <ArrowRight className="ml-2 h-5 w-5" /></Button>
              </Link>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Featured Services Section */}
      <FadeIn>
        <section className="section-padding">
          <div className="container mx-auto">
            <h2 className="section-title">Our Core Services</h2>
            <p className="text-lg text-muted-foreground text-center mb-12 max-w-xl mx-auto text-balance">
              We deliver a wide range of IT services designed to elevate your business.
            </p>
            {featuredServices.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-8">
                {featuredServices.map((service, index) => {
                  const IconComponent = service.iconName ? getIconComponent(service.iconName) : Briefcase;
                  return (
                    <FadeIn key={service.id} delay={index * 150}>
                      <Card className="text-center h-full hover:shadow-xl transition-shadow duration-300">
                        <CardHeader>
                          <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4">
                            <IconComponent className="h-10 w-10" />
                          </div>
                          <CardTitle className="text-2xl">{service.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{service.description}</p>
                        </CardContent>
                         <CardFooter>
                            <Link href={`/services/${service.id}`} className="w-full">
                                <Button variant="outline" className="w-full">Learn More</Button>
                            </Link>
                        </CardFooter>
                      </Card>
                    </FadeIn>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No featured services available right now. Please try again later.</p>
            )}
            <div className="text-center mt-12">
              <Link href="/services">
                <Button variant="link" className="text-lg text-primary hover:underline">
                  Explore All Services <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Why Choose Us Section */}
      <FadeIn>
        <section className="section-padding bg-muted">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="section-title">{pageContent.whyByteBrustersTitle}</h2>
                <p className="text-lg text-muted-foreground mb-6 text-balance">
                  {pageContent.whyByteBrustersParagraph}
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start"><CheckCircle className="h-6 w-6 text-primary mr-3 mt-1 shrink-0" /><span><span className="font-semibold text-foreground">Expert Team:</span> Highly skilled professionals passionate about technology.</span></li>
                  <li className="flex items-start"><CheckCircle className="h-6 w-6 text-primary mr-3 mt-1 shrink-0" /><span><span className="font-semibold text-foreground">Custom Solutions:</span> Tailored strategies and applications that fit your unique requirements.</span></li>
                  <li className="flex items-start"><CheckCircle className="h-6 w-6 text-primary mr-3 mt-1 shrink-0" /><span><span className="font-semibold text-foreground">Transparent Communication:</span> Keeping you informed every step of the way.</span></li>
                   <li className="flex items-start"><CheckCircle className="h-6 w-6 text-primary mr-3 mt-1 shrink-0" /><span><span className="font-semibold text-foreground">Future-Proof Technology:</span> Utilizing the latest tools and frameworks for scalable solutions.</span></li>
                </ul>
                <Link href="/about">
                  <Button className="button-secondary">Learn More About Us</Button>
                </Link>
              </div>
              <div className="hidden lg:block relative aspect-square">
                 <Image
                    src={pageContent.whyByteBrustersImageUrl}
                    alt={pageContent.whyByteBrustersTitle || "ByteBrusters Team Collaboration"}
                    fill
                    data-ai-hint={pageContent.whyByteBrustersImageAiHint || 'team collaboration'}
                    className="rounded-lg object-cover shadow-xl"
                 />
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Stats Section */}
      {keyStats ? (
        <FadeIn>
          <section className="section-padding bg-primary/5">
            <div className="container mx-auto">
              <div className="flex flex-col sm:flex-row justify-around items-center gap-8 py-8">
                {statItemsDisplayConfig.map((itemConfig, index) => {
                  const valueString = keyStats[itemConfig.key as keyof SiteKeyStats];
                  return valueString ? (
                    <AnimatedStatItem
                      key={itemConfig.key}
                      valueString={valueString}
                      title={itemConfig.title}
                      iconName={itemConfig.Icon} // Pass iconName string
                      delay={index * 150}
                    />
                  ) : null;
                })}
              </div>
            </div>
          </section>
        </FadeIn>
      ) : <KeyStatsSectionSkeleton />}


      {/* Featured Projects Section */}
      <FadeIn>
        <section className="section-padding">
          <div className="container mx-auto">
            <h2 className="section-title">Our Projects</h2>
             <p className="text-lg text-muted-foreground text-center mb-12 max-w-xl mx-auto text-balance">
              Take a glimpse at some of the impactful projects we've delivered.
            </p>
            {featuredProjects.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProjects.map((project, index) => (
                    <FadeIn key={project.id} delay={index * 150}>
                    <Card className="overflow-hidden h-full hover:shadow-xl transition-shadow duration-300 flex flex-col">
                        <Image
                        src={project.imageUrl}
                        alt={project.title || 'Project showcase image'}
                        width={600}
                        height={400}
                        data-ai-hint={project.dataAiHint || 'project image'}
                        className="w-full h-48 object-cover"
                        />
                        <CardHeader>
                        <CardTitle className="text-xl">{project.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                        <CardDescription>{project.description}</CardDescription>
                        </CardContent>
                        <CardFooter>
                        <Link href={`/projects/${project.id}`} className="w-full">
                            <Button variant="outline" className="w-full">View Case Study</Button>
                        </Link>
                        </CardFooter>
                    </Card>
                    </FadeIn>
                ))}
                </div>
            ) : (
                <p className="text-center text-muted-foreground py-8">No featured projects available right now. Please try again later.</p>
            )}
             <div className="text-center mt-12">
              <Link href="/projects">
                <Button variant="link" className="text-lg text-primary hover:underline">
                  See All Projects <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="section-padding text-center bg-muted/50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-semibold mb-4" dangerouslySetInnerHTML={{ __html: pageContent.finalCtaTitle }}></h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
                {pageContent.finalCtaSubtitle}
            </p>
            <Link href="/contact">
                <Button size="lg" className="button-primary">
                    Let's Talk
                </Button>
            </Link>
          </div>
        </section>
      </FadeIn>
    </div>
  );
}
