import { routing } from './routing';

export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;

// Note: Depending on next-intl typings, this may widen to `string`.
// It's still useful as a shared semantic type for route params.
export type Locale = (typeof routing.locales)[number];
