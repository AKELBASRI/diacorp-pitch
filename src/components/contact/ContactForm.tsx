'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

type State = {
  name: string;
  company: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  consent: boolean;
};

const INITIAL: State = {
  name: '',
  company: '',
  email: '',
  phone: '',
  subject: 'ppa',
  message: '',
  consent: false
};

const SUBJECTS = [
  'ppa',
  'feasibility',
  'audit',
  'onsite',
  'partnership',
  'investor',
  'other'
] as const;

export function ContactForm() {
  const t = useTranslations('contactPage');
  const [state, setState] = useState<State>(INITIAL);
  const [sent, setSent] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email);
  const canSubmit =
    state.name && state.company && emailValid && state.message && state.consent;

  function buildMailto(): string {
    const subjectLabel = t(`form.subjects.${state.subject}`);
    const subject = `[${subjectLabel}] ${state.company} — ${state.name}`;
    const body = [
      `Nom : ${state.name}`,
      `Entreprise : ${state.company}`,
      `Email : ${state.email}`,
      `Téléphone : ${state.phone || '—'}`,
      `Sujet : ${subjectLabel}`,
      '',
      '— Message —',
      state.message
    ].join('\n');
    return `mailto:contact@diacorp.energy?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    window.location.href = buildMailto();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="border border-[var(--color-sun)] bg-[var(--color-sun)]/5 p-8 lg:p-10 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative w-16 h-16">
            <div
              aria-hidden
              className="absolute inset-0 rounded-full bg-[var(--color-sun)]/15 glow-pulse"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-sun)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
          </div>
        </div>
        <h3 className="font-display text-[26px] lg:text-[32px] leading-tight tracking-tight mb-3">
          {t('success.title')}
        </h3>
        <p className="text-[14px] text-[var(--color-ink-muted)] max-w-[48ch] mx-auto mb-6">
          {t('success.body')}
        </p>
        <Link
          href="/"
          className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--color-ink-muted)] hover:text-[var(--color-sun)] transition-colors"
        >
          {t('success.back')}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field
          label={t('form.nameLabel')}
          value={state.name}
          onChange={(v) => setState({...state, name: v})}
          required
        />
        <Field
          label={t('form.companyLabel')}
          value={state.company}
          onChange={(v) => setState({...state, company: v})}
          required
        />
        <Field
          label={t('form.emailLabel')}
          type="email"
          value={state.email}
          onChange={(v) => setState({...state, email: v})}
          required
        />
        <Field
          label={t('form.phoneLabel')}
          type="tel"
          value={state.phone}
          onChange={(v) => setState({...state, phone: v})}
        />
      </div>

      <div>
        <label className="block">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-ink-faint)] mb-2 block">
            {t('form.subjectLabel')}
          </span>
          <select
            value={state.subject}
            onChange={(e) => setState({...state, subject: e.target.value})}
            className="w-full bg-transparent border-b-[1.5px] border-[var(--color-line)] focus:border-[var(--color-sun)] py-3 text-[var(--color-ink)] text-[15px] outline-none transition-colors"
          >
            {SUBJECTS.map((s) => (
              <option key={s} value={s} className="bg-[var(--color-bg)]">
                {t(`form.subjects.${s}`)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-ink-faint)] mb-2 block">
          {t('form.messageLabel')}
          <span className="text-[var(--color-sun)] ltr:ml-1 rtl:mr-1">*</span>
        </span>
        <textarea
          value={state.message}
          onChange={(e) => setState({...state, message: e.target.value})}
          placeholder={t('form.messagePlaceholder')}
          rows={5}
          className="w-full bg-transparent border border-[var(--color-line)] focus:border-[var(--color-sun)] p-4 text-[var(--color-ink)] text-[15px] outline-none transition-colors resize-none leading-relaxed"
        />
      </label>

      <label className="flex items-start gap-3 cursor-pointer group pt-2">
        <span
          className={`shrink-0 mt-0.5 w-5 h-5 border flex items-center justify-center transition-colors ${
            state.consent
              ? 'border-[var(--color-sun)] bg-[var(--color-sun)] text-[var(--color-bg)]'
              : 'border-[var(--color-line-strong)] group-hover:border-[var(--color-sun)]'
          }`}
        >
          {state.consent && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 12l5 5 9-11" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        <input
          type="checkbox"
          checked={state.consent}
          onChange={(e) => setState({...state, consent: e.target.checked})}
          className="sr-only"
        />
        <span className="text-[13px] leading-snug text-[var(--color-ink-muted)]">
          {t('form.consent')}
        </span>
      </label>

      <div className="pt-4 border-t border-[var(--color-line)] flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--color-ink-muted)]">
          {t('form.orDirect')}{' '}
          <a
            href="mailto:contact@diacorp.energy"
            className="text-[var(--color-sun)] hover:underline"
          >
            contact@diacorp.energy
          </a>
        </div>
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center gap-2 px-7 py-3 font-mono text-[11px] tracking-[0.16em] uppercase bg-[var(--color-sun)] text-[var(--color-bg)] hover:bg-[var(--color-ink)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {t('form.submit')}
          <span className="ltr:rotate-0 rtl:rotate-180">→</span>
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-ink-faint)] mb-2 block">
        {label}
        {required && <span className="text-[var(--color-sun)] ltr:ml-1 rtl:mr-1">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full bg-transparent border-b-[1.5px] border-[var(--color-line)] focus:border-[var(--color-sun)] py-3 text-[var(--color-ink)] text-[15px] outline-none transition-colors"
      />
    </label>
  );
}
