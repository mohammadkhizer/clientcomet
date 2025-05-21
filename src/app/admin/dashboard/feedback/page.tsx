
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2, MoreHorizontal, Loader2, Star, MessageSquareText, Eye, Send } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FadeIn } from '@/components/motion/fade-in';
import { useToast } from "@/hooks/use-toast";
import type { Feedback } from '@/types';
import { getFeedbacks, deleteFeedback } from '@/services/feedbackService';
import { format } from 'date-fns';

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [currentFeedbackForReply, setCurrentFeedbackForReply] = useState<Feedback | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);


  const fetchFeedbacks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getFeedbacks();
      setFeedbacks(data);
    } catch (error) {
      console.error("Failed to fetch feedbacks:", error);
      toast({ title: "Error Loading Feedbacks", description: (error as Error).message || "Failed to load feedbacks.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const handleDeleteFeedback = async (feedbackId: string, feedbackName: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete the feedback from "${feedbackName}"?`);
    if (confirmed) {
      try {
        await deleteFeedback(feedbackId);
        setFeedbacks(prevFeedbacks => prevFeedbacks.filter(fb => fb.id !== feedbackId));
        toast({
          title: "Feedback Deleted",
          description: `Feedback from "${feedbackName}" has been removed.`,
        });
      } catch (error) {
         toast({
          title: "Error Deleting Feedback",
          description: (error as Error).message || `Failed to delete feedback from "${feedbackName}".`,
          variant: "destructive",
        });
      }
    }
  };

  const handleOpenReplyDialog = (feedback: Feedback) => {
    setCurrentFeedbackForReply(feedback);
    setReplyText(`Hi ${feedback.name},\n\nThank you for your feedback regarding your experience. We appreciate you taking the time to share your thoughts.\n\nBest regards,\nThe ByteBrusters Team`);
    setIsReplyDialogOpen(true);
  };

  const handleSendSimulatedReply = async () => {
    if (!currentFeedbackForReply || !replyText.trim()) return;
    setIsSendingReply(true);
    try {
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 700)); 
      toast({
        title: "Reply 'Sent' (Simulated)",
        description: `Your reply to ${currentFeedbackForReply.name} has been simulated as sent. No actual email was dispatched.`,
      });
      setIsReplyDialogOpen(false);
      setReplyText("");
      setCurrentFeedbackForReply(null);
    } catch (error) {
      toast({ title: "Error Sending Simulated Reply", description: (error as Error).message || "Failed to simulate sending.", variant: "destructive" });
    } finally {
      setIsSendingReply(false);
    }
  };


  const renderStars = (rating: number) => {
    return (
      <span className="inline-flex"> {/* Changed from div to span */}
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`}
          />
        ))}
      </span>
    );
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
                <MessageSquareText className="mr-3 h-6 w-6 text-primary"/> View Submitted Feedback
            </h1>
            <p className="text-muted-foreground">Review feedback submitted by users.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Feedback</CardTitle>
          <CardDescription>A list of all feedback received.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Name</TableHead>
                  <TableHead className="min-w-[200px]">Email</TableHead>
                  <TableHead className="min-w-[100px]">Rating</TableHead>
                  <TableHead className="min-w-[300px]">Message (Snippet)</TableHead>
                  <TableHead className="min-w-[150px]">Date</TableHead>
                  <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedbacks.length === 0 && !isLoading && (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No feedback received yet.</TableCell></TableRow>
                )}
                {feedbacks.map((feedback) => (
                  <TableRow key={feedback.id}>
                    <TableCell className="font-medium">{feedback.name}</TableCell>
                    <TableCell>{feedback.email}</TableCell>
                    <TableCell>{renderStars(feedback.rating)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                        {feedback.message.length > 100 ? `${feedback.message.substring(0, 100)}...` : feedback.message}
                    </TableCell>
                     <TableCell>{feedback.createdAt ? format(new Date(feedback.createdAt), 'PP p') : 'N/A'}</TableCell>
                    <TableCell className="text-right">
                        <Dialog open={isReplyDialogOpen && currentFeedbackForReply?.id === feedback.id} onOpenChange={(isOpen) => {
                            if (!isOpen) {
                                setIsReplyDialogOpen(false);
                                setCurrentFeedbackForReply(null);
                                setReplyText("");
                            }
                        }}>
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleOpenReplyDialog(feedback)}>
                                    <Eye className="mr-2 h-4 w-4" /> View & Reply (Simulated)
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                onClick={() => handleDeleteFeedback(feedback.id, feedback.name)} 
                                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                            <DialogContent className="sm:max-w-2xl">
                                <DialogHeader>
                                <DialogTitle>Feedback from: {currentFeedbackForReply?.name}</DialogTitle>
                                <DialogDescription>
                                    Email: <a href={`mailto:${currentFeedbackForReply?.email}`} className="text-primary hover:underline">{currentFeedbackForReply?.email}</a> | Rating: {currentFeedbackForReply && renderStars(currentFeedbackForReply.rating)} <br/>
                                    Date: {currentFeedbackForReply?.createdAt ? format(new Date(currentFeedbackForReply.createdAt), 'PP p') : 'N/A'}
                                </DialogDescription>
                                </DialogHeader>
                                <div className="py-4 space-y-4">
                                <Card className="bg-muted/50 max-h-60">
                                    <CardHeader className="pb-2 sticky top-0 bg-muted/50 z-10">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Original Feedback Message:</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <ScrollArea className="h-full max-h-48">
                                        <p className="text-sm text-foreground whitespace-pre-wrap">{currentFeedbackForReply?.message}</p>
                                      </ScrollArea>
                                    </CardContent>
                                </Card>
                                
                                <div>
                                    <Label htmlFor="replyText" className="text-base font-medium flex items-center mb-2">
                                        <Send className="mr-2 h-5 w-5 text-primary"/> Your Reply:
                                    </Label>
                                    <Textarea
                                    id="replyText"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder={`Replying to ${currentFeedbackForReply?.name}...`}
                                    className="min-h-[120px] text-sm"
                                    disabled={isSendingReply}
                                    />
                                </div>
                                </div>
                                <DialogFooter className="sm:justify-between items-center">
                                <DialogClose asChild>
                                    <Button type="button" variant="outline" disabled={isSendingReply}>
                                    Cancel
                                    </Button>
                                </DialogClose>
                                <Button type="button" onClick={handleSendSimulatedReply} className="button-primary" disabled={isSendingReply || !replyText.trim()}>
                                    {isSendingReply ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" /> }
                                    Send Reply (Simulated)
                                </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
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
