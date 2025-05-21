
import { Code, Smartphone, Brain, Search, Cloud, ShieldCheck, type LucideIcon } from 'lucide-react';

export const iconMap: Record<string, LucideIcon> = {
  Code,
  Smartphone,
  Brain,
  Search,
  Cloud,
  ShieldCheck,
};

export const availableIcons: ReadonlyArray<keyof typeof iconMap> = Object.keys(iconMap) as Array<keyof typeof iconMap>;

export const getIconComponent = (iconName?: string): LucideIcon => {
  if (iconName && iconMap[iconName]) {
    return iconMap[iconName];
  }
  return Code; // Default icon
};
