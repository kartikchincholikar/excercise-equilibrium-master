"use client";

import { useState, useOptimistic, useTransition } from 'react';
import type { UserExerciseData } from '@/lib/data';
import { EXERCISES, Exercise, MIN_EXERCISE_COUNT } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, MinusCircle, Info } from 'lucide-react';
import { updateExerciseCount } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { ExerciseDetailModal } from './exercise-detail-modal';

interface ExerciseControlsProps {
  initialData: UserExerciseData;
  onDataUpdate: (newData: UserExerciseData) => void;
}

export function ExerciseControls({ initialData, onDataUpdate }: ExerciseControlsProps) {
  const [isPending, startTransition] = useTransition();

  const [optimisticData, setOptimisticData] = useOptimistic(
    initialData,
    (state, { exerciseId, change }: { exerciseId: string, change: number }) => {
      const currentVal = state[exerciseId] || 0;
      const newVal = Math.max(MIN_EXERCISE_COUNT, currentVal + change);
      return { ...state, [exerciseId]: newVal };
    }
  );

  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleUpdateCount = (exerciseId: string, change: 1 | -1) => {
    const currentValue = optimisticData[exerciseId] || 0;
    if (change === -1 && currentValue <= MIN_EXERCISE_COUNT) {
      toast({
        title: 'Limit Reached',
        description: `Minimum count for an exercise is ${MIN_EXERCISE_COUNT}.`,
        variant: 'default',
      });
      return;
    }

    startTransition(async () => {
      setOptimisticData({ exerciseId, change });

      const result = await updateExerciseCount(exerciseId, change);

      if (result.success && result.newData) {
        onDataUpdate(result.newData);
        toast({
          title: 'Updated!',
          description: `${EXERCISES.find(e => e.id === exerciseId)?.name} count updated.`,
        });
      } else {
        toast({
          title: 'Update Failed',
          description: result.message || 'Could not update exercise count.',
          variant: 'destructive',
        });
        onDataUpdate(initialData);
      }
    });
  };

  const openDetailModal = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsModalOpen(true);
  };

  return (
    <>
      <Card className="mt-8 shadow-xl bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">Daily Log</CardTitle>
          <CardDescription>This tracker will help you stay consistent and sharpen all essential physical skills.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {EXERCISES.map((exercise) => (
              // **MODIFICATION 1: Responsive container for each exercise row**
              <div 
                key={exercise.id} 
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-3 bg-background/50 rounded-lg shadow"
              >
                <div className="flex items-center gap-3">
                  <exercise.icon className="h-7 w-7 flex-shrink-0" style={{ color: exercise.color }} />
                  <span className="text-lg font-medium text-foreground">{exercise.name}</span>
                </div>
                {/* **MODIFICATION 2: Responsive controls container** */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleUpdateCount(exercise.id, -1)}
                      disabled={isPending || (optimisticData[exercise.id] || 0) <= MIN_EXERCISE_COUNT}
                      aria-label={`Decrease ${exercise.name} count`}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <MinusCircle className="h-6 w-6" />
                    </Button>
                    <span className="text-xl font-bold w-8 text-center text-primary">
                      {optimisticData[exercise.id] || 0}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleUpdateCount(exercise.id, 1)}
                      disabled={isPending}
                      aria-label={`Increase ${exercise.name} count`}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <PlusCircle className="h-6 w-6" />
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => openDetailModal(exercise)}
                    disabled={isPending}
                    aria-label={`View details for ${exercise.name}`}
                  >
                    {/* **MODIFICATION 3: Responsive Button Text/Icon (Optional but Recommended)** */}
                    <Info className="h-5 w-5 sm:hidden" />
                    <span className="hidden sm:inline">Tutorial</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <ExerciseDetailModal
        exercise={selectedExercise}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}