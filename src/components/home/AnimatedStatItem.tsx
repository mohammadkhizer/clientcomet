
"use client";

import type { LucideIcon } from 'lucide-react';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';
import { FadeIn } from '@/components/motion/fade-in';
import { getIconComponent } from '@/lib/iconUtils'; // Import the utility

interface AnimatedStatItemProps {
  valueString: string;
  title: string;
  iconName: string; // Changed from Icon: LucideIcon to iconName: string
  delay?: number;
}

export function AnimatedStatItem({ valueString, title, iconName, delay = 0 }: AnimatedStatItemProps) {
  const { animatedValue, suffix } = useAnimatedCounter(valueString, 2000);
  const ActualIcon = getIconComponent(iconName); // Get the actual icon component

  return (
    <FadeIn delay={delay}>
      <div className="flex flex-col items-center text-center p-4 transition-transform duration-300 hover:scale-105">
        <div className="mb-3 rounded-full bg-primary/10 p-4 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
          {ActualIcon && <ActualIcon className="h-10 w-10 md:h-12 md:w-12" />}
        </div>
        <p className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
          {animatedValue}{suffix}
        </p>
        <p className="mt-1 text-base md:text-lg font-medium text-muted-foreground">{title}</p>
      </div>
    </FadeIn>
  );
}
