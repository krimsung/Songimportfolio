import { Mail, Linkedin as LinkedinIcon, Github as GithubIcon } from 'lucide-react';
import { XIcon } from '../icons/XIcon';
import { SOCIAL_LINKS, CONTACT_INFO, ANIMATIONS } from '../../constants';

interface SocialLinksProps {
  variant?: 'compact' | 'detailed';
  className?: string;
}

const socialConfig = [
  {
    href: `mailto:${CONTACT_INFO.email}`,
    icon: Mail,
    label: 'Email',
    display: CONTACT_INFO.email,
  },
  {
    href: SOCIAL_LINKS.linkedin.url,
    icon: LinkedinIcon,
    label: SOCIAL_LINKS.linkedin.label,
    display: SOCIAL_LINKS.linkedin.display,
  },
  {
    href: SOCIAL_LINKS.github.url,
    icon: GithubIcon,
    label: SOCIAL_LINKS.github.label,
    display: SOCIAL_LINKS.github.display,
  },
  {
    href: SOCIAL_LINKS.twitter.url,
    icon: XIcon,
    label: SOCIAL_LINKS.twitter.label,
    display: SOCIAL_LINKS.twitter.display,
  },
];

export function SocialLinks({ variant = 'compact', className = '' }: SocialLinksProps) {
  if (variant === 'compact') {
    return (
      <div className={`flex gap-6 ${className}`}>
        {socialConfig.map((social) => {
          const Icon = social.icon;
          return (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-muted-foreground hover:text-accent ${ANIMATIONS.TRANSITION.COLORS}`}
              aria-label={social.label}
            >
              <Icon className="w-5 h-5" />
            </a>
          );
        })}
      </div>
    );
  }

  // Detailed variant
  return (
    <div className={`space-y-4 ${className}`}>
      {socialConfig.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 text-muted-foreground hover:text-accent ${ANIMATIONS.TRANSITION.COLORS} group`}
          >
            <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
              <Icon className="w-5 h-5" />
            </div>
            <span>{social.display}</span>
          </a>
        );
      })}
    </div>
  );
}
