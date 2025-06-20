"use client";

import { useState, useEffect } from 'react';
import type { Gift } from '@/lib/data';
import { GiftIcon } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion'; // For animations
import { markGiftAsRead } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

interface GiftBoxDisplayProps {
  initialGift: Gift | null;
}

export function GiftBoxDisplay({ initialGift }: GiftBoxDisplayProps) {
  const [gift, setGift] = useState<Gift | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Only set the gift if it's new and unread
    if (initialGift && !initialGift.isRead) {
      setGift(initialGift);
    } else {
      setGift(null); // Clear if read or no gift
    }
  }, [initialGift]);
  
  const openGift = () => {
    if (gift) {
      setIsModalOpen(true);
    }
  };

  const closeGiftAndMarkAsRead = async () => {
    setIsModalOpen(false);
    if (gift) {
      const result = await markGiftAsRead();
      if (result.success) {
        setGift(null); // Remove gift from display after marking as read
        toast({ title: "Gift Opened!", description: "Hope you liked your surprise!" });
      } else {
        toast({ title: "Error", description: "Could not mark gift as read.", variant: "destructive" });
      }
    }
  };

  if (!gift) {
    return null; // Don't render anything if there's no unread gift
  }

  return (
    <>
      <AnimatePresence>
        {gift && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={openGift}
              variant="default"
              size="lg"
              className="rounded-full p-4 shadow-2xl bg-accent hover:bg-accent/90 text-accent-foreground animate-pulse"
              aria-label="Open your secret gift"
            >
              <GiftIcon className="h-8 w-8 mr-2" />
              You have a gift!
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={isModalOpen} onOpenChange={ (open) => { if (!open) closeGiftAndMarkAsRead(); else setIsModalOpen(open); } }>
        <DialogContent className="sm:max-w-md bg-card shadow-xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <GiftIcon className="h-8 w-8 text-accent" />
              <DialogTitle className="text-2xl font-headline text-accent">A Gift For You!</DialogTitle>
            </div>
          </DialogHeader>
          <Card className="border-accent bg-background/50">
            <CardContent className="p-6">
              <DialogDescription className="text-lg text-foreground whitespace-pre-wrap">
                {gift?.message}
              </DialogDescription>
            </CardContent>
          </Card>
          <DialogFooter className="mt-4">
            <Button onClick={closeGiftAndMarkAsRead} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Awesome! Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
