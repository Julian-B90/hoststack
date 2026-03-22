export interface UtmParams {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
}

export function buildAffiliateUrl(affiliateUrl: string, utm?: UtmParams): string {
  if (!affiliateUrl) return '';
  const url = new URL(affiliateUrl);
  if (utm?.source) url.searchParams.set('utm_source', utm.source);
  if (utm?.medium) url.searchParams.set('utm_medium', utm.medium);
  if (utm?.campaign) url.searchParams.set('utm_campaign', utm.campaign);
  if (utm?.content) url.searchParams.set('utm_content', utm.content);
  return url.toString();
}

export function hasAffiliateUrl(url: string | undefined | null): url is string {
  return typeof url === 'string' && url.trim().length > 0;
}
