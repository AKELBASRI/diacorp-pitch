import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Nav} from '@/components/Nav';
import {Footer} from '@/components/Footer';
import {ContactForm} from '@/components/contact/ContactForm';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'contactPage.meta'});
  return {title: t('title'), description: t('description')};
}

export default async function ContactPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contactPage');

  const asideRows = [
    {key: 'hq', labelKey: 'hqTitle'},
    {key: 'ops', labelKey: 'opsTitle'},
    {key: 'regional', labelKey: 'regionalTitle'},
    {key: 'email', labelKey: 'emailTitle'},
    {key: 'phone', labelKey: 'phoneTitle'},
    {key: 'hours', labelKey: 'hoursTitle'}
  ] as const;

  return (
    <>
      <Nav />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-[var(--color-line)]">
          <div
            aria-hidden
            className="absolute inset-0 opacity-50"
            style={{
              background:
                'radial-gradient(ellipse 80% 55% at 20% 0%, rgba(232,169,72,0.12), transparent 60%)'
            }}
          />
          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12 pt-16 pb-14 lg:pt-24 lg:pb-20">
            <div className="max-w-[820px]">
              <div className="flex items-center gap-3 mb-10 rise">
                <span className="block w-10 h-px bg-[var(--color-sun)]" />
                <span className="font-mono text-[11px] tracking-[0.24em] uppercase text-[var(--color-sun)]">
                  {t('hero.kicker')}
                </span>
              </div>
              <h1
                className="font-display text-[48px] sm:text-[72px] lg:text-[96px] leading-[0.98] tracking-[-0.035em] rise"
                style={{animationDelay: '120ms'}}
              >
                {t('hero.title')}
              </h1>
              <p
                className="mt-8 lg:mt-10 text-[17px] lg:text-[19px] leading-[1.6] text-[var(--color-ink)]/85 max-w-[62ch] rise"
                style={{animationDelay: '280ms'}}
              >
                {t('hero.sub')}
              </p>
            </div>
          </div>
        </section>

        {/* FORM + ASIDE */}
        <section className="relative">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              <div className="lg:col-span-7">
                <ContactForm />
              </div>

              <aside className="lg:col-span-5 lg:col-start-9">
                <div className="border border-[var(--color-line)] bg-[var(--color-bg-elev)]/50 p-8 lg:p-10">
                  <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-sun)] mb-6">
                    {t('aside.kicker')}
                  </div>
                  <dl className="space-y-5">
                    {asideRows.map((r, i) => (
                      <div
                        key={r.key}
                        className={`${
                          i > 0 ? 'pt-5 border-t border-[var(--color-line)]' : ''
                        }`}
                      >
                        <dt className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-ink-faint)] mb-1.5">
                          {t(`aside.${r.labelKey}`)}
                        </dt>
                        <dd className="text-[14px] leading-relaxed text-[var(--color-ink)] whitespace-pre-line">
                          {r.key === 'email' ? (
                            <a
                              href={`mailto:${t('aside.email')}`}
                              className="text-[var(--color-sun)] hover:underline"
                            >
                              {t('aside.email')}
                            </a>
                          ) : (
                            t(`aside.${r.key}`)
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
