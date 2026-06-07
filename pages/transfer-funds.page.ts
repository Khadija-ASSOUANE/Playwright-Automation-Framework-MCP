import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { SELECTORS } from './selectors';

export class TransferFundsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async waitForTransferPage() {
    await this.page.waitForURL(/transfer\.jsp/, { timeout: 10000 });
  }

  async selectFromAccount(value: string) {
    const fromSelect = await this.resolveLocator(() => this.page.getByRole('combobox', { name: /from account|from/i }), SELECTORS.FROM_SELECT);
    await fromSelect.selectOption({ value });
  }

  async selectToAccount(value: string) {
    const toSelect = await this.resolveLocator(() => this.page.getByRole('combobox', { name: /to account|to/i }), SELECTORS.TO_SELECT);
    await toSelect.selectOption({ value });
  }

  async fillAmount(amount: string) {
    const amountInput = await this.resolveLocator(() => this.page.getByRole('spinbutton', { name: /amount/i }), SELECTORS.AMOUNT_INPUT);
    await amountInput.fill(amount);
  }

  async submitTransfer() {
    const transferBtn = await this.resolveLocator(() => this.page.getByRole('button', { name: /Transfer Money|transfer/i }), SELECTORS.TRANSFER_BTN);
    await transferBtn.click();
  }

  async getConfirmationDetails() {
    const body = this.page.locator(SELECTORS.BODY);
    await body.waitFor({ state: 'visible', timeout: 10000 });
    const bodyText = await body.innerText();
    const match = bodyText.match(/(\d+[\.,\d]*) was successfully transferred from Account (\d+) into Account (\d+) at (.+)/i);
    if (!match) return null;
    return {
      transferredAmount: match[1].replace(',', ''),
      fromAccount: match[2],
      toAccount: match[3],
      transferTime: match[4].trim(),
    };
  }
}
