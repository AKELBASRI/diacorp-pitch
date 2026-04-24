'use client';

import {useState, useMemo} from 'react';
import {useTranslations, useLocale} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {
  generateLoiPdf,
  triggerDownload,
  buildMailto,
  type LoiData,
  type LoiLocale
} from '@/lib/generateLoi';

type Activity = 'industry' | 'agro' | 'zone' | 'other';

type FormState = {
  activity: Activity | '';
  company: string;
  ice: string;
  city: string;
  industry: string;
  mw: number;
  hoursPerDay: number;
  coldStorage: boolean;
  cbam: boolean;
  years: number;
  name: string;
  role: string;
  email: string;
  phone: string;
};

const INITIAL: FormState = {
  activity: '',
  company: '',
  ice: '',
  city: '',
  industry: '',
  mw: 5,
  hoursPerDay: 16,
  coldStorage: false,
  cbam: false,
  years: 15,
  name: '',
  role: '',
  email: '',
  phone: ''
};

const ACTIVITY_TINTS: Record<Activity, string> = {
  industry: '32 88% 60%',
  agro: '96 55% 55%',
  zone: '24 80% 62%',
  other: '220 20% 60%'
};

export function RegisterForm() {
  const t = useTranslations('register');
  const locale = useLocale() as LoiLocale;
  const [step, setStep] = useState(0);
  const [state, setState] = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState<{
    pdfBytes: Uint8Array;
    mailto: string;
  } | null>(null);
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const errors = useMemo(() => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (step === 0 && !state.activity) e.activity = t('errors.required');
    if (step === 1) {
      if (!state.company) e.company = t('errors.required');
      if (!state.city) e.city = t('errors.required');
      if (state.ice && !/^\d{15}$/.test(state.ice))
        e.ice = t('errors.invalidIce');
    }
    if (step === 3) {
      if (!state.name) e.name = t('errors.required');
      if (!state.role) e.role = t('errors.required');
      if (!state.email) e.email = t('errors.required');
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email))
        e.email = t('errors.invalidEmail');
      if (!state.phone) e.phone = t('errors.required');
    }
    return e;
  }, [step, state, t]);

  const canNext = Object.keys(errors).length === 0;

  const show = (field: keyof FormState) =>
    touched.has(field) && errors[field];

  const mark = (field: keyof FormState) =>
    setTouched((prev) => new Set(prev).add(field));

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((s) => ({...s, [key]: value}));
  }

  async function submit() {
    if (!state.activity) return;
    const data: LoiData = {...state, activity: state.activity as Activity};
    const bytes = await generateLoiPdf(data, locale);
    const filename = `LOI_${data.company.replace(/\s+/g, '_')}_${data.mw}MW.pdf`;
    triggerDownload(bytes, filename);
    setSubmitted({pdfBytes: bytes, mailto: buildMailto(data, locale)});
  }

  if (submitted) {
    return <SuccessView
      data={state}
      onDownload={() => {
        const data: LoiData = {...state, activity: state.activity as Activity};
        generateLoiPdf(data, locale).then(b => triggerDownload(b, `LOI_${data.company.replace(/\s+/g, '_')}.pdf`));
      }}
      mailto={submitted.mailto}
      t={t}
    />;
  }

  const totalSteps = 5;
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-[var(--color-bg)]/92 backdrop-blur-xl border-b border-[var(--color-line)]">
        <div className="max-w-[960px] mx-auto px-6 lg:px-10 flex items-center justify-between h-14">
          <Link
            href="/"
            className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-ink-muted)] hover:text-[var(--color-sun)] transition-colors inline-flex items-center gap-2"
          >
            <span className="ltr:rotate-0 rtl:rotate-180">←</span>
            {t('back')}
          </Link>
          <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-sun)] glow-pulse" />
            <span className="text-[var(--color-ink)]">{t('brand')}</span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-[3px] bg-[var(--color-bg-elev)]">
          <div
            className="h-full bg-[var(--color-sun)] transition-[width] duration-500 ease-out"
            style={{width: `${progress}%`}}
          />
        </div>
      </header>

      <main className="flex-1 max-w-[960px] mx-auto w-full px-6 lg:px-10 py-10 lg:py-16">
        {/* Intro (only on step 0) */}
        {step === 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-10 h-px bg-[var(--color-sun)]" />
              <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--color-sun)]">
                {t('intro.kicker')}
              </span>
            </div>
            <h1 className="font-display text-[40px] lg:text-[64px] leading-[1.02] tracking-[-0.03em] mb-6">
              {t('intro.title')}
            </h1>
            <p className="text-[16px] lg:text-[18px] leading-[1.55] text-[var(--color-ink-muted)] max-w-[58ch]">
              {t('intro.body')}
            </p>
          </div>
        )}

        {/* Stepper */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-3 mb-8 lg:mb-12">
          {[0, 1, 2, 3, 4].map((i) => {
            const done = i < step;
            const active = i === step;
            return (
              <div key={i} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => i < step && setStep(i)}
                  disabled={i > step}
                  aria-current={active ? 'step' : undefined}
                  className={`flex items-center gap-2 px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] uppercase border transition-colors ${
                    active
                      ? 'bg-[var(--color-sun)] text-[var(--color-bg)] border-[var(--color-sun)]'
                      : done
                      ? 'border-[var(--color-sun)]/40 text-[var(--color-sun)] hover:bg-[var(--color-sun)]/10'
                      : 'border-[var(--color-line)] text-[var(--color-ink-faint)]'
                  } ${i > step ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span className="num">{i + 1}</span>
                  <span>{t(`steps.${i}`)}</span>
                  {done && <span>✓</span>}
                </button>
                {i < 4 && (
                  <span
                    className={`block w-4 h-px ${
                      done ? 'bg-[var(--color-sun)]/60' : 'bg-[var(--color-line)]'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step content */}
        <div key={step} className="reveal-fade">
          {step === 0 && (
            <Step1
              state={state}
              onPick={(v) => {
                update('activity', v);
              }}
            />
          )}
          {step === 1 && (
            <Step2
              state={state}
              update={update}
              mark={mark}
              err={show as (k: keyof FormState) => string | undefined}
            />
          )}
          {step === 2 && <Step3 state={state} update={update} />}
          {step === 3 && (
            <Step4
              state={state}
              update={update}
              mark={mark}
              err={show as (k: keyof FormState) => string | undefined}
            />
          )}
          {step === 4 && <Step5 state={state} />}
        </div>

        {/* Nav */}
        <div className="mt-10 lg:mt-14 flex items-center justify-between border-t border-[var(--color-line)] pt-6">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-2 px-5 py-3 font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="ltr:rotate-0 rtl:rotate-180">←</span>
            {t('nav.prev')}
          </button>

          <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-[var(--color-ink-faint)]">
            {t('nav.stepOf', {current: step + 1, total: totalSteps})}
          </div>

          {step < 4 ? (
            <button
              type="button"
              onClick={() => {
                // Mark all current-step fields as touched
                if (step === 1)
                  ['company', 'ice', 'city'].forEach((f) =>
                    mark(f as keyof FormState)
                  );
                if (step === 3)
                  ['name', 'role', 'email', 'phone'].forEach((f) =>
                    mark(f as keyof FormState)
                  );
                if (canNext) setStep((s) => Math.min(4, s + 1));
              }}
              disabled={!canNext}
              className="inline-flex items-center gap-2 px-7 py-3 font-mono text-[11px] tracking-[0.16em] uppercase bg-[var(--color-sun)] text-[var(--color-bg)] hover:bg-[var(--color-ink)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {t('nav.next')}
              <span className="ltr:rotate-0 rtl:rotate-180">→</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              className="inline-flex items-center gap-2 px-7 py-3 font-mono text-[11px] tracking-[0.16em] uppercase bg-[var(--color-sun)] text-[var(--color-bg)] hover:bg-[var(--color-ink)] transition-colors"
            >
              {t('step5.generate')}
              <span>↓</span>
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

// ================== STEPS ==================

function Step1({
  state,
  onPick
}: {
  state: FormState;
  onPick: (a: Activity) => void;
}) {
  const t = useTranslations('register.step1');
  const opts: Activity[] = ['industry', 'agro', 'zone', 'other'];
  return (
    <div>
      <StepHeader title={t('title')} sub={t('sub')} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {opts.map((o) => {
          const active = state.activity === o;
          return (
            <button
              key={o}
              type="button"
              onClick={() => onPick(o)}
              className={`group text-left border p-5 lg:p-6 transition-all ${
                active
                  ? 'border-[var(--color-sun)] bg-[var(--color-sun)]/5'
                  : 'border-[var(--color-line)] hover:border-[var(--color-line-strong)]'
              }`}
              style={
                active
                  ? ({['--act' as string]: `hsl(${ACTIVITY_TINTS[o]})`} as React.CSSProperties)
                  : undefined
              }
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-9 h-9 border border-current flex items-center justify-center"
                  style={{
                    color: active
                      ? `hsl(${ACTIVITY_TINTS[o]})`
                      : 'var(--color-ink-faint)'
                  }}
                >
                  <ActivityIcon type={o} />
                </div>
                {active && (
                  <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--color-sun)]">
                    ✓
                  </span>
                )}
              </div>
              <div className="font-display text-[22px] leading-tight tracking-tight mb-1">
                {t(`options.${o}.label`)}
              </div>
              <div className="text-[13px] text-[var(--color-ink-muted)] leading-relaxed">
                {t(`options.${o}.note`)}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ActivityIcon({type}: {type: Activity}) {
  const p = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const
  };
  switch (type) {
    case 'industry':
      return <svg {...p}><path d="M3 21h18M5 21V9l5 3V9l5 3V9l4 2.5V21" /></svg>;
    case 'agro':
      return <svg {...p}><path d="M12 21v-7M12 14c-4 0-6-3-6-6 3 0 6 2 6 6ZM12 14c4 0 6-3 6-6-3 0-6 2-6 6Z" /></svg>;
    case 'zone':
      return <svg {...p}><rect x="3" y="11" width="7" height="10" /><rect x="14" y="7" width="7" height="14" /></svg>;
    case 'other':
      return <svg {...p}><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></svg>;
  }
}

function Step2({
  state,
  update,
  mark,
  err
}: {
  state: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  mark: (k: keyof FormState) => void;
  err: (k: keyof FormState) => string | undefined;
}) {
  const t = useTranslations('register.step2');
  return (
    <div>
      <StepHeader title={t('title')} sub={t('sub')} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field
          label={t('fields.company')}
          value={state.company}
          onChange={(v) => update('company', v)}
          onBlur={() => mark('company')}
          placeholder={t('fields.companyPlaceholder')}
          error={err('company')}
          colSpan="md:col-span-2"
          required
        />
        <Field
          label={t('fields.ice')}
          value={state.ice}
          onChange={(v) => update('ice', v.replace(/\D/g, '').slice(0, 15))}
          onBlur={() => mark('ice')}
          placeholder={t('fields.icePlaceholder')}
          error={err('ice')}
          mono
        />
        <Field
          label={t('fields.city')}
          value={state.city}
          onChange={(v) => update('city', v)}
          onBlur={() => mark('city')}
          placeholder={t('fields.cityPlaceholder')}
          error={err('city')}
          required
        />
        <Field
          label={t('fields.industry')}
          value={state.industry}
          onChange={(v) => update('industry', v)}
          placeholder={t('fields.industryPlaceholder')}
          colSpan="md:col-span-2"
        />
      </div>
    </div>
  );
}

function Step3({
  state,
  update
}: {
  state: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  const t = useTranslations('register.step3');
  return (
    <div>
      <StepHeader title={t('title')} sub={t('sub')} />
      <div className="space-y-8">
        <Slider
          label={t('fields.mw')}
          value={state.mw}
          onChange={(v) => update('mw', v)}
          min={1}
          max={300}
          suffix={t('fields.mwSuffix')}
          markers={[1, 50, 100, 150, 200, 300]}
          big
        />

        <Slider
          label={t('fields.hours')}
          value={state.hoursPerDay}
          onChange={(v) => update('hoursPerDay', v)}
          min={4}
          max={24}
          suffix={t('fields.hoursSuffix')}
          markers={[4, 8, 12, 16, 20, 24]}
        />

        <Slider
          label={t('fields.duration')}
          value={state.years}
          onChange={(v) => update('years', v)}
          min={5}
          max={25}
          suffix={t('years')}
          markers={[5, 10, 15, 20, 25]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-[var(--color-line)]">
          <Checkbox
            label={t('fields.coldStorage')}
            checked={state.coldStorage}
            onChange={(v) => update('coldStorage', v)}
          />
          <Checkbox
            label={t('fields.cbam')}
            checked={state.cbam}
            onChange={(v) => update('cbam', v)}
          />
        </div>
      </div>
    </div>
  );
}

function Step4({
  state,
  update,
  mark,
  err
}: {
  state: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  mark: (k: keyof FormState) => void;
  err: (k: keyof FormState) => string | undefined;
}) {
  const t = useTranslations('register.step4');
  return (
    <div>
      <StepHeader title={t('title')} sub={t('sub')} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field
          label={t('fields.name')}
          value={state.name}
          onChange={(v) => update('name', v)}
          onBlur={() => mark('name')}
          error={err('name')}
          required
        />
        <Field
          label={t('fields.role')}
          value={state.role}
          onChange={(v) => update('role', v)}
          onBlur={() => mark('role')}
          placeholder={t('fields.rolePlaceholder')}
          error={err('role')}
          required
        />
        <Field
          label={t('fields.email')}
          type="email"
          value={state.email}
          onChange={(v) => update('email', v)}
          onBlur={() => mark('email')}
          error={err('email')}
          required
        />
        <Field
          label={t('fields.phone')}
          type="tel"
          value={state.phone}
          onChange={(v) => update('phone', v)}
          onBlur={() => mark('phone')}
          error={err('phone')}
          required
        />
      </div>
    </div>
  );
}

function Step5({state}: {state: FormState}) {
  const t = useTranslations('register.step5');
  const tAct = useTranslations('register.step1');
  const tYears = useTranslations('register.step3.fields');

  const rows: {label: string; value: string}[] = [
    {
      label: t('labels.activity'),
      value: state.activity ? tAct(`options.${state.activity}.label`) : '—'
    },
    {label: t('labels.company'), value: state.company || '—'},
    {label: t('labels.location'), value: state.city || '—'},
    {
      label: t('labels.needs'),
      value: `${state.mw} MW · ${state.hoursPerDay} h/j`
    },
    {
      label: t('labels.duration'),
      value: `${state.years} ${tYears('years')}`
    },
    {
      label: t('labels.signatory'),
      value: `${state.name} — ${state.role}`
    }
  ];
  const attrs: string[] = [];
  if (state.coldStorage) attrs.push(t('attributes.cold'));
  if (state.cbam) attrs.push(t('attributes.cbam'));
  if (attrs.length) rows.push({label: t('labels.attributes'), value: attrs.join(' · ')});

  return (
    <div>
      <StepHeader title={t('title')} sub={t('sub')} />

      <div className="border border-[var(--color-line)] bg-[var(--color-bg-elev)]/40">
        {rows.map((r, i) => (
          <div
            key={i}
            className={`grid grid-cols-[140px_1fr] lg:grid-cols-[180px_1fr] gap-4 px-5 lg:px-7 py-4 ${
              i < rows.length - 1 ? 'border-b border-[var(--color-line)]' : ''
            }`}
          >
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-ink-faint)] pt-0.5">
              {r.label}
            </div>
            <div className="font-display text-[16px] lg:text-[17px] text-[var(--color-ink)] leading-snug">
              {r.value}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-[13px] leading-relaxed text-[var(--color-ink-muted)] max-w-[60ch]">
        {t('legal')}
      </p>
    </div>
  );
}

function SuccessView({
  data,
  onDownload,
  mailto,
  t
}: {
  data: FormState;
  onDownload: () => void;
  mailto: string;
  t: (key: string) => string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none opacity-50"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(232,169,72,0.18), transparent 60%)'
        }}
      />
      <div className="relative text-center max-w-[720px] reveal-fade">
        <div className="mb-10 flex justify-center">
          <div className="relative w-20 h-20">
            <div
              aria-hidden
              className="absolute inset-0 rounded-full bg-[var(--color-sun)]/15 glow-pulse"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                width="44"
                height="44"
                viewBox="0 0 48 48"
                fill="none"
                stroke="var(--color-sun)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="24" cy="24" r="20" strokeDasharray="2 4" />
                <path d="M15 24l7 7 12-14" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="block w-10 h-px bg-[var(--color-sun)]" />
          <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--color-sun)]">
            {t('success.kicker')}
          </span>
          <span className="block w-10 h-px bg-[var(--color-sun)]" />
        </div>

        <h1 className="font-display text-[40px] lg:text-[60px] leading-[1] tracking-[-0.03em] mb-6">
          {t('success.title')}
        </h1>

        <p className="text-[15px] lg:text-[17px] leading-[1.55] text-[var(--color-ink-muted)] max-w-[54ch] mx-auto mb-10">
          {t('success.body')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
          <a
            href={mailto}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--color-sun)] text-[var(--color-bg)] font-mono text-[12px] tracking-[0.16em] uppercase hover:bg-[var(--color-ink)] transition-colors"
          >
            {t('success.mail')}
            <span className="ltr:rotate-0 rtl:rotate-180">→</span>
          </a>
          <button
            type="button"
            onClick={onDownload}
            className="inline-flex items-center gap-2 px-7 py-3.5 border border-[var(--color-line-strong)] text-[var(--color-ink)] font-mono text-[12px] tracking-[0.16em] uppercase hover:border-[var(--color-sun)] hover:text-[var(--color-sun)] transition-colors"
          >
            {t('success.download')}
            <span>↓</span>
          </button>
        </div>

        <div className="border-t border-[var(--color-line)] pt-10">
          <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--color-ink-faint)] mb-6">
            {t('success.next')}
          </div>
          <ol className="space-y-3 max-w-[480px] mx-auto text-start">
            {[0, 1, 2].map((i) => (
              <li
                key={i}
                className="flex items-start gap-4 text-[14px] text-[var(--color-ink)] leading-relaxed"
              >
                <span className="shrink-0 w-6 h-6 rounded-full border border-[var(--color-sun)] text-[var(--color-sun)] font-mono text-[10px] flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span>{t(`success.nextItems.${i}`)}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-14">
          <Link
            href="/"
            className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-ink-muted)] hover:text-[var(--color-sun)] transition-colors"
          >
            {t('success.close')}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ================== FIELDS ==================

function StepHeader({title, sub}: {title: string; sub: string}) {
  return (
    <div className="mb-8">
      <h2 className="font-display text-[28px] lg:text-[38px] leading-tight tracking-[-0.025em] mb-3">
        {title}
      </h2>
      <p className="text-[14px] lg:text-[15px] text-[var(--color-ink-muted)] leading-relaxed max-w-[62ch]">
        {sub}
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  type = 'text',
  colSpan = '',
  required,
  mono
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  type?: string;
  colSpan?: string;
  required?: boolean;
  mono?: boolean;
}) {
  return (
    <label className={`block ${colSpan}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-ink-faint)]">
          {label}
          {required && <span className="text-[var(--color-sun)] ltr:ml-1 rtl:mr-1">*</span>}
        </span>
        {error && (
          <span className="font-mono text-[10px] text-[var(--color-brick)]">
            {error}
          </span>
        )}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`w-full px-0 py-3 bg-transparent border-b-[1.5px] ${
          error
            ? 'border-[var(--color-brick)]'
            : 'border-[var(--color-line)] focus:border-[var(--color-sun)]'
        } text-[var(--color-ink)] text-[16px] outline-none transition-colors ${
          mono ? 'font-mono num tracking-wider' : ''
        }`}
      />
    </label>
  );
}

function Slider({
  label,
  value,
  onChange,
  min,
  max,
  suffix,
  markers,
  big
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  suffix?: string;
  markers?: number[];
  big?: boolean;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between mb-4">
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-ink-faint)]">
          {label}
        </span>
        <span
          className={`font-display num ${
            big ? 'text-[44px] lg:text-[56px]' : 'text-[26px] lg:text-[32px]'
          } tracking-tight text-[var(--color-sun)] leading-none`}
        >
          {value}
          {suffix && (
            <span className="font-mono text-[12px] ltr:ml-2 rtl:mr-2 text-[var(--color-ink-muted)]">
              {suffix}
            </span>
          )}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full appearance-none bg-transparent h-[24px] cursor-pointer range-sun"
          style={
            {
              ['--progress' as string]: `${pct}%`
            } as React.CSSProperties
          }
        />
        <style jsx>{`
          .range-sun {
            -webkit-appearance: none;
          }
          .range-sun::-webkit-slider-runnable-track {
            height: 3px;
            background: linear-gradient(
              to right,
              var(--color-sun) 0%,
              var(--color-sun) var(--progress),
              var(--color-line) var(--progress),
              var(--color-line) 100%
            );
          }
          .range-sun::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            height: 18px;
            width: 18px;
            border-radius: 50%;
            background: var(--color-bg);
            border: 2px solid var(--color-sun);
            margin-top: -8px;
            transition: transform 0.15s ease;
          }
          .range-sun:active::-webkit-slider-thumb,
          .range-sun:focus::-webkit-slider-thumb {
            transform: scale(1.2);
          }
          .range-sun::-moz-range-track {
            height: 3px;
            background: var(--color-line);
          }
          .range-sun::-moz-range-progress {
            height: 3px;
            background: var(--color-sun);
          }
          .range-sun::-moz-range-thumb {
            height: 18px;
            width: 18px;
            border-radius: 50%;
            background: var(--color-bg);
            border: 2px solid var(--color-sun);
          }
        `}</style>
      </div>
      {markers && (
        <div className="flex items-center justify-between mt-2 px-1">
          {markers.map((m) => (
            <span
              key={m}
              className="font-mono text-[9px] tracking-wider text-[var(--color-ink-faint)]"
            >
              {m}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group py-2">
      <span
        className={`shrink-0 mt-0.5 w-5 h-5 border flex items-center justify-center transition-colors ${
          checked
            ? 'border-[var(--color-sun)] bg-[var(--color-sun)] text-[var(--color-bg)]'
            : 'border-[var(--color-line-strong)] group-hover:border-[var(--color-sun)]'
        }`}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M5 12l5 5 9-11" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span className="text-[14px] leading-snug text-[var(--color-ink)]">
        {label}
      </span>
    </label>
  );
}
