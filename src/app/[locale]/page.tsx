import {setRequestLocale} from 'next-intl/server';
import {inArray} from 'drizzle-orm';
import {Nav} from '@/components/Nav';
import {Footer} from '@/components/Footer';
import {HomeHero} from '@/components/home/HomeHero';
import {ImpactStrip} from '@/components/home/ImpactStrip';
import {Capabilities} from '@/components/home/Capabilities';
import {HowItWorks} from '@/components/home/HowItWorks';
import {Activities} from '@/components/home/Activities';
import {Models} from '@/components/home/Models';
import {Services} from '@/components/home/Services';
import {Products} from '@/components/home/Products';
import {Projects} from '@/components/home/Projects';
import {TrackRecord} from '@/components/home/TrackRecord';
import {Partners} from '@/components/home/Partners';
import {AnchorLoi} from '@/components/home/AnchorLoi';
import {LOISection} from '@/components/home/LOISection';
import {Team} from '@/components/Team';
import {HomeContact} from '@/components/home/HomeContact';
import {getSiteSettings} from '@/lib/settings';
import {
  DEFAULT_HOME_ORDER,
  type HomeSectionKey
} from '@/lib/homeLayout';
import {db} from '@/db/client';
import {
  sectionSettings,
  DEFAULT_SECTION_SETTINGS,
  type SectionSettingsData
} from '@/db/schema';

export const dynamic = 'force-dynamic';

const COMPONENTS: Record<HomeSectionKey, () => Promise<React.ReactElement>> = {
  'home.hero': HomeHero,
  'home.impact': ImpactStrip,
  'home.capabilities': Capabilities,
  'home.howItWorks': HowItWorks,
  'home.activities': Activities,
  'home.models': Models,
  'home.services': Services,
  'home.products': Products,
  'home.projects': Projects,
  'home.track': TrackRecord,
  'home.partners': Partners,
  'home.anchor': AnchorLoi,
  'home.loi': LOISection,
  'home.team': Team,
  'home.contact': HomeContact
};

export default async function HomePage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const [siteSettings, rawSectionSettings] = await Promise.all([
    getSiteSettings(),
    db
      .select()
      .from(sectionSettings)
      .where(inArray(sectionSettings.key, [...DEFAULT_HOME_ORDER]))
      .catch(() => [])
  ]);

  const settingsMap = new Map<string, SectionSettingsData>();
  for (const r of rawSectionSettings) {
    settingsMap.set(r.key, {
      ...DEFAULT_SECTION_SETTINGS,
      ...((r.data ?? {}) as Partial<SectionSettingsData>)
    });
  }

  // Build ordered list of visible sections, respecting per-section order with
  // a default-index fallback.
  const ordered = DEFAULT_HOME_ORDER.map((key, defaultIdx) => {
    const s = settingsMap.get(key) ?? DEFAULT_SECTION_SETTINGS;
    return {
      key,
      visible: s.visible,
      order: s.order ?? defaultIdx
    };
  })
    .filter((s) => {
      if (!s.visible) return false;
      // Site-wide toggles still win.
      if (s.key === 'home.impact' && !siteSettings.showImpactStrip) return false;
      if (s.key === 'home.anchor' && !siteSettings.showAnchorLoi) return false;
      return true;
    })
    .sort((a, b) => a.order - b.order);

  return (
    <>
      <Nav />
      <main>
        {ordered.map(({key}) => {
          const C = COMPONENTS[key];
          return C ? <C key={key} /> : null;
        })}
      </main>
      <Footer />
    </>
  );
}
