import createMiddleware from "next-intl/middleware";
import { getLocales, getDefaultLocale } from "../i18n/request";

export default createMiddleware({
  locales: getLocales(),
  defaultLocale: getDefaultLocale(),
  localePrefix: "always",
});

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
    "/"
  ]
};
