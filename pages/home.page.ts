import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { SELECTORS } from './selectors';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async waitForMainPage() {
    await this.page.waitForURL(/bank\/main\.jsp/, { timeout: 15000 });
    const hello = this.page.getByText('Hello Admin User');
    await this.isVisible(hello, 10000);
  }

  async navigateToTransferFunds() {
    const transferLink = await this.resolveLocator(() => this.page.getByRole('link', { name: /Transfer Funds/i }), SELECTORS.TRANSFER_LINK);
    await transferLink.click();
  }

  async openRecentTransactions() {
    const recentLink = await this.resolveLocator(() => this.page.getByRole('link', { name: /View Recent Transactions/i }), SELECTORS.RECENT_LINK);
    await recentLink.click();
  }

  getTabLocator(tabText: string) {
    return this.page.getByText(tabText, { exact: false });
  }
}
