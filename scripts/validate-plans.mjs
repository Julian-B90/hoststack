import fs from 'fs';

const ALLOWED_TAGS = new Set([
  'git',
  'ci/cd',
  'edge',
  'cdn',
  'serverless',
  'api',
  'database',
  'backup',
  'docker',
  'kv',
  'ssl',
]);

const TOP10_PROVIDER_IDS = new Set([
  'aws',
  'microsoft-azure',
  'google-cloud',
  'cloudflare',
  'vercel',
  'netlify',
  'render',
  'railway',
  'heroku',
  'fly-io',
]);

const providers = JSON.parse(fs.readFileSync('src/data/providers.json', 'utf8'));
const plans = JSON.parse(fs.readFileSync('src/data/plans.json', 'utf8'));

const providerIds = new Set(providers.map((p) => p.id));
const seenPlanIds = new Set();
const errors = [];

const isNumber = (value) => typeof value === 'number' && Number.isFinite(value);
const isNumberOrNull = (value) => value === null || isNumber(value);

for (const plan of plans) {
  if (seenPlanIds.has(plan.id)) {
    errors.push(`Duplicate plan id: ${plan.id}`);
  }
  seenPlanIds.add(plan.id);

  if (!providerIds.has(plan.provider_id)) {
    errors.push(`Unknown provider_id on ${plan.id}: ${plan.provider_id}`);
  }

  if (!isNumber(plan.price_eur)) {
    errors.push(`Invalid price_eur on ${plan.id}: ${plan.price_eur}`);
  }
  if (!isNumber(plan.price_usd)) {
    errors.push(`Invalid price_usd on ${plan.id}: ${plan.price_usd}`);
  }

  if (!isNumberOrNull(plan.storage_gb)) {
    errors.push(`Invalid storage_gb on ${plan.id}: ${plan.storage_gb}`);
  }
  if (!isNumberOrNull(plan.traffic_gb)) {
    errors.push(`Invalid traffic_gb on ${plan.id}: ${plan.traffic_gb}`);
  }
  if (!isNumberOrNull(plan.domains)) {
    errors.push(`Invalid domains on ${plan.id}: ${plan.domains}`);
  }

  if (!Array.isArray(plan.integration_tags)) {
    errors.push(`integration_tags must be an array on ${plan.id}`);
  } else {
    for (const tag of plan.integration_tags) {
      if (!ALLOWED_TAGS.has(tag)) {
        errors.push(`Invalid integration tag on ${plan.id}: ${tag}`);
      }
    }
  }

  if (TOP10_PROVIDER_IDS.has(plan.provider_id)) {
    if (plan.notes?.includes('Placeholder data for prototype')) {
      errors.push(`Top-10 plan still has placeholder notes: ${plan.id}`);
    }
    if (!plan.last_verified_at) {
      errors.push(`Missing last_verified_at for top-10 plan: ${plan.id}`);
    }
  }
}

for (const providerId of TOP10_PROVIDER_IDS) {
  const providerPlans = plans.filter((plan) => plan.provider_id === providerId);
  if (providerPlans.length === 0) {
    errors.push(`Top-10 provider has no plans: ${providerId}`);
  }
}

if (errors.length > 0) {
  console.error('Plan validation failed:\n');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Plan validation passed (${plans.length} plans checked).`);
