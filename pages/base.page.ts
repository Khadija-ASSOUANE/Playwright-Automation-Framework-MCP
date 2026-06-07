import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  locator(selectorOrLocator: string | Locator) {
    return typeof selectorOrLocator === 'string' ? this.page.locator(selectorOrLocator) : selectorOrLocator;
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async click(selectorOrLocator: string | Locator) {
    await this.locator(selectorOrLocator).click();
  }

  async fill(selectorOrLocator: string | Locator, value: string) {
    await this.locator(selectorOrLocator).fill(value);
  }

  async text(selectorOrLocator: string | Locator) {
    return await this.locator(selectorOrLocator).innerText();
  }

  async isVisible(selectorOrLocator: string | Locator, timeout = 10000) {
    await expect(this.locator(selectorOrLocator)).toBeVisible({ timeout });
  }

  // Prefer role-based locators with a fallback selector
  async resolveLocator(roleFn: () => Locator, fallback: string) {
    const rl = roleFn();
    if (await rl.count() > 0) return rl;
    return this.page.locator(fallback);
  }
}
