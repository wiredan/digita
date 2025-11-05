import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, Send, User, Mic, Volume2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/uiStore';
import { AnalyticsChart } from './AnalyticsChart';
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  chartData?: any[];
  chartType?: 'line';
}
const avocadoPriceData = [
  { name: 'Jan', price: 2.50 },
  { name: 'Feb', price: 2.65 },
  { name: 'Mar', price: 2.75 },
  { name: 'Apr', price: 2.90 },
  { name: 'May', price: 3.10 },
  { name: 'Jun', price: 3.05 },
];
export function DANAIChat() {
  const isAiChatOpen = useUIStore((s) => s.isAiChatOpen);
  const toggleAiChat = useUIStore((s) => s.toggleAiChat);
  const speakingMessageId = useUIStore((s) => s.speakingMessageId);
  const setSpeakingMessageId = useUIStore((s) => s.setSpeakingMessageId);
  const setAiChatOpen = (isOpen: boolean) => {
    if (isOpen) {
      useUIStore.getState().openAiChat();
    } else {
      useUIStore.getState().closeAiChat();
    }
  };
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! I'm DAN, your AI assistant. How can I help you with the agribusiness marketplace today? Try asking 'show me avocado price trends'.", sender: 'ai' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const speak = (text: string, messageId: number) => {
    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setSpeakingMessageId(messageId);
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };
  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
    };
    setMessages(prev => [...prev, userMessage]);
    const lowercasedInput = inputValue.toLowerCase();
    setInputValue('');
    // Mock AI response
    setTimeout(() => {
      let aiResponse: Message;
      if (lowercasedInput.includes('avocado') && lowercasedInput.includes('trend')) {
        aiResponse = {
          id: Date.now() + 1,
          text: "Certainly. Here are the price trends for Organic Hass Avocados over the last six months. As you can see, there has been a steady upward trend, peaking in May.",
          sender: 'ai',
          chartData: avocadoPriceData,
          chartType: 'line',
        };
      } else {
        aiResponse = {
          id: Date.now() + 1,
          text: "Thank you for your question. Based on current market data, the demand for organic products is expected to rise by 15% in the next quarter. Would you like to see a detailed report?",
          sender: 'ai',
        };
      }
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };
  const handleVoiceInput = () => {
    setInputValue("Show me avocado price trends");
  };
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);
  return (
    <Sheet open={isAiChatOpen} onOpenChange={setAiChatOpen}>
      <SheetTrigger asChild>
        <Button
          onClick={toggleAiChat}
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-[100] flex items-center justify-center"
        >
          <Bot className="h-8 w-8" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <span>DAN AI Assistant</span>
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full" ref={scrollAreaRef as any}>
            <div className="p-6 space-y-6">
              {messages.map((message) => (
                <div key={message.id}>
                  <div
                    className={cn(
                      "flex items-start gap-4",
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.sender === 'ai' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-5 w-5" /></AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "max-w-[75%] rounded-lg p-3 text-sm relative group",
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      {message.text}
                      {message.sender === 'ai' && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute -bottom-4 -right-4 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => speak(message.text, message.id)}
                        >
                          {speakingMessageId === message.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Volume2 className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                    {message.sender === 'user' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  {message.chartData && message.chartType && (
                    <AnalyticsChart data={message.chartData} type={message.chartType} title="Avocado Price Trends ($/unit)" />
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="p-4 border-t bg-background">
          <div className="relative">
            <Input
              placeholder="Ask about market trends, listings..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="pr-20"
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center">
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleVoiceInput}>
                <Mic className="h-4 w-4" />
              </Button>
              <Button size="icon" className="h-8 w-8" onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}