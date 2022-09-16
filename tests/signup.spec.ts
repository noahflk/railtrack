import { expect, test } from '@playwright/test';

test.describe('Check sign up page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
  });

  test('has sign up title', async ({ page }) => {
    await expect(page).toHaveTitle(/SignUp/);
  });

  test('has sign in header', async ({ page }) => {
    await page.isVisible("text='Create a new account'");
  });

  test('link to sign in page', async ({ page }) => {
    const createAccount = page.locator('text=sign in with your account');

    await expect(createAccount).toHaveAttribute('href', '/signin');

    await createAccount.click();

    await expect(page).toHaveTitle(/SignIn/);
    await expect(page).toHaveURL(/\/signin/);
  });

  test('error with too short password', async ({ page }) => {
    await page.locator('#email').fill('playwright@flk.li');
    await page.locator('#password').fill('short');

    await page.locator('button[type="submit"]').click();

    await page.isVisible("text='Password should be at least 8 characters'");
  });
});
