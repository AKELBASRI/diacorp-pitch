/**
 * Geographic zones — full Morocco coverage.
 *
 * The goal: split prospects into clusters that an agent can visit in a single
 * trip. Coordinates are city centroids (good enough for a planning map; the
 * per-card "Google Maps" link still does an exact name+address search).
 *
 * Zones are flat (no hierarchy) so the UI dropdown stays simple. Oriental
 * sub-zones are kept granular (4 zones) because that's our home region; the
 * rest of Morocco gets one zone per macro-region.
 */

export type ZoneKey =
  // === Oriental (home region — granular) ===
  | 'oujda'
  | 'triffa'
  | 'cote-med'
  | 'sud-minier'
  // === Rest of Morocco (macro-regions) ===
  | 'tanger-tet'
  | 'rabat-kenitra'
  | 'fes-meknes'
  | 'casablanca'
  | 'casa-sud'
  | 'beni-mellal'
  | 'marrakech-safi'
  | 'souss'
  | 'sud-saharan'
  // === Catch-all ===
  | 'multi';

export type ZoneMeta = {
  key: ZoneKey;
  label: string;
  blurb: string;
  color: string;
  /** Anchor coordinate for the day-trip Google Maps link. */
  anchor: [number, number];
  /** Approx. drive-time descriptor (subjective — agent context). */
  driveFromOujda: string;
};

export const ZONES: Record<ZoneKey, ZoneMeta> = {
  // ===== ORIENTAL =====
  oujda: {
    key: 'oujda',
    label: 'Oriental — Oujda chef-lieu',
    blurb:
      "Oujda et environs immédiats. Cluster dense — toute une journée terrain réalisable à pied + voiture.",
    color: '#e8a948',
    anchor: [34.6814, -1.9086],
    driveFromOujda: 'Local'
  },
  triffa: {
    key: 'triffa',
    label: 'Oriental — Plaine de Triffa (Berkane)',
    blurb:
      "Plaine agro-export à l'est d'Oujda. Citrus + cold chain + parc industriel Madagh. Idéal demi-journée.",
    color: '#56f0c8',
    anchor: [34.9213, -2.3197],
    driveFromOujda: '~1h00'
  },
  'cote-med': {
    key: 'cote-med',
    label: 'Oriental — Côte Méditerranée (Nador / Saïdia)',
    blurb:
      'Façade méditerranéenne. Industriel lourd à Nador/Selouane + tourisme à Saïdia. Journée pleine recommandée.',
    color: '#a18cc8',
    anchor: [35.1681, -2.9335],
    driveFromOujda: '~2h15'
  },
  'sud-minier': {
    key: 'sud-minier',
    label: 'Oriental — Sud minier',
    blurb:
      'Touissit / Jerada / Bouarfa. Mines actives + zone industrielle isolée. Trip dédié, prévoir 1–2 nuits.',
    color: '#c9824a',
    anchor: [34.4503, -1.7669],
    driveFromOujda: '~30min → ~6h'
  },

  // ===== NORD =====
  'tanger-tet': {
    key: 'tanger-tet',
    label: 'Nord — Tanger / Tétouan / Al Hoceïma',
    blurb:
      "Détroit + façade méditerranéenne ouest. Tanger Med + TFZ (Renault, Yazaki, Lear), Tétouan, Al Hoceïma. Vol Oujda→Tanger ou ~7h route.",
    color: '#7ab8f5',
    anchor: [35.7595, -5.834],
    driveFromOujda: 'vol ou ~7h'
  },
  'rabat-kenitra': {
    key: 'rabat-kenitra',
    label: 'Atlantique nord — Rabat / Salé / Kénitra',
    blurb:
      "Rabat (admin), Kénitra (Atlantic Free Zone — Stellantis, Yazaki). Couplage avec un trip Casa.",
    color: '#f5a3c7',
    anchor: [34.020, -6.840],
    driveFromOujda: 'vol ou ~6h'
  },
  'fes-meknes': {
    key: 'fes-meknes',
    label: 'Centre nord — Fès / Meknès',
    blurb:
      "Fès (cuir, ciment), Meknès (sucrerie, cimenterie, agro-export). Etape entre Oriental et Atlantique.",
    color: '#d4a373',
    anchor: [34.018, -5.008],
    driveFromOujda: '~4h30'
  },

  // ===== AXE ATLANTIQUE CENTRAL =====
  casablanca: {
    key: 'casablanca',
    label: 'Casablanca métropole',
    blurb:
      "Capitale économique. Renault SOMACA, port Casa, ArcelorMittal, Cosumar, Centrale Danone. Cœur industriel Maroc.",
    color: '#4f8cff',
    anchor: [33.5731, -7.5898],
    driveFromOujda: 'vol ou ~7h30'
  },
  'casa-sud': {
    key: 'casa-sud',
    label: 'Casa Sud — Settat / Berrechid / Khouribga / Jorf Lasfar',
    blurb:
      "Couloir industriel sud-Casa. OCP Khouribga (mines), Jorf Lasfar (plus gros hub phosphate au monde), El Jadida.",
    color: '#9b8cdb',
    anchor: [33.114, -8.622],
    driveFromOujda: 'vol+route ou ~9h'
  },

  // ===== CENTRE / SUD =====
  'beni-mellal': {
    key: 'beni-mellal',
    label: 'Centre — Béni Mellal / Khénifra',
    blurb:
      "Plaine de Tadla — sucrerie, agro, textile. Couplage possible avec Khouribga.",
    color: '#c8e676',
    anchor: [32.337, -6.350],
    driveFromOujda: '~7h'
  },
  'marrakech-safi': {
    key: 'marrakech-safi',
    label: 'Marrakech / Safi',
    blurb:
      "Tourisme Marrakech (hospitalité gourmande), industriel Safi (OCP Maroc Phosphore + cimenteries + port).",
    color: '#f08f6e',
    anchor: [31.629, -7.981],
    driveFromOujda: 'vol ou ~10h'
  },
  souss: {
    key: 'souss',
    label: 'Souss-Massa — Agadir',
    blurb:
      "Agadir + Aït Melloul. Cooperative agrumes/laitier (COPAG), pêche, conserveries, port Marsa Maroc.",
    color: '#ffd166',
    anchor: [30.428, -9.598],
    driveFromOujda: 'vol obligatoire'
  },
  'sud-saharan': {
    key: 'sud-saharan',
    label: 'Sahara — Drâa-Tafilalet / Laâyoune / Dakhla',
    blurb:
      "OCP Phosboucraâ Laâyoune, conserveries Dakhla, Ouarzazate. Trip aérien dédié.",
    color: '#e5b76a',
    anchor: [27.154, -13.203],
    driveFromOujda: 'vol obligatoire'
  },

  // ===== MULTI =====
  multi: {
    key: 'multi',
    label: 'Multi-sites / réseau',
    blurb:
      'Prospects distribués (chaînes, fédérations, réseaux). Pas de visite terrain unique — approche commerciale dédiée.',
    color: '#7c7870',
    anchor: [33.5731, -7.5898],
    driveFromOujda: '—'
  }
};

