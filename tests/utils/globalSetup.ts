import { chromium, FullConfig } from '@playwright/test';

import login from './login';

const email = process.env.PLAYWRIGHT_EMAIL ?? '';
const password = process.env.PLAYWRIGHT_PASSWORD ?? '';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const url = config.projects[0]?.use.baseURL + '/signin';

  login(page, email, password, url);

  await page.context().storageState({ path: 'userStorageState.json' });
}

export default globalSetup;
