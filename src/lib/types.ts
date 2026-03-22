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
