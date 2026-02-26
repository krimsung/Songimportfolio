import { TYPOGRAPHY } from '../../constants';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  centered = true,
  className = ''
}: SectionHeaderProps) {
  const alignClass = centered ? 'text-center' : '';

  return (
    <div className={`mb-12 ${alignClass} ${className}`}>
      <h2 className={`${TYPOGRAPHY.HEADING.H2} ${TYPOGRAPHY.COLOR.PRIMARY} mb-4`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`${TYPOGRAPHY.BODY.LG} ${TYPOGRAPHY.COLOR.SECONDARY}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
