import { test, expect } from '@playwright/test';
import config from '../config.json';
import { LoginPage } from '../pages/login.page';
import { HomePage } from '../pages/home.page';

// Advanced test: verify home page tab names
test('Verify home page tab names (advanced)', async ({ page }) => {
  const login = new LoginPage(page);
  const home = new HomePage(page);

  // Navigate and login using config
  await login.goto(config.URL);
  await login.login(config.username, config.password);

  // Confirm main page loaded
  await home.waitForMainPage();

  // Verify important tabs are visible
  const tabs = ['View Account Summary', 'View Recent Transactions', 'Transfer Funds'];
  for (const t of tabs) {
    const locator = home.getTabLocator(t);
    await expect(locator).toBeVisible({ timeout: 10000 });
  }
});
