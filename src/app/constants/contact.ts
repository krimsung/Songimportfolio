/**
 * Design System - Contact Information
 * Central definition of all contact and social media links
 */

export const CONTACT_INFO = {
  email: 'contact@songim.dev',
  name: 'Song Im',
  title: 'Game Developer & Technical Artist',
} as const;

export const SOCIAL_LINKS = {
  linkedin: {
    url: 'https://www.linkedin.com/in/song-im/',
    display: 'linkedin.com/in/song-im',
    label: 'LinkedIn',
  },
  github: {
    url: 'https://github.com/songim',
    display: 'github.com/songim',
    label: 'GitHub',
  },
  twitter: {
    url: 'https://twitter.com/songim_dev',
    display: '@songim_dev',
    label: 'Twitter',
  },
} as const;

export const FORM_FIELDS = {
  NAME: 'name',
  EMAIL: 'email',
  COMPANY: 'company',
  MESSAGE: 'message',
} as const;
