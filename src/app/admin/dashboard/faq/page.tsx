
"use client"; 

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2, MoreHorizontal, Loader2, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FadeIn } from '@/components/motion/fade-in';
import { useToast } from "@/hooks/use-toast";
import type { FAQItem } from '@/types';
import { getFAQItems, deleteFAQItem } from '@/services/faqService';
import { useRouter } from 'next/navigation';

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const fetchFAQs = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getFAQItems();
      setFaqs(data);
    } catch (error) {
      console.error("Failed to fetch FAQs:", error);
      toast({ title: "Error Loading FAQs", description: (error as Error).message || "Failed to load FAQs.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchFAQs();
  }, [fetchFAQs]);

  const handleDeleteFAQ = async (faqId: string, faqQuestion: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete the FAQ: "${faqQuestion}"?`);
    if (confirmed) {
      try {
        await deleteFAQItem(faqId);
        setFaqs(prevFaqs => prevFaqs.filter(faq => faq.id !== faqId));
        toast({
          title: "FAQ Deleted",
          description: `FAQ "${faqQuestion}" has been removed.`,
        });
      } catch (error) {
         toast({
          title: "Error Deleting FAQ",
          description: (error as Error).message || `Failed to delete FAQ "${faqQuestion}".`,
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <FadeIn>
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
            <h1 className="text-2xl font-semibold text-foreground flex items-center">
                <HelpCircle className="mr-3 h-6 w-6 text-primary"/> Manage FAQs
            </h1>
            <p className="text-muted-foreground">Add, edit, or remove Frequently Asked Questions.</p>
        </div>
        <Link href="/admin/dashboard/faq/new" className="w-full sm:w-auto">
            <Button className="button-primary w-full sm:w-auto">
                <PlusCircle className="mr-2 h-5 w-5" /> Add New FAQ
            </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All FAQs</CardTitle>
          <CardDescription>A list of all FAQs for your website.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[300px]">Question</TableHead>
                  <TableHead className="min-w-[400px]">Answer (Snippet)</TableHead>
                  <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faqs.length === 0 && !isLoading && (
                  <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">No FAQs found. Add your first FAQ!</TableCell></TableRow>
                )}
                {faqs.map((faq) => (
                  <TableRow key={faq.id}>
                    <TableCell className="font-medium">{faq.question}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                        {faq.answer.length > 100 ? `${faq.answer.substring(0, 100)}...` : faq.answer}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`/admin/dashboard/faq/edit/${faq.id}`)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteFAQ(faq.id, faq.question)} 
                              className="text-destructive focus:text-destructive focus:bg-destructive/10"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
    </FadeIn>
  );
}
