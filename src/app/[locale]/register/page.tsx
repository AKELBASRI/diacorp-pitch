import type {Metadata} from 'next';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {RegisterForm} from '@/components/register/RegisterForm';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'register.meta'});
  return {title: t('title'), description: t('description')};
}

export default async function RegisterPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <RegisterForm />;
}
