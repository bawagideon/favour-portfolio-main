import React, { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Star, Quote, CodeIcon, CheckCircle, X, Loader2 } from 'lucide-react';
import { Project } from '../../Types/portfolio';
import { cn } from '@/lib/utils';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (project) {
        setCurrentImageIndex(prev => 
          prev < project.images.length - 1 ? prev + 1 : 0
        );
      }
    },
    onSwipedRight: () => {
      if (project) {
        setCurrentImageIndex(prev => 
          prev > 0 ? prev - 1 : project.images.length - 1
        );
      }
    },
  });

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen || !project) return;

    switch (event.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        setCurrentImageIndex(prev => 
          prev > 0 ? prev - 1 : project.images.length - 1
        );
        break;
      case 'ArrowRight':
        setCurrentImageIndex(prev => 
          prev < project.images.length - 1 ? prev + 1 : 0
        );
        break;
    }
  }, [isOpen, onClose, project]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        ref={modalRef}
        className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-0 bg-background dark:bg-background rounded-xl border border-border-light dark:border-border-dark shadow-2xl"
      >
        {/* Header */}
        <DialogHeader className="sticky top-0 z-50 bg-background/95 dark:bg-background/95 backdrop-blur-md p-6 border-b border-border-light dark:border-border-dark">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
          >
            <DialogTitle className="text-3xl font-extrabold pr-8 flex items-center">
              <span className="bg-gradient-to-r from-primary via-pink-500 to-purple-500 bg-clip-text text-transparent animate-gradient">
                {project.title}
              </span>
            </DialogTitle>
            {project.category && (
              <p className="text-sm text-muted-foreground mt-1 font-medium">{project.category}</p>
            )}
          </motion.div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 z-50 hover:bg-destructive/10 transition-colors"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>
        </DialogHeader>
        
        {/* Content */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-64"
            >
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-10 p-8 bg-gradient-to-b from-background to-muted/30 rounded-b-xl"
            >
              {/* Carousel */}
              <div className="relative" {...swipeHandlers}>
                <Carousel 
                  className="w-full max-w-3xl mx-auto rounded-xl overflow-hidden shadow-lg"
                  opts={{
                    startIndex: currentImageIndex,
                  }}
                  setApi={(api) => {
                    if (api) {
                      setCurrentImageIndex(api.selectedScrollSnap());
                    }
                  }}
                >
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 bg-black/60 text-white px-4 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {project.images.length}
                  </div>
                  <CarouselContent>
                    {project.images.map((image, index) => (
                      <CarouselItem key={index}>
                        <motion.div 
                          className="relative w-full aspect-video rounded-xl overflow-hidden"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Image
                            src={image.src}
                            alt={image.alt || `${project.title} - Screenshot ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                            priority={index === 0}
                            loading={index === 0 ? 'eager' : 'lazy'}
                          />
                        </motion.div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious 
                    aria-label="Previous image" 
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-black/50 hover:scale-110 transition rounded-full"
                  />
                  <CarouselNext 
                    aria-label="Next image" 
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-black/50 hover:scale-110 transition rounded-full"
                  />
                </Carousel>
              </div>

              {/* Content Sections */}
              <div className="grid md:grid-cols-2 gap-10">
                {/* Overview */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4 p-4 bg-card rounded-lg shadow-md"
                >
                  <h3 className="text-xl font-semibold flex items-center">
                    <CodeIcon className="mr-2 text-primary" />
                    Project Overview
                  </h3>
                  <p className="text-muted-foreground">{project.description}</p>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map(tech => (
                        <Badge key={tech.name} variant="secondary">
                          {tech.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Challenges & Solutions */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4 p-4 bg-card rounded-lg shadow-md"
                >
                  <h3 className="text-xl font-semibold flex items-center">
                    <CheckCircle className="mr-2 text-primary" />
                    Challenges & Solutions
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Challenges</h4>
                      <ul className="list-disc pl-5 text-muted-foreground">
                        {project.details.challenges.map((challenge, index) => (
                          <li key={index}>{challenge}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Solutions</h4>
                      <ul className="list-disc pl-5 text-muted-foreground">
                        {project.details.solutions.map((solution, index) => (
                          <li key={index}>{solution}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Reviews */}
              <motion.div 
                className="mt-8 p-6 bg-muted/30 rounded-xl shadow-inner"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Quote className="mr-2 text-primary" />
                  Client Reviews
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {project.reviews.map((review, index) => (
                    <Card key={index} className="p-4 bg-card shadow-md">
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, starIndex) => (
                          <Star
                            key={starIndex}
                            className={cn(
                              "w-4 h-4",
                              starIndex < Math.floor(review.rating)
                                ? "text-yellow-500"
                                : "text-gray-300 dark:text-gray-600"
                            )}
                            fill={starIndex < Math.floor(review.rating) ? 'currentColor' : 'none'}
                          />
                        ))}
                      </div>
                      <p className="text-sm italic mb-2">&quot;{review.text}&quot;</p>
                      <p className="text-xs font-semibold text-muted-foreground">- {review.author}</p>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
