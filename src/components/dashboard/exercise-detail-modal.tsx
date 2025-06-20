"use client";

import type { Exercise } from '@/lib/constants';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, Youtube } from 'lucide-react';
import Image from 'next/image';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ExerciseDetailModal({ exercise, isOpen, onClose }: ExerciseDetailModalProps) {
  if (!exercise) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] bg-card text-card-foreground shadow-xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <exercise.icon className="h-8 w-8 text-primary" />
            <DialogTitle className="text-2xl font-headline text-primary">{exercise.name}</DialogTitle>
          </div>
          <DialogDescription className="text-base text-muted-foreground">{exercise.description}</DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {/* <h3 className="text-lg font-semibold text-foreground">Tutorials:</h3> */}
          <ul className="space-y-2">
            {exercise.youtubeLinks.map((link, index) => (
              <li key={index}>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-2"
                  asChild
                >
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    <Youtube className="mr-3 h-5 w-5 text-red-500" />
                    <span className="flex-1 truncate">{link.title}</span>
                    <ExternalLink className="ml-2 h-4 w-4 text-muted-foreground" />
                  </a>
                </Button>
              </li>
            ))}
          </ul>
           {/* <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
            <Image 
              src={`https://placehold.co/600x338.png?text=${encodeURIComponent(exercise.name)}`} 
              alt={`${exercise.name} placeholder image`}
              layout="fill"
              objectFit="cover"
              data-ai-hint="exercise fitness"
            />
          </div> */}
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose} variant="outline">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
