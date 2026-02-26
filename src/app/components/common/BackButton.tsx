import { ArrowLeft } from 'lucide-react';
import { ANIMATIONS } from '../../constants';

interface BackButtonProps {
  href?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
}

export function BackButton({
  href = '#/',
  onClick,
  label = 'Back to Home',
  className = ''
}: BackButtonProps) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // Allow browser default for modifier keys or middle click
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button === 1) {
      return;
    }
    event.preventDefault();
    onClick?.();
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`inline-flex items-center gap-2 text-accent hover:text-accent/90 ${ANIMATIONS.TRANSITION.COLORS} mb-8 group ${className}`}
    >
      <ArrowLeft className={`w-5 h-5 ${ANIMATIONS.HOVER.TRANSLATE_X} ${ANIMATIONS.TRANSITION.TRANSFORM} ${ANIMATIONS.DURATION_CLASS.NORMAL}`} />
      <span>{label}</span>
    </a>
  );
}
