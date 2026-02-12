export type Provider = {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  region?: string;
  short_desc?: string;
  logo_note_de?: string;
  logo_note_en?: string;
};

export type Plan = {
  provider_id: string;
  price_eur?: number | null;
  price_usd?: number | null;
  ssl?: boolean;
  integration_tags?: string[];
};

export type ProviderIndexItem = {
  id: string;
  name: string;
  slug: string;
  logo: string;
  region: string;
  short_desc: string;
  logo_note_de: string;
  logo_note_en: string;
  plan_count: number;
  min_price_eur: number | null;
  min_price_usd: number | null;
  has_ssl: boolean;
  integration_tags: string[];
  has_logo: boolean;
};

export type FilterState = {
  q: string;
  region: string;
  logo: 'any' | 'with' | 'without';
  integration: string;
  ssl: 'any' | 'yes';
  priceMin: number | null;
  priceMax: number | null;
};

export type SortKey = 'price' | 'name' | 'plans';

export function buildProviderIndex(providers: Provider[], plans: Plan[]): ProviderIndexItem[] {
  const planMap = new Map<string, Plan[]>();
  for (const plan of plans) {
    const current = planMap.get(plan.provider_id) || [];
    current.push(plan);
    planMap.set(plan.provider_id, current);
  }

  return providers.map((provider) => {
    const providerPlans = planMap.get(provider.id) || [];
    const pricesEur = providerPlans
      .map((plan) => plan.price_eur)
      .filter((value): value is number => typeof value === 'number');
    const pricesUsd = providerPlans
      .map((plan) => plan.price_usd)
      .filter((value): value is number => typeof value === 'number');
    const integrationTags = Array.from(
      new Set(
        providerPlans.flatMap((plan) =>
          Array.isArray(plan.integration_tags) ? plan.integration_tags : []
        )
      )
    ).sort((a, b) => a.localeCompare(b));

    return {
      id: provider.id,
      name: provider.name || '',
      slug: provider.slug || '',
      logo: provider.logo || '',
      region: normalizeRegion(provider.region),
      short_desc: provider.short_desc || '',
      logo_note_de: provider.logo_note_de || '',
      logo_note_en: provider.logo_note_en || '',
      plan_count: providerPlans.length,
      min_price_eur: pricesEur.length ? Math.min(...pricesEur) : null,
      min_price_usd: pricesUsd.length ? Math.min(...pricesUsd) : null,
      has_ssl: providerPlans.some((plan) => plan.ssl === true),
      integration_tags: integrationTags,
      has_logo: Boolean(provider.logo && provider.logo.trim().length > 0),
    };
  });
}

export function filterProviders(index: ProviderIndexItem[], state: FilterState): ProviderIndexItem[] {
  const search = state.q.trim().toLowerCase();
  const explicitPrice = state.priceMin !== null || state.priceMax !== null;

  return index.filter((item) => {
    if (search) {
      const haystack = [item.name, item.short_desc, item.slug].join(' ').toLowerCase();
      if (!haystack.includes(search)) {
        return false;
      }
    }

    if (state.region !== 'all' && normalizeRegion(item.region) !== state.region) {
      return false;
    }

    if (state.logo === 'with' && !item.has_logo) {
      return false;
    }

    if (state.logo === 'without' && item.has_logo) {
      return false;
    }

    if (state.integration !== 'all' && !item.integration_tags.includes(state.integration)) {
      return false;
    }

    if (state.ssl === 'yes' && !item.has_ssl) {
      return false;
    }

    if (explicitPrice) {
      return true;
    }

    return true;
  });
}

export function sortProviders(items: ProviderIndexItem[], sortKey: SortKey, currency: 'eur' | 'usd'): ProviderIndexItem[] {
  const sorted = [...items];

  if (sortKey === 'name') {
    return sorted.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sortKey === 'plans') {
    return sorted.sort((a, b) => {
      if (b.plan_count !== a.plan_count) {
        return b.plan_count - a.plan_count;
      }
      return a.name.localeCompare(b.name);
    });
  }

  const priceKey = currency === 'eur' ? 'min_price_eur' : 'min_price_usd';
  return sorted.sort((a, b) => {
    const av = a[priceKey];
    const bv = b[priceKey];
    if (av === null && bv === null) {
      return a.name.localeCompare(b.name);
    }
    if (av === null) {
      return 1;
    }
    if (bv === null) {
      return -1;
    }
    if (av !== bv) {
      return av - bv;
    }
    return a.name.localeCompare(b.name);
  });
}

export function paginate<T>(items: T[], page: number, pageSize: number): { items: T[]; page: number; pageCount: number; total: number } {
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), pageCount);
  const start = (safePage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    pageCount,
    total,
  };
}

function normalizeRegion(region: string | undefined): string {
  const normalized = (region || 'global').trim().toLowerCase();
  return normalized || 'global';
}
