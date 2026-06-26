export type SiteNavLink = {
  label: string;
  to: string;
};

export const SITE_NAV_LINKS: SiteNavLink[] = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/#about' },
  { label: 'Our Achievements', to: '/#achievements' },
  { label: 'Exco', to: '/#exco' },
  { label: 'Contact Us', to: '/#contact' },
];