export const ZONE_ORDER: ZoneKey[] = [
  // Oriental first (home region)
  'oujda',
  'triffa',
  'cote-med',
  'sud-minier',
  // Then geographically: north → center → south
  'tanger-tet',
  'rabat-kenitra',
  'fes-meknes',
  'casablanca',
  'casa-sud',
  'beni-mellal',
  'marrakech-safi',
  'souss',
  'sud-saharan',
  // Catch-all last
  'multi'
];

/**
 * City centroids — used for the map view pins. Each prospect inherits its
 * city's coords; the map view applies a small jitter so multiple prospects in
 * the same city don't fully overlap.
 */
export const CITY_COORDS: Record<string, [number, number]> = {
  // Oriental
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

  // Nord
  Tanger: [35.7595, -5.834],
  'Tanger Med': [35.8867, -5.488],
  'Tanger TFZ': [35.7202, -5.7572],
  Tétouan: [35.5777, -5.3724],
  Tetouan: [35.5777, -5.3724],
  'Al Hoceïma': [35.2492, -3.932],
  'Al Hoceima': [35.2492, -3.932],
  Mellousa: [35.6411, -5.7231],

  // Atlantique nord
  Rabat: [34.0209, -6.8416],
  Salé: [34.0531, -6.7985],
  Sale: [34.0531, -6.7985],
  Kénitra: [34.261, -6.5802],
  Kenitra: [34.261, -6.5802],
  'Atlantic Free Zone': [34.243, -6.503],

  // Fès / Meknès
  Fès: [34.0181, -5.0078],
  Fes: [34.0181, -5.0078],
  Meknès: [33.8935, -5.5547],
  Meknes: [33.8935, -5.5547],
  'Sidi Slimane': [34.2654, -5.9259],

  // Casablanca
  Casablanca: [33.5731, -7.5898],
  'Aïn Sebaâ': [33.6047, -7.5147],
  'Ain Sebaa': [33.6047, -7.5147],
  Bouskoura: [33.4536, -7.6403],
  Mohammedia: [33.6866, -7.3829],
  Nouaceur: [33.3683, -7.5814],

  // Casa Sud
  Settat: [33.0019, -7.6175],
  Berrechid: [33.2687, -7.5878],
  Khouribga: [32.8836, -6.9054],
  'El Jadida': [33.2316, -8.5004],
  'Jorf Lasfar': [33.114, -8.6217],
  'Sidi Bennour': [32.6499, -8.4307],

  // Béni Mellal
  'Béni Mellal': [32.3373, -6.3498],
  'Beni Mellal': [32.3373, -6.3498],

  // Marrakech / Safi
  Marrakech: [31.6295, -7.9811],
  Safi: [32.2994, -9.2372],

  // Souss
  Agadir: [30.4278, -9.5981],
  'Aït Melloul': [30.3398, -9.4982],
  'Ait Melloul': [30.3398, -9.4982],
  'Aït Iaaza': [30.4106, -9.0167],
  Tarougant: [30.4106, -9.0167],

  // Sud / Sahara
  Ouarzazate: [30.9189, -6.8939],
  Errachidia: [31.9314, -4.4233],
  Laâyoune: [27.1536, -13.2033],
  Laayoune: [27.1536, -13.2033],
  Boucraâ: [26.3333, -12.7833],
  Dakhla: [23.6848, -15.958],

  // Catch-all
  'Multi-villes': [33.5731, -7.5898]
};

