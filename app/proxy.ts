import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from '../i18n/request';

// This function can be marked `async` if using `await` inside
export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // However, match all public pages
    '/'
  ]
};
