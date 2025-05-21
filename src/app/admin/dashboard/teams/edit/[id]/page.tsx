
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Save, Image as ImageIcon, Linkedin, Twitter, Github, FileText } from 'lucide-react';
import { FadeIn } from '@/components/motion/fade-in';
import { getTeamMemberById, updateTeamMember } from '@/services/teamService';
import type { TeamMember } from '@/types';

const teamMemberFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  role: z.string().min(3, { message: "Role must be at least 3 characters." }),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters." }).max(500, { message: "Bio too long" }),
  imageUrl: z.string().url({ message: "Please enter a valid image URL." }).optional().or(z.literal('')),
  dataAiHint: z.string().max(50, {message: "AI Hint too long (e.g. 'man portrait')"}).optional().or(z.literal('')),
  linkedinUrl: z.string().url({ message: "Invalid LinkedIn URL."}).optional().or(z.literal('')),
  twitterUrl: z.string().url({ message: "Invalid Twitter URL."}).optional().or(z.literal('')),
  githubUrl: z.string().url({ message: "Invalid GitHub URL."}).optional().or(z.literal('')),
  cvUrl: z.string().url({ message: "Invalid CV URL."}).optional().or(z.literal('')),
});

type TeamMemberFormValues = z.infer<typeof teamMemberFormSchema>;

export default function EditTeamMemberPage() {
  const router = useRouter();
  const params = useParams();
  const memberId = params.id as string;
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [member, setMember] = useState<TeamMember | null>(null);

  const form = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberFormSchema),
    defaultValues: {
      name: "",
      role: "",
      bio: "",
      imageUrl: "",
      dataAiHint: "",
      linkedinUrl: "",
      twitterUrl: "",
      githubUrl: "",
      cvUrl: "",
    },
  });

  const fetchMemberData = useCallback(async () => {
    if (!memberId) return;
    setIsFetching(true);
    try {
      const data = await getTeamMemberById(memberId);
      if (data) {
        setMember(data);
        form.reset({
          name: data.name || "",
          role: data.role || "",
          bio: data.bio || "",
          imageUrl: data.imageUrl || "",
          dataAiHint: data.dataAiHint || "",
          linkedinUrl: data.socials?.linkedin || "",
          twitterUrl: data.socials?.twitter || "",
          githubUrl: data.socials?.github || "",
          cvUrl: data.socials?.cvUrl || "",
        });
      } else {
        toast({ title: "Error", description: "Team member not found.", variant: "destructive" });
        router.push('/admin/dashboard/teams');
      }
    } catch (error) {
      toast({ title: "Error fetching team member", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsFetching(false);
    }
  }, [memberId, form, toast, router]);

  useEffect(() => {
    fetchMemberData();
  }, [fetchMemberData]);

  async function onSubmit(data: TeamMemberFormValues) {
    if (!member) return;
    setIsLoading(true);
    
    const updateData: Partial<Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>> = {
        name: data.name,
        role: data.role,
        bio: data.bio,
        imageUrl: data.imageUrl || `https://placehold.co/400x400.png?text=${encodeURIComponent(data.name.charAt(0))}`,
        dataAiHint: data.dataAiHint || 'person avatar',
        socials: {
            linkedin: data.linkedinUrl || undefined,
            twitter: data.twitterUrl || undefined,
            github: data.githubUrl || undefined,
            cvUrl: data.cvUrl || undefined,
        }
    };

    try {
      const updatedMember = await updateTeamMember(member.id, updateData);
      toast({
          title: "Team Member Updated",
          description: `Member "${updatedMember?.name}" has been updated successfully.`,
      });
      router.push('/admin/dashboard/teams'); 
    } catch (error) {
      toast({
        title: "Error Updating Member",
        description: (error as Error).message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!member && !isFetching) {
     return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Team member not found or could not be loaded.</p>
        <Button variant="outline" onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <FadeIn>
      <div className="mb-6">
         <Button variant="outline" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Teams
        </Button>
        <h1 className="text-2xl font-semibold text-foreground">Edit Team Member</h1>
        <p className="text-muted-foreground">Update details for {member?.name}.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Member Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="e.g., Alex Smith" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="role" render={({ field }) => (
                    <FormItem><FormLabel>Role / Position</FormLabel><FormControl><Input placeholder="e.g., Senior Developer" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
              </div>
              <FormField control={form.control} name="bio" render={({ field }) => (
                  <FormItem><FormLabel>Short Bio</FormLabel><FormControl><Textarea placeholder="A brief introduction about the team member..." className="min-h-[100px]" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
               <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                    <FormItem><FormLabel>Avatar Image URL (Optional)</FormLabel><FormControl><div className="flex items-center space-x-2"><ImageIcon className="h-5 w-5 text-muted-foreground" /><Input placeholder="https://placehold.co/400x400.png" {...field} /></div></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="dataAiHint" render={({ field }) => (
                    <FormItem><FormLabel>Image AI Hint (Optional)</FormLabel><FormControl><Input placeholder="e.g., man software (max 2 words)" {...field} /></FormControl><FormMessage /><p className="text-xs text-muted-foreground pt-1">Keywords for avatar placeholder (e.g. "woman designer").</p></FormItem>
                )}/>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle>Social & CV Links (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <FormField control={form.control} name="linkedinUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Linkedin className="mr-2 h-4 w-4 text-muted-foreground"/>LinkedIn URL</FormLabel>
                    <FormControl><Input placeholder="https://linkedin.com/in/username" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="twitterUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Twitter className="mr-2 h-4 w-4 text-muted-foreground"/>Twitter URL</FormLabel>
                    <FormControl><Input placeholder="https://twitter.com/username" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="githubUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Github className="mr-2 h-4 w-4 text-muted-foreground"/>GitHub URL</FormLabel>
                    <FormControl><Input placeholder="https://github.com/username" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                 <FormField control={form.control} name="cvUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><FileText className="mr-2 h-4 w-4 text-muted-foreground"/>CV Link (PDF URL)</FormLabel>
                    <FormControl><Input placeholder="https://example.com/cv.pdf" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-6">
              <Button type="submit" className="button-primary" disabled={isLoading || isFetching}>
                {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</>) : (<><Save className="mr-2 h-4 w-4" /> Update Team Member</>)}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </FadeIn>
  );
}
    
