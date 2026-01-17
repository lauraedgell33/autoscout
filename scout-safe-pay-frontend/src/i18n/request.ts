import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

// Import all messages statically
import en from '../../messages/en.json';
import de from '../../messages/de.json';
import es from '../../messages/es.json';
import it from '../../messages/it.json';
import ro from '../../messages/ro.json';
import fr from '../../messages/fr.json';

// Can be imported from a shared config
const locales = ['en', 'de', 'es', 'it', 'ro', 'fr'];

const messages: Record<string, any> = {
  en,
  de,
  es,
  it,
  ro,
  fr
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
