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
