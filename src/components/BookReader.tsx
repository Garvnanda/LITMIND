import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  Languages, 
  Loader2, 
  MessageSquare,
  X 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ChatAssistant } from "./ChatAssistant";
import { supabase } from "@/integrations/supabase/client";

interface Book {
  id: string;
  title: string;
  authors: string[];
  description: string;
  imageUrl: string;
  previewLink: string;
}

interface BookReaderProps {
  book: Book;
  onBack: () => void;
}

export const BookReader = ({ book, onBack }: BookReaderProps) => {
  const [content, setContent] = useState("");
  const [translatedContent, setTranslatedContent] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookContent = async () => {
      try {
        // Fetch book content from Google Books API
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${book.id}?key=AIzaSyDR5clW3S8ChtGPGQdBL7Ty-3FKyKzXQME`
        );
        const data = await response.json();
        
        // Extract content from various possible fields
        let bookText = '';
        
        if (data.volumeInfo.description) {
          bookText += `${book.title}\n\nby ${book.authors.join(", ")}\n\n${data.volumeInfo.description}\n\n`;
        }
        
        // Try to get preview content if available
        if (data.accessInfo?.textToSpeechPermission === 'ALLOWED' && book.previewLink) {
          bookText += `\nYou can read more at: ${book.previewLink}\n\n`;
        }
        
        // Add sample content
        bookText += `Preview Content:\n\n`;
        bookText += book.description || 'This book is available for reading. Use the preview link to access the full content.';
        
        setContent(bookText);
      } catch (error) {
        console.error('Error fetching book content:', error);
        // Fallback content
        setContent(`${book.title}\n\nby ${book.authors.join(", ")}\n\n${book.description}\n\nPreview content is not available for this book. Please visit: ${book.previewLink}`);
      }
    };
    
    fetchBookContent();
  }, [book]);

  const translateText = async () => {
    setIsTranslating(true);
    try {
      const { data, error } = await supabase.functions.invoke('translate', {
        body: { 
          text: content,
          targetLanguage: 'Hindi' // You can make this configurable later
        }
      });

      if (error) throw error;

      setTranslatedContent(data.translatedText);
      setShowTranslation(true);
      toast({
        title: "Translation complete",
        description: "Book has been translated successfully",
      });
    } catch (error) {
      console.error("Translation error:", error);
      toast({
        title: "Translation failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    if (text && text.length > 0) {
      setSelectedText(text);
      setShowChat(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="rounded-xl"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="font-semibold text-lg line-clamp-1">{book.title}</h1>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {book.authors.join(", ")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={translateText}
                disabled={isTranslating}
                className="rounded-xl"
              >
                {isTranslating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Translating...
                  </>
                ) : (
                  <>
                    <Languages className="mr-2 h-4 w-4" />
                    {showTranslation ? "Original" : "Translate"}
                  </>
                )}
              </Button>

              <Button
                variant={showChat ? "default" : "outline"}
                onClick={() => setShowChat(!showChat)}
                className="rounded-xl"
              >
                {showChat ? (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Close Chat
                  </>
                ) : (
                  <>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Ask AI
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book content */}
          <div className={showChat ? "lg:col-span-2" : "lg:col-span-3"}>
            <Card className="p-8 rounded-2xl">
              <ScrollArea className="h-[calc(100vh-16rem)]">
                <div 
                  className="prose prose-lg max-w-none"
                  onMouseUp={handleTextSelection}
                >
                  <div className="font-serif leading-relaxed whitespace-pre-wrap">
                    {showTranslation && translatedContent ? translatedContent : content}
                  </div>
                </div>
              </ScrollArea>
            </Card>
          </div>

          {/* Chat assistant */}
          {showChat && (
            <div className="lg:col-span-1">
              <ChatAssistant 
                bookTitle={book.title}
                selectedText={selectedText}
                onClose={() => setShowChat(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
