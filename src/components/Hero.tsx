import { Button } from "@/components/ui/button";
import { BookOpen, Languages, MessageSquare } from "lucide-react";
import heroImage from "@/assets/hero-books.jpg";

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-primary/20" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 py-20 mx-auto">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
            Read Any Book.
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              In Your Language.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Breaking language barriers. Translate entire books instantly and understand every concept with assistance.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="hero-button text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-accent hover:scale-105"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Start Reading
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 max-w-3xl mx-auto">
            <div className="flex flex-col items-center space-y-3 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300">
              <div className="p-3 rounded-xl bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Access Any Book</h3>
              <p className="text-sm text-muted-foreground text-center">
                Browse millions of books from online libraries
              </p>
            </div>

            <div className="flex flex-col items-center space-y-3 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-secondary/50 transition-all duration-300">
              <div className="p-3 rounded-xl bg-secondary/10">
                <Languages className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg">Instant Translation</h3>
              <p className="text-sm text-muted-foreground text-center">
                Translate complete books to your regional language
              </p>
            </div>

            <div className="flex flex-col items-center space-y-3 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-accent/50 transition-all duration-300">
              <div className="p-3 rounded-xl bg-accent/10">
                <MessageSquare className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg">AI Assistant</h3>
              <p className="text-sm text-muted-foreground text-center">
                Ask questions and understand complex passages
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
