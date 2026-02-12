import { expect, test } from '@playwright/test';

test.describe('Provider directory smoke', () => {
  test('base page shows expected result count and pagination', async ({ page }) => {
    await page.goto('/de/providers');
    await expect(page.locator('#provider-results-count')).toHaveText('32 Anbieter');
    await expect(page.locator('#provider-pagination button[data-page="3"]')).toBeVisible();
  });

  test('deep link q=aws restores search and results', async ({ page }) => {
    await page.goto('/de/providers?q=aws');
    await expect(page.locator('#provider-search')).toHaveValue('aws');
    await expect(page.locator('#provider-results-count')).toHaveText('3 Anbieter');
  });

  test('logo filter with value keeps expected provider count', async ({ page }) => {
    await page.goto('/de/providers?logo=with');
    await expect(page.locator('#provider-filter-logo')).toHaveValue('with');
    await expect(page.locator('#provider-results-count')).toHaveText('8 Anbieter');
  });

  test('integration edge filter shows expected count', async ({ page }) => {
    await page.goto('/de/providers?integration=edge');
    await expect(page.locator('#provider-filter-integration')).toHaveValue('edge');
    await expect(page.locator('#provider-results-count')).toHaveText('11 Anbieter');
  });

  test('price range filter via URL works (EUR default)', async ({ page }) => {
    await page.goto('/de/providers?priceMin=14&priceMax=24');
    await expect(page.locator('#provider-price-min')).toHaveValue('14');
    await expect(page.locator('#provider-price-max')).toHaveValue('24');
    await expect(page.locator('#provider-results-count')).toHaveText('19 Anbieter');
  });

  test('out of range page clamps to valid max page', async ({ page }) => {
    await page.goto('/de/providers?page=999');
    await expect(page.locator('#provider-pagination button[data-page="3"]')).toHaveClass(/bg-ink/);
  });

  test('full URL state is reflected in controls and count', async ({ page }) => {
    await page.goto('/de/providers?q=aws&logo=with&integration=ci%2Fcd&priceMin=9&priceMax=19&sort=price&page=1');
    await expect(page.locator('#provider-search')).toHaveValue('aws');
    await expect(page.locator('#provider-filter-logo')).toHaveValue('with');
    await expect(page.locator('#provider-filter-integration')).toHaveValue('ci/cd');
    await expect(page.locator('#provider-sort')).toHaveValue('price');
    await expect(page.locator('#provider-results-count')).toHaveText('1 Anbieter');
  });

  test('browser history back/forward restores state', async ({ page }) => {
    await page.goto('/de/providers');
    await page.fill('#provider-search', 'aws');
    await expect(page.locator('#provider-results-count')).toHaveText('3 Anbieter');
    await page.selectOption('#provider-filter-logo', 'with');
    await expect(page.locator('#provider-results-count')).toHaveText('1 Anbieter');

    await page.goBack();
    await expect(page.locator('#provider-filter-logo')).toHaveValue('any');
    await expect(page.locator('#provider-results-count')).toHaveText('3 Anbieter');

    await page.goForward();
    await expect(page.locator('#provider-filter-logo')).toHaveValue('with');
    await expect(page.locator('#provider-results-count')).toHaveText('1 Anbieter');
  });

  test('currency switch keeps page stable and price sliders valid', async ({ page }) => {
    await page.goto('/de/providers?priceMin=14&priceMax=24');
    await page.click('#currency-toggle');

    await expect(page.locator('html')).toHaveAttribute('data-currency', 'usd');

    const min = Number(await page.locator('#provider-price-min').inputValue());
    const max = Number(await page.locator('#provider-price-max').inputValue());
    expect(Number.isFinite(min)).toBeTruthy();
    expect(Number.isFinite(max)).toBeTruthy();
    expect(min).toBeLessThanOrEqual(max);
    await expect(page.locator('#provider-results-count')).toBeVisible();
  });

  test('english page mirrors core behavior', async ({ page }) => {
    await page.goto('/en/providers?logo=with');
    await expect(page.locator('#provider-results-count')).toHaveText('8 providers');
    await expect(page.locator('#provider-filter-logo')).toHaveValue('with');
  });
});
