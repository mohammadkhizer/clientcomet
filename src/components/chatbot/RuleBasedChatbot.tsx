
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Send, X, Bot, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { getChatbotRules } from '@/services/chatbotRuleService';
import type { ChatbotRule } from '@/types';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

const initialBotMessage: Message = {
    id: Date.now().toString() + '_init',
    text: "Hello! I'm ByteBot, your friendly assistant. How can I help you today?",
    sender: 'bot',
};

const defaultBotResponse = "I'm sorry, I didn't quite understand that. Could you please rephrase? You can ask about our services, projects, or contact information.";

export function RuleBasedChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialBotMessage]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [chatbotRules, setChatbotRules] = useState<ChatbotRule[]>([]);
  const [isLoadingRules, setIsLoadingRules] = useState(true);

  const fetchRules = useCallback(async () => {
    setIsLoadingRules(true);
    try {
      const rules = await getChatbotRules();
      setChatbotRules(rules);
    } catch (error) {
      console.error("Failed to load chatbot rules:", error);
      // Keep chatbotRules empty, it will use default response
    } finally {
      setIsLoadingRules(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchRules();
    }
  }, [isOpen, fetchRules]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const getBotResponse = (userInput: string): string => {
    if (isLoadingRules) {
      return "I'm currently loading my knowledge, please wait a moment...";
    }
    if (chatbotRules.length === 0) {
        return defaultBotResponse; // Fallback if no rules are loaded
    }

    const lowerInput = userInput.toLowerCase().trim();

    // Sort rules by priority (lower number means higher priority)
    const sortedRules = [...chatbotRules].sort((a, b) => (a.priority || 100) - (b.priority || 100));


    for (const rule of sortedRules) {
      for (const keyword of rule.keywords) {
        // Use word boundary to avoid partial matches e.g. 'serv' in 'deserves'
        const regex = new RegExp(`\\b${keyword.toLowerCase().trim()}\\b`, 'i');
        if (regex.test(lowerInput)) {
          return rule.response;
        }
      }
    }
    return defaultBotResponse;
  };

  const handleSendMessage = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (inputValue.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString() + '_user',
      text: inputValue,
      sender: 'user',
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Let the user see their message, then bot "thinks"
    setTimeout(() => {
      const botResponseText = getBotResponse(inputValue);
      const botMessage: Message = {
        id: Date.now().toString() + '_bot',
        text: botResponseText,
        sender: 'bot',
      };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    }, 500);
    
    setInputValue('');
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) { // If opening and no messages, add initial
         setMessages([initialBotMessage]);
    }
  };

  return (
    <>
      <Button
        onClick={toggleChatbot}
        variant="default"
        size="icon"
        className="fixed bottom-22 right-6 h-14 w-14 rounded-full shadow-lg z-50 button-primary"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X className="h-7 w-7" /> : <MessageSquare className="h-7 w-7" />}
      </Button>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-full max-w-sm h-[70vh] max-h-[500px] shadow-xl z-50 flex flex-col rounded-lg border border-border bg-card text-card-foreground">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-2">
                <Bot className="h-6 w-6 text-primary" />
                <CardTitle className="text-lg font-semibold">ByteBot Assistant</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleChatbot} aria-label="Close chat">
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 flex-grow overflow-hidden">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex items-end space-x-2 max-w-[85%]",
                      msg.sender === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'
                    )}
                  >
                    {msg.sender === 'bot' && <Bot className="h-6 w-6 text-primary shrink-0 mb-1" />}
                    <div
                      className={cn(
                        "p-3 rounded-lg shadow-sm text-sm",
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-muted text-muted-foreground rounded-bl-none'
                      )}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
                 {isLoadingRules && messages.length <=1 && ( // Only show initial loading if no other messages
                  <div className="flex justify-center items-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <p className="ml-2 text-sm text-muted-foreground">Loading knowledge...</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 border-t border-border">
            <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-grow"
                aria-label="Chat message input"
                disabled={isLoadingRules && chatbotRules.length === 0} // Disable input if rules are loading initially
              />
              <Button type="submit" size="icon" className="button-primary shrink-0" aria-label="Send message" disabled={isLoadingRules && chatbotRules.length === 0}>
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
