import { Container } from './Container';
import { BackButton } from './BackButton';
import { LAYOUT } from '../../constants';

interface PageLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  backLabel?: string;
  onBack?: () => void;
  className?: string;
}

export function PageLayout({
  children,
  showBackButton = false,
  backLabel,
  onBack,
  className = ''
}: PageLayoutProps) {
  return (
    <div className={`min-h-screen bg-background ${LAYOUT.PAGE_PADDING_TOP}`}>
      <Container className={`${LAYOUT.SECTION_PADDING_Y} ${className}`}>
        {showBackButton && <BackButton label={backLabel} onClick={onBack} />}
        {children}
      </Container>
    </div>
  );
}
