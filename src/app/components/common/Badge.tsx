import { LucideIcon } from 'lucide-react';
import { LAYOUT, TYPOGRAPHY } from '../../constants';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'info';
  icon?: LucideIcon;
  className?: string;
}

const variantClasses = {
  default: 'bg-muted/20 border-muted/40 text-muted-foreground',
  accent: 'bg-accent/10 border-accent/30 text-accent',
  success: 'bg-[var(--status-success)]/20 border-[var(--status-success)]/40 text-[var(--status-success)]',
  warning: 'bg-[var(--status-warning)]/20 border-[var(--status-warning)]/40 text-[var(--status-warning)]',
  info: 'bg-[var(--status-info)]/20 border-[var(--status-info)]/40 text-[var(--status-info)]',
};

export function Badge({
  children,
  variant = 'default',
  icon: Icon,
  className = ''
}: BadgeProps) {
  return (
    <span className={`
      inline-flex items-center gap-1 px-2 py-1
      ${LAYOUT.RADIUS.SM} border
      ${TYPOGRAPHY.BODY.XS}
      ${variantClasses[variant]}
      ${className}
    `}>
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
}
