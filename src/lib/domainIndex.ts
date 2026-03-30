import type { DomainRegistrar, DomainPrice, TldPriceRow, DomainSortMode } from './types';

export const SUPPORTED_TLDS = ['com', 'de', 'net', 'org', 'io'] as const;

export function extractTld(input: string): string | null {
  const cleaned = input.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
  const parts = cleaned.split('.').filter(Boolean);
  if (parts.length < 2) return null;
  const tld = parts[parts.length - 1];
  return SUPPORTED_TLDS.includes(tld as (typeof SUPPORTED_TLDS)[number]) ? tld : null;
}

export function buildTldPriceRows(
  registrars: DomainRegistrar[],
  prices: DomainPrice[],
  tld: string
): TldPriceRow[] {
  const registrarMap = new Map(registrars.map((r) => [r.id, r]));

  return prices
    .filter(
      (p) =>
        p.tld === tld &&
        (p.renew_price_eur !== null || p.renew_price_usd !== null)
    )
    .map((p) => {
      const reg = registrarMap.get(p.registrar_id);
      if (!reg) return null;
      return {
        registrar_id: reg.id,
        registrar_name: reg.name,
        registrar_logo: reg.logo,
        affiliate_url: reg.affiliate_url,
        search_url_template: reg.search_url_template,
        tld: p.tld,
        register_price_eur: p.register_price_eur,
        register_price_usd: p.register_price_usd,
        renew_price_eur: p.renew_price_eur,
        renew_price_usd: p.renew_price_usd,
        transfer_price_eur: p.transfer_price_eur,
        transfer_price_usd: p.transfer_price_usd,
        whois_privacy: p.whois_privacy,
        free_ssl: p.free_ssl,
        dns_management: p.dns_management,
        notes: p.notes,
      } satisfies TldPriceRow;
    })
    .filter((r): r is TldPriceRow => r !== null);
}

export function sortTldPriceRows(
  rows: TldPriceRow[],
  mode: DomainSortMode,
  currency: 'eur' | 'usd'
): TldPriceRow[] {
  return [...rows].sort((a, b) => {
    const priceKey = mode === 'renew'
      ? (currency === 'eur' ? 'renew_price_eur' : 'renew_price_usd')
      : (currency === 'eur' ? 'register_price_eur' : 'register_price_usd');

    const aPrice = a[priceKey];
    const bPrice = b[priceKey];

    if (aPrice === null && bPrice === null) return a.registrar_name.localeCompare(b.registrar_name);
    if (aPrice === null) return 1;
    if (bPrice === null) return -1;
    return aPrice - bPrice;
  });
}

export function buildSearchUrl(template: string, domain: string): string {
  return template.replace('{domain}', encodeURIComponent(domain));
}