/** Map a city string to its zone. Falls back to 'multi' when unknown. */
export function cityZone(city: string): ZoneKey {
  const c = city.trim();

  // Multi-site / chain rows — try to detect a primary city in the string
  if (/^multi[\s-]/i.test(c)) return 'multi';

  // Slash-joined city strings: route by the first matched city anywhere.
  // Order matters — most specific first.

  // Oriental
  if (/Oujda|Taourirt/i.test(c)) return 'oujda';
  if (/Berkane|Madagh|Triffa|Aklim/i.test(c)) return 'triffa';
  if (/Nador|Beni Ensar|Selouane|Saïdia|Saidia|Marchica/i.test(c)) return 'cote-med';
  if (/Touissit|Jerada|Bouarfa|Figuig/i.test(c)) return 'sud-minier';

  // Nord
  if (/Tanger|Tétouan|Tetouan|Tanja|Mellousa|Al Hoceïma|Al Hoceima|TFZ/i.test(c))
    return 'tanger-tet';

  // Atlantique nord
  if (/Rabat|Salé|Sale\b|Kénitra|Kenitra|Atlantic Free Zone|Témara|Temara/i.test(c))
    return 'rabat-kenitra';

  // Centre nord
  if (/Fès|Fes\b|Meknès|Meknes|Sidi Slimane|Mechra/i.test(c)) return 'fes-meknes';

  // Casablanca
  if (
    /Casablanca|Aïn Sebaâ|Ain Sebaa|Bouskoura|Mohammedia|Nouaceur|Sidi Bernoussi|Tit Mellil|Ain Harrouda|Sidi Maarouf/i.test(
      c
    )
  )
    return 'casablanca';

  // Casa Sud
  if (
    /Settat|Berrechid|Khouribga|El Jadida|Jorf Lasfar|Sidi Bennour|Ben Ahmed|Youssoufia|Doukkala/i.test(
      c
    )
  )
    return 'casa-sud';

  // Béni Mellal
  if (/Béni Mellal|Beni Mellal|Khénifra|Khenifra|Tadla|Fkih Ben Salah/i.test(c))
    return 'beni-mellal';

  // Marrakech / Safi
  if (/Marrakech|Marrakesh|Safi|Essaouira|Chichaoua|El Kelaâ/i.test(c))
    return 'marrakech-safi';

  // Souss-Massa
  if (/Agadir|Aït Melloul|Ait Melloul|Aït Iaaza|Tarougant|Inezgane|Tiznit|Taroudant/i.test(c))
    return 'souss';

  // Sud / Sahara
  if (/Ouarzazate|Errachidia|Erfoud|Laâyoune|Laayoune|Boucraâ|Boucraa|Dakhla|Tan-Tan|Guelmim/i.test(c))
    return 'sud-saharan';

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
    .slice(0, 10)
    .map((n) => `${n} Maroc`)
    .join(' / ');
  const [lat, lng] = anchor;
  return `https://www.google.com/maps/search/${encodeURIComponent(q)}/@${lat},${lng},10z`;
}
