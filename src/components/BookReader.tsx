import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Languages, 
  Loader2, 
  MessageSquare,
  X,
  BookOpen 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ChatAssistant } from "./ChatAssistant";
import { supabase } from "@/integrations/supabase/client";

const LANGUAGES = [
  { code: "ORIGINAL", name: "Original" },
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "pa", name: "Punjabi" },
  { code: "ar", name: "Arabic" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "bn", name: "Bengali" },
  { code: "mr", name: "Marathi" },
  { code: "gu", name: "Gujarati" },
  { code: "ru", name: "Russian" },
  { code: "ko", name: "Korean" },
  { code: "ml", name: "Malayalam" },
  { code: "nl", name: "Dutch" },
  { code: "ur", name: "Urdu" },
  { code: "ja", name: "Japanese" },
  { code: "zh", name: "Chinese" },
];

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
  const [selectedLanguage, setSelectedLanguage] = useState("ORIGINAL");
  const [showChat, setShowChat] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookContent = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${book.id}?key=AIzaSyDR5clW3S8ChtGPGQdBL7Ty-3FKyKzXQME`
        );
        const data = await response.json();
        
        let bookText = `# ${book.title}\n\n**by ${book.authors.join(", ")}**\n\n---\n\n`;
        
        // Add all available content
        if (data.volumeInfo.description) {
          bookText += `## Overview\n\n${data.volumeInfo.description}\n\n`;
        }
        
        // Add publisher info
        if (data.volumeInfo.publisher) {
          bookText += `**Publisher:** ${data.volumeInfo.publisher}\n`;
        }
        if (data.volumeInfo.publishedDate) {
          bookText += `**Published:** ${data.volumeInfo.publishedDate}\n`;
        }
        if (data.volumeInfo.pageCount) {
          bookText += `**Pages:** ${data.volumeInfo.pageCount}\n\n`;
        }
        
        // Add categories
        if (data.volumeInfo.categories) {
          bookText += `**Categories:** ${data.volumeInfo.categories.join(", ")}\n\n`;
        }
        
        bookText += `---\n\n`;
        bookText += `## Content Preview\n\n`;
        bookText += `Note: Due to copyright restrictions, Google Books API provides limited content. Full books are not available through the API.\n\n`;
        
        if (data.searchInfo?.textSnippet) {
          bookText += data.searchInfo.textSnippet.replace(/<\/?b>/g, '**') + '\n\n';
        }
        
        // Split into pages (every ~2000 characters)
        const pageSize = 2000;
        const contentPages = [];
        for (let i = 0; i < bookText.length; i += pageSize) {
          contentPages.push(bookText.slice(i, i + pageSize));
        }
        
        setPages(contentPages);
        setContent(bookText);
      } catch (error) {
        console.error('Error fetching book content:', error);
        const fallback = `# ${book.title}\n\nby ${book.authors.join(", ")}\n\n${book.description}\n\nContent preview is not available.`;
        setPages([fallback]);
        setContent(fallback);
      }
    };
    
    fetchBookContent();
  }, [book]);

  const translateCurrentPage = async (language: string) => {
    if (language === "ORIGINAL") {
      setSelectedLanguage("ORIGINAL");
      setTranslatedContent("");
      return;
    }

    setIsTranslating(true);
    try {
      const textToTranslate = pages[currentPage] || content;
      const { data, error } = await supabase.functions.invoke('translate', {
        body: { 
          text: textToTranslate,
          targetLanguage: language
        }
      });

      if (error) throw error;

      setTranslatedContent(data.translatedText);
      setSelectedLanguage(language);
      toast({
        title: "Translation complete",
        description: `Page translated to ${LANGUAGES.find(l => l.code === language)?.name}`,
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

  useEffect(() => {
    if (selectedLanguage !== "ORIGINAL") {
      translateCurrentPage(selectedLanguage);
    } else {
      setTranslatedContent("");
    }
  }, [currentPage]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    if (text && text.length > 0) {
      setSelectedText(text);
      setShowChat(true);
    }
  };

  const displayContent = selectedLanguage === "ORIGINAL" ? (pages[currentPage] || content) : (translatedContent || pages[currentPage] || content);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border/50 shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="rounded-xl hover:bg-primary/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-primary" />
                <div>
                  <h1 className="font-semibold text-base sm:text-lg line-clamp-1">{book.title}</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                    {book.authors.join(", ")}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Select value={selectedLanguage} onValueChange={translateCurrentPage} disabled={isTranslating}>
                <SelectTrigger className="w-[140px] sm:w-[160px] rounded-xl bg-background/50">
                  <Languages className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant={showChat ? "default" : "outline"}
                onClick={() => setShowChat(!showChat)}
                size="sm"
                className="rounded-xl"
              >
                {showChat ? (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Close
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
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Book content */}
          <div className={showChat ? "lg:col-span-2" : "lg:col-span-3"}>
            <Card className="overflow-hidden rounded-2xl shadow-xl border-border/50 bg-card/50 backdrop-blur">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      {pages.length > 1 ? `Page ${currentPage + 1} of ${pages.length}` : 'Reading'}
                    </span>
                    {isTranslating && (
                      <span className="flex items-center gap-2 text-xs text-primary">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Translating...
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {pages.length > 1 && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                          disabled={currentPage === 0 || isTranslating}
                          className="rounded-lg h-8"
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.min(pages.length - 1, p + 1))}
                          disabled={currentPage === pages.length - 1 || isTranslating}
                          className="rounded-lg h-8"
                        >
                          Next
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <ScrollArea className="h-[calc(100vh-16rem)]">
                <div 
                  className="p-8 prose prose-lg max-w-none dark:prose-invert"
                  onMouseUp={handleTextSelection}
                >
                  <div className="font-serif leading-relaxed whitespace-pre-wrap text-foreground">
                    {displayContent}
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
