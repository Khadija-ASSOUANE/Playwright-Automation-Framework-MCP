import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { SELECTORS } from './selectors';

export class RecentTransactionsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async waitForRecentTransactions() {
    await this.page.waitForURL(/transaction\.jsp/, { timeout: 10000 });
  }

  async findRowByAmount(amountText: string) {
    const recentBody = this.page.locator(SELECTORS.BODY);
    await recentBody.waitFor({ state: 'visible', timeout: 10000 });
    const txRow = recentBody.locator(`:has-text("${amountText}")`).first();
    return txRow;
  }


}
