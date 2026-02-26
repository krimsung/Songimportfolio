import { LAYOUT, ANIMATIONS } from '../../constants';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({
  children,
  className = '',
  hover = false,
  padding = 'lg'
}: CardProps) {
  const hoverClass = hover
    ? `hover:border-accent ${ANIMATIONS.TRANSITION.ALL} ${ANIMATIONS.DURATION_CLASS.NORMAL}`
    : '';

  return (
    <div className={`
      bg-card ${LAYOUT.RADIUS.MD} border border-border
      ${paddingClasses[padding]}
      ${hoverClass}
      ${className}
    `}>
      {children}
    </div>
  );
}
