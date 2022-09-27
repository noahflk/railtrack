import { expect, test } from '@playwright/test';
import login from './utils/login';

const email = process.env.PLAYWRIGHT_EMAIL ?? '';
const password = process.env.PLAYWRIGHT_PASSWORD ?? '';

test.describe('Check sign in page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signin');
  });

  test('has sign in title', async ({ page }) => {
    await expect(page).toHaveTitle(/SignIn/);
  });

  test('has sign in header', async ({ page }) => {
    await page.isVisible("text='Sign in with your account'");
  });

  test('link to sign up page', async ({ page }) => {
    const createAccount = page.locator('text=create a new account');

    await expect(createAccount).toHaveAttribute('href', '/signup');

    await createAccount.click();

    await expect(page).toHaveTitle(/SignUp/);
    await expect(page).toHaveURL(/\/signup/);
  });

  test('link to forgot password page', async ({ page }) => {
    const forgotPassword = page.locator('text=Forgot your password?');

    await expect(forgotPassword).toHaveAttribute('href', '/auth/forgot');

    await forgotPassword.click();

    await expect(page).toHaveTitle(/SignIn/);
    await expect(page).toHaveURL(/\/auth\/forgot/);
  });

  test('error on invalid login', async ({ page }) => {
    await page.locator('#email').fill('playwright@flk.li');
    await page.locator('#password').fill('randompassword');

    await page.locator('button[type="submit"]').click();

    await page.isVisible("text='Invalid login credentials'");
  });

  // test('sign in works and redirects to dashbaord', async ({ page }) => {
  //   // sign in
  //   login(page, email, password);

  //   // check if redirected to dashboard
  //   await expect(page).toHaveTitle(/Dashboard/);
  //   await expect(page).toHaveURL(/\/dashboard/);
  //   await page.isVisible("text='Dashboard'");
  // });
});
