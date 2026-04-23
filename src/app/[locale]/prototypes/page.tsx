import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {STRATEGIES} from '@/lib/strategies';
import {Nav} from '@/components/Nav';
import {Footer} from '@/components/Footer';
import {GalleryCard} from '@/components/GalleryCard';

export default async function PrototypesPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('gallery');

  return (
    <>
      <Nav />
      <main>
        <section className="relative overflow-hidden border-b border-[var(--color-line)]">
          <div
            aria-hidden
            className="absolute inset-0 opacity-60"
            style={{
              background:
                'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(232,169,72,0.09), transparent 60%)'
            }}
          />
          <div aria-hidden className="absolute inset-0 zellige opacity-[0.025]" />
          <div className="relative mx-auto max-w-[1500px] px-6 lg:px-12 pt-16 md:pt-24 pb-14 md:pb-20">
            <Link
              href="/"
              className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--color-ink-muted)] hover:text-[var(--color-sun)] transition-colors inline-flex items-center gap-2"
            >
              <span className="ltr:rotate-0 rtl:rotate-180">←</span>
              {t('back')}
            </Link>

            <div className="mt-10 flex items-center gap-3 mb-6">
              <span className="block w-8 h-px bg-[var(--color-sun)]" />
              <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--color-sun)]">
                {t('kicker')}
              </span>
            </div>

            <h1 className="font-display text-[38px] md:text-[64px] lg:text-[84px] leading-[0.98] tracking-[-0.035em] max-w-[22ch]">
              {t('title')}
            </h1>
            <p className="mt-6 md:mt-8 text-[16px] md:text-[19px] leading-[1.55] text-[var(--color-ink-muted)] max-w-[62ch]">
              {t('lede')}
            </p>
          </div>
        </section>

        <section className="relative">
          <div className="mx-auto max-w-[1500px] px-6 lg:px-12 py-14 md:py-20">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
              {STRATEGIES.map((s) => (
                <GalleryCard key={s.id} strategy={s} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
