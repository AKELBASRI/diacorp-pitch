/**
 * Human-readable labels + helper hints for the common keys used across i18n
 * sections. Keys are matched by leaf name (e.g. "title", "sub") and also by
 * dotted path when a more specific match exists (e.g. "items[0].badge").
 *
 * The dictionary is intentionally sparse — anything not matched falls back
 * to a titleised key name.
 */
export type FieldMeta = {
  label: string;
  hint?: string;
};

// Leaf-key defaults (applied when the path leaf matches).
const LEAF: Record<string, FieldMeta> = {
  // Hierarchy
  kicker: {label: 'Eyebrow (top line)', hint: 'Short uppercase tag above the title. Keep under 40 chars.'},
  title: {label: 'Title', hint: 'Main headline. Line breaks (\\n) render as visual line wraps.'},
  sub: {label: 'Subtitle / lead', hint: 'One-paragraph introduction under the title. 1–3 sentences.'},
  body: {label: 'Body', hint: 'Full paragraph content.'},
  tagline: {label: 'Tagline', hint: 'Short sentence positioned under a logo or name.'},
  subtitle: {label: 'Subtitle', hint: 'Secondary line.'},
  pitch: {label: 'Pitch paragraph', hint: 'The selling paragraph — what this is and why it matters.'},
  note: {label: 'Footnote / disclaimer'},
  footnote: {label: 'Footnote', hint: 'Legal or small-print note shown at the bottom of the section.'},
  description: {label: 'Description', hint: 'Longer narrative description.'},
  eyebrow: {label: 'Eyebrow', hint: 'Small label above the title.'},

  // CTA fields
  cta: {label: 'Call-to-action label', hint: 'Text shown on the main button.'},
  ctaLoi: {label: 'Primary CTA (LOI)', hint: 'Button text that sends users to the LOI registration flow.'},
  ctaScroll: {label: 'Secondary CTA (scroll)', hint: 'Button that scrolls to the activities section.'},
  ctaTitle: {label: 'CTA title'},
  ctaBody: {label: 'CTA body'},
  ctaLabel: {label: 'CTA label'},
  ctaToLoi: {label: 'Button → LOI'},
  ctaToRegister: {label: 'Button → Register'},
  ctaLink: {label: 'CTA link URL'},
  downloadCta: {label: 'Download button label'},
  downloadMeta: {label: 'Download file meta', hint: 'Format / size / page count shown under the download button.'},
  backCta: {label: 'Back button label'},
  helpCta: {label: 'Help link label'},

  // Meta / SEO
  meta: {label: 'Meta'},
  name: {label: 'Name'},
  email: {label: 'Email address'},
  phone: {label: 'Phone number'},
  emailTitle: {label: 'Email — heading'},
  phoneTitle: {label: 'Phone — heading'},
  emailValue: {label: 'Email value'},
  address: {label: 'Address'},
  hq: {label: 'Headquarters address'},
  ops: {label: 'Operations address'},
  regional: {label: 'Regional office'},
  hours: {label: 'Business hours'},
  hoursTitle: {label: 'Business hours — heading'},

  // Status
  status: {label: 'Status'},
  statusLabel: {label: 'Status label'},
  statusValue: {label: 'Status value'},
  badge: {label: 'Badge text', hint: 'Short badge rendered near the title (stamp-style).'},
  code: {label: 'Code / reference'},

  // Lists
  items: {label: 'Items'},
  features: {label: 'Feature bullets', hint: 'Bullet list — one short line per feature.'},
  advantages: {label: 'Advantages', hint: 'List of short benefit lines.'},
  steps: {label: 'Steps', hint: 'Sequential steps — order matters.'},
  pillars: {label: 'Pillars'},
  roadmap: {label: 'Roadmap phases'},
  brands: {label: 'Brand chips'},
  names: {label: 'Names'},
  options: {label: 'Options'},
  categories: {label: 'Categories'},
  columns: {label: 'Columns'},
  labels: {label: 'Labels'},
  groups: {label: 'Groups'},
  nav: {label: 'Navigation'},
  footer: {label: 'Footer'},

  // Roles / people
  role: {label: 'Role'},
  scope: {label: 'Scope'},
  sector: {label: 'Sector'},
  industry: {label: 'Industry'},
  location: {label: 'Location'},
  capacity: {label: 'Capacity'},
  year: {label: 'Year'},
  phase: {label: 'Phase'},
  window: {label: 'Timeframe'},
  founders: {label: 'Founders'},
  foundersLabel: {label: 'Founders — label'},
  signatory: {label: 'Signatory'},
  signatoryLabel: {label: 'Signatory — label'},
  date: {label: 'Date'},
  dateLabel: {label: 'Date — label'},
  quote: {label: 'Quote'},
  quoteEyebrow: {label: 'Quote — eyebrow'},
  client: {label: 'Client'},

  // Anchor-offtaker / references specifics
  hub: {label: 'Hub name'},
  hubLabel: {label: 'Hub — label'},
  export: {label: 'Export markets'},
  exportLabel: {label: 'Export — label'},
  demand: {label: 'Demand'},
  demandLabel: {label: 'Demand — label'},
  scopeLabel: {label: 'Scope — label'},
  hqLabel: {label: 'HQ — label'},
  crops: {label: 'Crops / products'},
  cropsLabel: {label: 'Crops — label'},
  sectorLabel: {label: 'Sector — label'},
  bestFor: {label: 'Best for', hint: 'Ideal customer profile for this option.'},
  flow: {label: 'Flow diagram label'},

  // Register wizard
  brand: {label: 'Brand text'},
  intro: {label: 'Intro block'},
  back: {label: 'Back label'},
  finish: {label: 'Finish label'},
  prev: {label: 'Previous'},
  next: {label: 'Next'},
  stepOf: {label: 'Step-of pattern', hint: 'Use {current} and {total} placeholders.'},
  submit: {label: 'Submit button'},
  confidential: {label: 'Confidential footer text'},
  version: {label: 'Version tag'},

  // Home.loi
  industryTitle: {label: 'Industry template — title'},
  industryBody: {label: 'Industry template — body'},
  industryCta: {label: 'Industry template — CTA'},
  agroTitle: {label: 'Agro template — title'},
  agroBody: {label: 'Agro template — body'},
  agroCta: {label: 'Agro template — CTA'},
  help: {label: 'Help line'},
  onlineKicker: {label: 'Online LOI — eyebrow'},
  onlineTitle: {label: 'Online LOI — title'},
  onlineBody: {label: 'Online LOI — body'},
  onlineCta: {label: 'Online LOI — CTA'},

  // Positioning / strategies shared
  diacorp: {label: 'DiaCorp row value'},
  onee: {label: 'ONEE row value'},

  // Catch-all numeric
  n: {label: 'Number'},
  num: {label: 'Number'},

  // Feature metadata
  deliverables: {label: 'Deliverables'},
  typical: {label: 'Typical / duration'},

  // Team + partners
  photo: {label: 'Photo URL'},
  logo: {label: 'Logo abbreviation'},

  // Home.partners / products
  epc: {label: 'EPC & O&M'},
  finance: {label: 'Financing'},
  panels: {label: 'Panels'},
  inverters: {label: 'Inverters'},
  institutional: {label: 'Institutional'},

  // Stats
  stat1: {label: 'Stat 1 — label'}, stat1v: {label: 'Stat 1 — value'},
  stat2: {label: 'Stat 2 — label'}, stat2v: {label: 'Stat 2 — value'},
  stat3: {label: 'Stat 3 — label'}, stat3v: {label: 'Stat 3 — value'},
  stat4: {label: 'Stat 4 — label'}, stat4v: {label: 'Stat 4 — value'}
};

export function fieldMeta(path: string): FieldMeta {
  // Try dotted-path match first, else leaf key.
  const leaf = path.split(/[\].]/).filter(Boolean).pop() ?? path;
  return (
    LEAF[path] ??
    LEAF[leaf] ?? {
      label: prettyKey(leaf)
    }
  );
}

function prettyKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]+/g, ' ')
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
}
