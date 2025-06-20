import type { LucideIcon } from 'lucide-react';
import { Footprints, Zap, Dumbbell, Waves, Rabbit, Gift } from 'lucide-react';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  youtubeLinks: { title: string; url: string }[];
  color: string; // For radar chart series color
}

export const EXERCISES: Exercise[] = [
  {
    id: 'long_walk_run',
    name: 'Long Walk/Run',
    description: 'Build endurance - take long 90 min walks (with umbrella if required), treks, or runs. Do not forget to warm up before workout and stretch post workout.',
    icon: Footprints,
    youtubeLinks: [
    ],
    color: 'hsl(var(--chart-1))',
  },
  {
    id: 'hiit',
    name: 'HIIT',
    description: 'These are short bursts of intense exercise followed by brief recovery - to build good metabolic rate and burn calories. Do not forget to warm up before workout and stretch post workout. ',
    icon: Zap,
    youtubeLinks: [
      { title: '15 Min HIIT Workout', url: 'https://www.youtube.com/watch?v=Hhw7z3koeHs' },
      { title: '30 Min Tabata Workout', url: 'https://www.youtube.com/watch?v=FZPngnN5lEI' },
    ],
    color: 'hsl(var(--chart-2))',
  },
  {
    id: 'strength',
    name: 'Strength Exercises',
    description: 'Foundational exercises which work multiple muscle groups. Squats, push-ups, and deadlifts. Train till FAILURE i.e till you are unable to do another rep. Do not forget to warm up before workout and stretch post workout.',
    icon: Dumbbell,
    youtubeLinks: [
      { title: 'Full Body Strength Training', url: 'https://www.youtube.com/watch?v=0Cgsee5gxkA' },
      { title: 'Basic Foundational Strength Exercises', url: 'https://www.youtube.com/watch?v=H1F-UfC8Mb8' },
    ],
    color: 'hsl(var(--chart-3))',
  },
  {
    id: 'mobility_stretching',
    name: 'Mobility and Stretching',
    description: 'Primal exercises to improve range of motion, core strength, flexibility, and reduce injury risk. Do not forget to warm up before workout and stretch post workout.',
    icon: Waves,
    youtubeLinks: [
      { title: 'Animal Walks', url: 'https://www.youtube.com/watch?v=VhUkI4Jqhek' },
      { title: 'Posture Correction', url: 'https://www.youtube.com/shorts/u9OQMBPrFgI' },
    ],
    color: 'hsl(var(--chart-4))',
  },
  {
    id: 'plyometric_agility',
    name: 'Plyometric and Agility Training',
    description: 'Explosive exercises to increase power and speed. Agility drills improve coordination and ability to change direction quickly. Do not forget to warm up before workout and stretch post workout.',
    icon: Rabbit,
    youtubeLinks: [
      { title: 'Plyometrics', url: 'https://www.youtube.com/watch?v=7NJnXJ0qYeI' },
      { title: 'Agility Drills', url: 'https://www.youtube.com/watch?v=VchxPuX24HY' },
    ],
    color: 'hsl(var(--chart-5))',
  },
];

export const EXERCISE_IDS = EXERCISES.map(ex => ex.id);

export const DEFAULT_EXERCISE_COUNT = 1;
export const MIN_EXERCISE_COUNT = 1;

export const USER_N_ID = 'user_n';
export const USER_K_ID = 'user_k';
export const ADMIN_ID = 'admin';

export const USER_PASSWORDS: Record<string, string> = {
  [USER_N_ID]: 'walk-momos-g0dgirl',
  [USER_K_ID]: 'primal-coffee&me',
  [ADMIN_ID]: 'secretMessage-eggs',
};

export const LOGGED_IN_USER_COOKIE_NAME = 'exercise-equilibrium-user';

export const GiftIcon = Gift;
