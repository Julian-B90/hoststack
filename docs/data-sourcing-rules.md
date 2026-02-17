# Data Sourcing Rules (Phase 1)

## Scope
- Phase 1 replaces placeholder plans for the cloud-core top-10 providers.
- Source of truth is official provider pricing or billing documentation.

## Normalization
- `price_usd` stores monthly list pricing in USD.
- `price_eur` is derived with fixed FX `0.84`:
  - `price_eur = round(price_usd * 0.84, 2)`.
- Free plans use `0`.
- Usage-based plans without fixed monthly subscription use `0` and a `notes` remark.

## Missing limits
- `storage_gb`, `traffic_gb`, `domains` are numeric when explicitly listed.
- If no explicit cap is listed: `null` plus explanation in `notes`.

## SSL
- `ssl: true` only when platform-managed TLS is part of the standard offer.
- If unclear: `ssl: false` plus explanation in `notes`.

## Integration tags
Only these tags are allowed:
- `git`
- `ci/cd`
- `edge`
- `cdn`
- `serverless`
- `api`
- `database`
- `backup`
- `docker`
- `kv`
- `ssl`

## Notes format
Each `notes` value follows this format:
- `source:<url>; checked_at:<YYYY-MM-DD>; remark:<text>`

## Verification metadata
- Updated phase-1 entries must set `last_verified_at` to check date.
- Run `node scripts/validate-plans.mjs` before build/test.
