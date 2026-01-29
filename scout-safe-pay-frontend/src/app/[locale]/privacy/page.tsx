import { redirect } from 'next/navigation';
import { Locale } from '@/i18n/config';

export default function PrivacyRedirect({ params }: { params: { locale: Locale } }) {
  redirect(`/${params.locale}/legal/privacy`);
}
