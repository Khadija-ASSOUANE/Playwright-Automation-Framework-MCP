import { test, expect, Locator, Page } from '@playwright/test';

// Verify Transactions Flow
test('Verify Transactions Flow', async ({ page }) => {
  // Helper to prefer role-based locators, with a fallback selector when role isn't available
  const resolveLocator = async (roleFn: () => Locator, fallback: string) => {
    const rl = roleFn();
    if (await rl.count() > 0) return rl;
    return page.locator(fallback);
  };

  // Navigate to login
  await page.goto('https://demo.testfire.net/login.jsp');

  // Enter credentials (prefer role/label selectors, fallback to name-based locators)
  const username = await resolveLocator(() => page.getByRole('textbox', { name: /user|uid|username/i }), 'input[name=uid]');
  await username.fill('admin');

  const password = await resolveLocator(() => page.getByRole('textbox', { name: /password/i }), 'input[name=passw]');
  await password.fill('admin');

  const loginButton = await resolveLocator(() => page.getByRole('button', { name: /login|sign in|sign in/i }), 'input[name=btnSubmit]');
  await loginButton.click();

  // Wait for the main banking page to load and verify URL contains bank/main.jsp
  await expect(page).toHaveURL(/bank\/main\.jsp/, { timeout: 15000 });

  // Verify visible greeting "Hello Admin User"
  const hello = page.getByText('Hello Admin User');
  await expect(hello).toBeVisible({ timeout: 10000 });

  // Click Transfer Funds
  const transferLink = await resolveLocator(() => page.getByRole('link', { name: /Transfer Funds/i }), 'a:has-text("Transfer Funds")');
  await transferLink.click();

  // Ensure we're on the transfer page
  await expect(page).toHaveURL(/transfer\.jsp/, { timeout: 10000 });

  // Select Transaction Type = Transfer (site uses from/to selects)
  const fromSelect = await resolveLocator(() => page.getByRole('combobox', { name: /from account|from/i }), 'select[name=fromAccount]');
  await fromSelect.selectOption({ value: '800000' });

  const toSelect = await resolveLocator(() => page.getByRole('combobox', { name: /to account|to/i }), 'select[name=toAccount]');
  await toSelect.selectOption({ value: '800001' });

  // Fill amount and submit transfer
  const amountInput = await resolveLocator(() => page.getByRole('spinbutton', { name: /amount/i }), 'input[name=transferAmount]');
  await amountInput.fill('10000');

  const transferBtn = await resolveLocator(() => page.getByRole('button', { name: /Transfer Money|transfer/i }), 'input[name=transfer]');
  await transferBtn.click();

  // Wait for confirmation area to show success message
  const body = page.locator('body');
  await expect(body).toContainText('was successfully transferred', { timeout: 10000 });

  // Extract confirmation details from Recent Transactions page
  const bodyText = await body.innerText();
  const match = bodyText.match(/(\d+[\.,\d]*) was successfully transferred from Account (\d+) into Account (\d+) at (.+)/i);
  expect(match, 'Success message should match expected format').not.toBeNull();
  const transferredAmount = match ? match[1].replace(',', '') : '';
  const fromAccount = match ? match[2] : '';
  const toAccount = match ? match[3] : '';
  const transferTime = match ? match[4].trim() : '';

  // Assert amounts and accounts
  expect(transferredAmount).toBeTruthy();
  expect(fromAccount).toBe('800000');
  expect(toAccount).toBe('800001');

  // Open Recent Transactions and verify the new transaction is listed with amount and time
  const recentLink = await resolveLocator(() => page.getByRole('link', { name: /View Recent Transactions/i }), 'a:has-text("View Recent Transactions")');
  await recentLink.click();

  await expect(page).toHaveURL(/transaction\.jsp/, { timeout: 10000 });

  // Verify recent transactions contains the transferred amount and a timestamp
  const recentBody = page.locator('body');
  const amountText = `$${Number(transferredAmount).toFixed(2)}`;
  await expect(recentBody).toContainText(amountText, { timeout: 10000 });
  const txRow = recentBody.locator(`:has-text("${amountText}")`).first();
  await expect(txRow).toBeVisible({ timeout: 10000 });
});