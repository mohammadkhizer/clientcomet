
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { aiFAQResponse, type AiFAQResponseInput, type AiFAQResponseOutput } from '@/ai/flows/ai-faq-response';
import { Loader2, MessageSquare, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function FaqClient() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<AiFAQResponseOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }
    setIsLoading(true);
    setResponse(null);
    setError(null);

    try {
      const input: AiFAQResponseInput = { question };
      const result = await aiFAQResponse(input);
      setResponse(result);
    } catch (err) {
      console.error("FAQ AI Error:", err);
      setError('Failed to get an answer. Please try again.');
      setResponse(null);
    } finally {
      setIsLoading(false);
    }
  };

  const cannedResponses: Record<string, { title: string; content: string[] }> = {
    contact: {
      title: "Contact Information",
      content: [
        "Email: info@bytebrusters.com",
        "Phone: +1 (234) 567-890",
        "Address: 123 Tech Avenue, Silicon Valley, CA 94000, USA",
        "You can also use our contact form on the Contact Us page.",
      ],
    },
    // Add more canned responses as needed
  };
  
  const getCannedResponseKey = (question: string): string | null => {
    const lowerQuestion = question.toLowerCase();
    if (lowerQuestion.includes('contact') || lowerQuestion.includes('address') || lowerQuestion.includes('phone') || lowerQuestion.includes('email us')) {
      return 'contact';
    }
    // Add more conditions for other canned responses
    return null;
  };


  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <MessageSquare className="mr-2 h-6 w-6 text-primary" />
          Ask our AI Assistant
        </CardTitle>
        <CardDescription>
          Get instant answers to your questions about ByteBrusters.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              placeholder="Type your question here... (e.g., What services do you offer? How can I contact you?)"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[100px] text-base"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full button-primary" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting Answer...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> Ask AI
              </>
            )}
          </Button>
        </form>

        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {response && (
          <div className="mt-6 p-6 bg-muted rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-foreground">AI Response:</h3>
            {response.useCannedResponse ? (
              (() => {
                const cannedKey = getCannedResponseKey(question);
                if (cannedKey && cannedResponses[cannedKey]) {
                  const canned = cannedResponses[cannedKey];
                  return (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p className="italic text-sm mb-2">{response.answer}</p>
                      <h4 className="font-semibold text-lg !mt-0">{canned.title}:</h4>
                      <ul>
                        {canned.content.map((line, i) => <li key={i}>{line}</li>)}
                      </ul>
                    </div>
                  );
                }
                // Fallback if specific canned response not found by key, but tool said use canned.
                return <p className="text-muted-foreground">{response.answer} Please check our website for standard information or contact us directly.</p>;
              })()
            ) : (
              <p className="text-muted-foreground whitespace-pre-wrap">{response.answer}</p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Our AI assistant is constantly learning. For complex queries, please <a href="/contact" className="text-primary hover:underline">contact us</a> directly.
        </p>
      </CardFooter>
    </Card>
  );
}
