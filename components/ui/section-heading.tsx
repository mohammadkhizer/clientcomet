import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeading({ 
  title, 
  subtitle, 
  centered = false, 
  className 
}: SectionHeadingProps) {
  return (
    <div className={cn(
      "mb-10 md:mb-16", 
      centered && "text-center",
      className
    )}>
      <h2 className="heading-2 gradient-text mb-4">{title}</h2>
      {subtitle && <p className="body-text text-muted-foreground max-w-3xl">{subtitle}</p>}
    </div>
  );
}