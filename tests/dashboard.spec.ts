import { expect, test } from '@playwright/test';

test.describe('Check dashboard page when not logged in', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('get redirected to signin page because not logged in', async ({ page }) => {
    await expect(page).toHaveTitle(/SignIn/);
    await expect(page).toHaveURL(/\/signin/);
  });
});
