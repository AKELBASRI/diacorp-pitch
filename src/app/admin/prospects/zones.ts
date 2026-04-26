/**
 * Geographic zones for the Oriental region prospects.
 *
 * The goal: split prospects into clusters that an agent can visit in a single
 * day-trip from Oujda. Coordinates are city centroids (good enough for a
 * planning map; the per-card "Google Maps" link still does an exact
 * name+address search).
 */

export type ZoneKey =
  | 'oujda'
  | 'triffa'
  | 'cote-med'
  | 'sud-minier'
  | 'multi';

export type ZoneMeta = {
  key: ZoneKey;
  label: string;
  /** Short FR description shown under the zone header. */
  blurb: string;
  /** Accent color used on the zone header chip. */
  color: string;
  /** Approximate "anchor" coordinate — useful for the day-trip Google Maps link. */
  anchor: [number, number];
  /** Approx. drive time from Oujda (one-way). */
  driveFromOujda: string;
};

export const ZONES: Record<ZoneKey, ZoneMeta> = {
  oujda: {
    key: 'oujda',
    label: 'Oujda — chef-lieu',
    blurb:
      "Oujda et environs immédiats. Cluster dense — toute une journée terrain réalisable à pied + voiture.",
    color: '#e8a948',
    anchor: [34.6814, -1.9086],
    driveFromOujda: 'Local'
  },
  triffa: {
    key: 'triffa',
    label: 'Plaine de Triffa — Berkane / Madagh',
    blurb:
      "Plaine agro-export à l'est d'Oujda. Citrus + cold chain + parc industriel Madagh. Idéal demi-journée.",
    color: '#56f0c8',
    anchor: [34.9213, -2.3197],
    driveFromOujda: '~1h00'
  },
  'cote-med': {
    key: 'cote-med',
    label: 'Côte Méditerranée — Nador / Saïdia',
    blurb:
      'Façade méditerranéenne. Industriel lourd à Nador/Selouane + tourisme à Saïdia. Journée pleine recommandée.',
    color: '#a18cc8',
    anchor: [35.1681, -2.9335],
    driveFromOujda: '~2h15'
  },
  'sud-minier': {
    key: 'sud-minier',
    label: 'Sud — ceinture minière',
    blurb:
      'Touissit / Jerada / Bouarfa. Mines actives + zone industrielle isolée. Trip dédié, prévoir 1–2 nuits.',
    color: '#c9824a',
    anchor: [34.4503, -1.7669],
    driveFromOujda: '~30min → ~6h'
  },
  multi: {
    key: 'multi',
    label: 'Multi-sites / réseau',
    blurb:
      'Prospects distribués (chaînes, fédérations, réseaux). Pas de visite terrain unique — approche commerciale dédiée.',
    color: '#7c7870',
    anchor: [34.6814, -1.9086],
    driveFromOujda: '—'
  }
};

export const ZONE_ORDER: ZoneKey[] = [
  'oujda',
  'triffa',
  'cote-med',
  'sud-minier',
  'multi'
];

/**
 * City centroids — used for the map view pins. Each prospect inherits its
 * city's coords; the map view applies a small jitter so multiple prospects in
 * the same city don't fully overlap.
 */
export const CITY_COORDS: Record<string, [number, number]> = {
  Oujda: [34.6814, -1.9086],
  Nador: [35.1681, -2.9335],
  Berkane: [34.9213, -2.3197],
  Saïdia: [35.0892, -2.2367],
  Selouane: [35.0758, -2.9269],
  'Selouane (Nador)': [35.0758, -2.9269],
  'Beni Ensar': [35.2614, -2.9344],
  'Nador / Beni Ensar': [35.2614, -2.9344],
  Bouarfa: [32.5343, -1.9646],
  Taourirt: [34.4072, -2.8978],
  Touissit: [34.4503, -1.7669],
  Jerada: [34.3104, -2.1622],
  Madagh: [34.97, -2.46],
  'Oujda / Berkane': [34.8, -2.1],
  'Multi-villes': [34.6814, -1.9086]
};

/** Map a city string to its zone. Falls back to 'multi' when unknown. */
export function cityZone(city: string): ZoneKey {
  const c = city.trim();

  // Multi-site / chain rows
  if (/^multi[\s-]/i.test(c) || c.includes('/')) {
    if (/Berkane|Madagh|Triffa/i.test(c)) return 'triffa';
    if (/Nador|Beni Ensar|Selouane|Saïdia/i.test(c)) return 'cote-med';
    if (/Touissit|Jerada|Bouarfa|Figuig/i.test(c)) return 'sud-minier';
    if (/Oujda|Taourirt/i.test(c)) return 'oujda';
    return 'multi';
  }

  if (/Oujda|Taourirt/i.test(c)) return 'oujda';
  if (/Berkane|Madagh|Triffa|Aklim/i.test(c)) return 'triffa';
  if (/Nador|Beni Ensar|Selouane|Saïdia|Marchica/i.test(c)) return 'cote-med';
  if (/Touissit|Jerada|Bouarfa|Figuig/i.test(c)) return 'sud-minier';

  return 'multi';
}

/** Coords for a city — null if we don't have a centroid for it. */
export function cityCoords(city: string): [number, number] | null {
  const direct = CITY_COORDS[city];
  if (direct) return direct;
  // Try first segment (e.g. "Nador / Beni Ensar" → "Nador")
  const first = city.split('/')[0]!.trim();
  return CITY_COORDS[first] ?? null;
}

/**
 * Build a Google Maps deep-link that does a multi-pin search for an array of
 * prospect names. Google Maps' /maps/search/ endpoint can render multiple
 * comma-separated queries as a list — perfect for "show me everything in this
 * zone" route planning.
 */
export function zoneMapsUrl(prospectNames: string[], anchor: [number, number]): string {
  const q = prospectNames
    .slice(0, 10) // keep URL reasonable; first 10 highest-priority is enough
    .map((n) => `${n} Maroc`)
    .join(' / ');
  const [lat, lng] = anchor;
  return `https://www.google.com/maps/search/${encodeURIComponent(q)}/@${lat},${lng},10z`;
}
