import { expect, test } from '@playwright/test';

import login from './utils/login';

// Doesn't work
// test.use({ storageState: 'userStorageState.json' });

const email = process.env.PLAYWRIGHT_EMAIL ?? '';
const password = process.env.PLAYWRIGHT_PASSWORD ?? '';

test.describe('Check navigation', () => {
  test.beforeEach(async ({ page }) => {
    login(page, email, password);
  });

  test('all links in navbar exist', async ({ page }) => {
    const dashboard = page.locator('a:has-text("Dashboard")');
    await expect(dashboard).toHaveAttribute('href', '/dashboard');

    const journeys = page.locator('a:has-text("Journeys")');
    await expect(journeys).toHaveAttribute('href', '/journeys');

    const addJourney = page.locator('a:has-text("Add journey")');
    await expect(addJourney).toHaveAttribute('href', '/add');

    const settings = page.locator('a:has-text("Settings")');
    await expect(settings).toHaveAttribute('href', '/settings');
  });
});
