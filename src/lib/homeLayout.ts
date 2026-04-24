/**
 * Authoritative default ordering for the homepage. The admin may override any
 * section's position via sectionSettings.order. Missing settings fall back to
 * this list.
 */
export const DEFAULT_HOME_ORDER = [
  'home.hero',
  'home.impact',
  'home.capabilities',
  'home.activities',
  'home.models',
  'home.services',
  'home.products',
  'home.projects',
  'home.track',
  'home.partners',
  'home.anchor',
  'home.loi',
  'home.team',
  'home.contact'
] as const;

export type HomeSectionKey = (typeof DEFAULT_HOME_ORDER)[number];

export const SECTION_LABEL: Record<HomeSectionKey, string> = {
  'home.hero': 'Hero banner',
  'home.impact': 'Impact strip',
  'home.capabilities': 'Why DiaCorp (4 cards)',
  'home.activities': 'Activities (segments)',
  'home.models': 'Commercial models (2 methods)',
  'home.services': 'Services summary',
  'home.products': 'Products & technologies',
  'home.projects': 'Projects pipeline',
  'home.track': 'Track record',
  'home.partners': 'Partners + marquee',
  'home.anchor': 'Anchor offtaker spotlight',
  'home.loi': 'LOI templates + CTA',
  'home.team': 'Team',
  'home.contact': 'Home contact block'
};
