import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

// Import all messages statically
import en from '../../messages/en.json';
import de from '../../messages/de.json';
import ro from '../../messages/ro.json';

// Can be imported from a shared config
const locales = ['en', 'de', 'ro'];

const messages: Record<string, any> = {
  en,
  de,
  ro
};

export default getRequestConfig(async ({requestLocale}) => {
  // Typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that the incoming `locale` is valid
  if (!locale || !locales.includes(locale)) {
    locale = 'en';
  }

  return {
    locale,
    messages: messages[locale]
  };
});
