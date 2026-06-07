import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { SELECTORS } from './selectors';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async login(usernameValue: string, passwordValue: string) {
    const username = await this.resolveLocator(() => this.page.getByRole('textbox', { name: /user|uid|username/i }), SELECTORS.USERNAME_FALLBACK);
    await username.fill(usernameValue);

    const password = await this.resolveLocator(() => this.page.getByRole('textbox', { name: /password/i }), SELECTORS.PASSWORD_FALLBACK);
    await password.fill(passwordValue);

    const loginButton = await this.resolveLocator(() => this.page.getByRole('button', { name: /login|sign in|sign in/i }), SELECTORS.LOGIN_BTN_FALLBACK);
    await loginButton.click();
  }
}
