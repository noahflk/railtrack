import { Page } from '@playwright/test';

async function login(page: Page, username: string, password: string, url?: string): Promise<void> {
  await page.goto(url ?? '/signin');

  // sign in
  await page.locator('#email').fill(username);
  await page.locator('#password').fill(password);
  await page.locator('button[type="submit"]').click();
}

export default login;
