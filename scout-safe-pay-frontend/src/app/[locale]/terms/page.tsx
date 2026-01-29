import { redirect } from 'next/navigation';
import { Locale } from '@/i18n/config';

export default function TermsRedirect({ params }: { params: { locale: Locale } }) {
  redirect(`/${params.locale}/legal/terms`);
}
