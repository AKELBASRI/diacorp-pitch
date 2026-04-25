import type {ProspectStatus} from '@/db/schema';

export const STATUS_META: Record<
  ProspectStatus,
  {label: string; color: string}
> = {
  cold: {label: 'À contacter', color: '#7c7870'},
  contacted: {label: 'Contacté', color: '#e8a948'},
  meeting_scheduled: {label: 'Visite prévue', color: '#c9824a'},
  visited: {label: 'Visité', color: '#a18cc8'},
  negotiating: {label: 'En négociation', color: '#56f0c8'},
  signed: {label: 'Signé', color: '#1f8f78'},
  declined: {label: 'Pas intéressé', color: '#e5574a'}
};

const SECTOR_COLORS: Record<string, string> = {
  'Mining — lead/zinc': '#c9824a',
  'Steel rebar mill': '#a18cc8',
  Cement: '#7c7870',
  'Bricks / ceramics': '#c9824a',
  'Agri-export — citrus': '#56f0c8',
  'Agri — dairy': '#56f0c8',
  'Agri — olive oil': '#1f8f78',
  'Food processing — fish': '#56f0c8',
  'Industrial zone': '#e8a948',
  'Hospitality / leisure': '#a18cc8',
  Hospitality: '#a18cc8',
  'Tourism / development': '#a18cc8',
  'Healthcare — hospital': '#e5574a',
  Healthcare: '#e5574a',
  'Education — university': '#56f0c8',
  Education: '#56f0c8',
  'Retail — hypermarket': '#e8a948',
  'Retail — discount': '#e8a948',
  'Infrastructure — airport': '#a18cc8',
  'Utility — water': '#56f0c8',
  'Phosphate / chemicals': '#c9824a'
};

export function sectorColor(sector: string): string {
  return SECTOR_COLORS[sector] ?? '#a39e94';
}

/**
 * Build a Google Maps deep-link from name + address. Always opens in a new
 * tab; user verifies pin location themselves.
 */
export function mapsUrl(name: string, location: string): string {
  const q = encodeURIComponent(`${name}, ${location}, Morocco`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}
