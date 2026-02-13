import { expect, test } from '@playwright/test';

test.describe('Provider directory UX polishing', () => {
  test('shows total and filtered counts', async ({ page }) => {
    await page.goto('/de/providers');
    await expect(page.locator('#provider-results-total')).toHaveText('Gesamt: 32');
    await expect(page.locator('#provider-results-filtered')).toHaveText('Gefiltert: 32');
  });

  test('integrationMode=any returns broader result set than all', async ({ page }) => {
    await page.goto('/de/providers?integration=edge,ci/cd&integrationMode=any');
    await expect(page.locator('#provider-results-filtered')).toHaveText('Gefiltert: 22');

    await page.goto('/de/providers?integration=edge,ci/cd&integrationMode=all');
    await expect(page.locator('#provider-results-filtered')).toHaveText('Gefiltert: 0');
  });

  test('active chips can remove single integration filter', async ({ page }) => {
    await page.goto('/de/providers?integration=edge,ssl&integrationMode=all');
    await page.locator('#provider-active-chips button[data-chip="integration"][data-value="edge"]').click();
    await expect(page).toHaveURL(/integration=ssl/);
    await expect(page.locator('#provider-results-filtered')).toHaveText('Gefiltert: 32');
  });

  test('clear all resets filters and query params', async ({ page }) => {
    await page.goto('/de/providers?q=aws&logo=with&integration=edge&integrationMode=all&priceMin=14&priceMax=24&sort=name');
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
    await page.goto('/de/providers?integration=edge,ci/cd&integrationMode=all');
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
    await page.selectOption('#mobile-provider-filter-logo', 'with');
    await page.click('#provider-mobile-filter-close');
    await expect(page).toHaveURL('/de/providers');

    await page.click('#provider-mobile-filter-open');
    await page.selectOption('#mobile-provider-filter-logo', 'with');
    await page.click('#provider-mobile-filter-apply');
    await expect(page).toHaveURL(/logo=with/);
    await expect(page.locator('#provider-results-filtered')).toHaveText('Gefiltert: 8');
  });

  test('mobile sheet reset resets draft controls', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/de/providers?logo=with');
    await page.click('#provider-mobile-filter-open');
    await page.selectOption('#mobile-provider-filter-logo', 'without');
    await page.locator('#provider-mobile-filter-reset').click({ force: true });
    await expect(page.locator('#mobile-provider-filter-logo')).toHaveValue('any');
  });

  test('english page renders new labels', async ({ page }) => {
    await page.goto('/en/providers');
    await expect(page.locator('#provider-results-total')).toHaveText('Total: 32');
    await expect(page.locator('#provider-results-filtered')).toHaveText('Filtered: 32');
    await expect(page.locator('#provider-mobile-filter-open')).toContainText('Filters');
  });
});
