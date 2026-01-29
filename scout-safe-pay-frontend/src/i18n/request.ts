import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

// Import all messages statically
import en from '../../messages/en.json';
import de from '../../messages/de.json';
import ro from '../../messages/ro.json';
import es from '../../messages/es.json';
import it from '../../messages/it.json';
import fr from '../../messages/fr.json';
import nl from '../../messages/nl.json';

// Can be imported from a shared config
const locales = ['en', 'de', 'ro', 'es', 'it', 'fr', 'nl'];

const messages: Record<string, any> = {
  en,
  de,
  ro,
  es,
  it,
  fr,
  nl
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
