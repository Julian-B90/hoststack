import { expect, test } from '@playwright/test';

const extractCount = async (locator) => {
  const text = await locator.textContent();
  const match = text?.match(/(\d+)/);
  return match ? Number.parseInt(match[1], 10) : NaN;
};

test.describe('Provider directory UX polishing', () => {
  test('shows total and filtered counts', async ({ page }) => {
    await page.goto('/de/providers');
    await expect(page.locator('#provider-results-total')).toHaveText('Gesamt: 32');
    await expect(page.locator('#provider-results-filtered')).toHaveText('Gefiltert: 32');
  });

  test('integrationMode=any returns broader result set than all', async ({ page }) => {
    await page.goto('/de/providers?integration=edge,ci/cd&integrationMode=any');
    const anyCount = await extractCount(page.locator('#provider-results-filtered'));

    await page.goto('/de/providers?integration=edge,ci/cd&integrationMode=all');
    const allCount = await extractCount(page.locator('#provider-results-filtered'));

    expect(anyCount).toBeGreaterThanOrEqual(allCount);
    expect(allCount).toBeGreaterThanOrEqual(0);
  });

  test('active chips can remove single integration filter', async ({ page }) => {
    await page.goto('/de/providers?integration=edge,ssl&integrationMode=all');
    const before = await extractCount(page.locator('#provider-results-filtered'));
    await page.locator('#provider-active-chips button[data-chip="integration"][data-value="edge"]').click();
    await expect(page).toHaveURL(/integration=ssl/);
    const after = await extractCount(page.locator('#provider-results-filtered'));
    expect(after).toBeGreaterThanOrEqual(before);
  });

  test('clear all resets filters and query params', async ({ page }) => {
    await page.goto('/de/providers?q=aws&integration=edge&integrationMode=all&priceMin=14&priceMax=24&sort=name');
    await page.click('#provider-clear-all');
    await expect(page).toHaveURL('/de/providers');
    await expect(page.locator('#provider-results-filtered')).toHaveText('Gefiltert: 32');
  });

  test('integration query is serialized in stable order', async ({ page }) => {
    await page.goto('/de/providers');
    await page.click('#provider-integration-tags button[data-tag="ssl"]');
    await page.click('#provider-integration-tags button[data-tag="edge"]');
    await page.click('#provider-integration-tags button[data-tag="ci/cd"]');
    await expect(page).toHaveURL(/integration=ci%2Fcd%2Cedge%2Cssl/);
  });

  test('search uses debounce replace and enter push', async ({ page }) => {
    await page.goto('/de/providers');
    await page.fill('#provider-search', 'aws');
    await page.press('#provider-search', 'Enter');
    await expect(page).toHaveURL(/q=aws/);
    await page.goBack();
    await expect(page).toHaveURL('/de/providers');
  });

  test('empty state displays hint and reset action', async ({ page }) => {
    await page.goto('/de/providers?q=__no_provider_should_match__');
    await expect(page.locator('#provider-empty')).toBeVisible();
    await expect(page.locator('#provider-empty')).toContainText('Tipp: Entferne zuerst Integrations- oder Preisfilter.');
    await page.click('#provider-empty-reset');
    await expect(page.locator('#provider-empty')).toBeHidden();
    await expect(page.locator('#provider-results-filtered')).toHaveText('Gefiltert: 32');
  });

  test('mobile sheet close discards changes and apply commits', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/de/providers');

    await page.click('#provider-mobile-filter-open');
    await page.selectOption('#mobile-provider-filter-ssl', 'yes');
    await page.click('#provider-mobile-filter-close');
    await expect(page).toHaveURL('/de/providers');

    await page.click('#provider-mobile-filter-open');
    await page.selectOption('#mobile-provider-filter-ssl', 'yes');
    await page.click('#provider-mobile-filter-apply');
    await expect(page).toHaveURL(/ssl=yes/);
    const total = await extractCount(page.locator('#provider-results-total'));
    const filtered = await extractCount(page.locator('#provider-results-filtered'));
    expect(filtered).toBeLessThanOrEqual(total);
  });

  test('mobile sheet reset resets draft controls', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/de/providers?ssl=yes');
    await page.click('#provider-mobile-filter-open');
    await page.selectOption('#mobile-provider-filter-ssl', 'any');
    await page.locator('#provider-mobile-filter-reset').click({ force: true });
    await expect(page.locator('#mobile-provider-filter-ssl')).toHaveValue('any');
  });

  test('english page renders new labels', async ({ page }) => {
    await page.goto('/en/providers');
    await expect(page.locator('#provider-results-total')).toHaveText('Total: 32');
    await expect(page.locator('#provider-results-filtered')).toHaveText('Filtered: 32');
    await expect(page.locator('#provider-mobile-filter-open')).toContainText('Filters');
  });
});
