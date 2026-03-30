export interface Provider {
  id: string;
  name: string;
  slug: string;
  logo: string;
  region: string;
  affiliate_url: string;
  website_url: string;
  short_desc: string;
  logo_note_de?: string;
  logo_note_en?: string;
}

export interface Plan {
  id: string;
  provider_id: string;
  plan_name: string;
  price_eur: number | null;
  price_usd: number | null;
  storage_gb: number | null;
  traffic_gb: number | null;
  domains: number | null;
  ssl: boolean;
  integration_tags: string[];
  notes?: string;
  last_verified_at: string | null;
}

export interface DomainRegistrar {
  id: string;
  name: string;
  slug: string;
  logo: string;
  website_url: string;
  affiliate_url: string;
  search_url_template: string;
  region: string;
  whois_privacy_always_free: boolean;
  last_verified_at: string | null;
}

export interface DomainPrice {
  id: string;
  registrar_id: string;
  tld: string;
  register_price_eur: number | null;
  register_price_usd: number | null;
  renew_price_eur: number | null;
  renew_price_usd: number | null;
  transfer_price_eur: number | null;
  transfer_price_usd: number | null;
  whois_privacy: boolean;
  free_ssl: boolean;
  dns_management: boolean;
  notes: string | null;
  last_verified_at: string | null;
}

export interface TldPriceRow {
  registrar_id: string;
  registrar_name: string;
  registrar_logo: string;
  affiliate_url: string;
  search_url_template: string;
  tld: string;
  register_price_eur: number | null;
  register_price_usd: number | null;
  renew_price_eur: number | null;
  renew_price_usd: number | null;
  transfer_price_eur: number | null;
  transfer_price_usd: number | null;
  whois_privacy: boolean;
  free_ssl: boolean;
  dns_management: boolean;
  notes: string | null;
}

export type DomainSortMode = 'renew' | 'register';

export type AiTargetSystem = 'openclaw' | 'n8n' | 'other';
export type AiHostingType = 'vps' | 'managed' | 'platform';
export type AiSetupLevel = 'self' | 'assisted' | 'managed';
export type AiHostOptionStatus = 'active' | 'beta' | 'unknown';

export interface AiHosterItem {
  id: string;
  name: string;
  slug: string;
  target_system: AiTargetSystem;
  hosting_type: AiHostingType;
  setup_level: AiSetupLevel;
  website_url: string;
  focus: string;
  docker_support: boolean;
  root_access: boolean;
  price_model: string;
  best_for: string;
  limitations: string;
  status: AiHostOptionStatus;
}
