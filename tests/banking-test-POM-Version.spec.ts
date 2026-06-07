import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import config from '../config.json';
import transferData from '../test-data/Transfer_TestData.json';
import { HomePage } from '../pages/home.page';
import { TransferFundsPage } from '../pages/transfer-funds.page';
import { RecentTransactionsPage } from '../pages/recent-transactions.page';

// Verify Quick Transactions Flow using Page Object Model
test('Verify Transactions Flow', async ({ page }) => {
  const login = new LoginPage(page);
  const home = new HomePage(page);
  const transfer = new TransferFundsPage(page);
  const recent = new RecentTransactionsPage(page);

  await login.goto(config.URL);
  await login.login(config.username, config.password);

  await home.waitForMainPage();
  await home.navigateToTransferFunds();

  await transfer.waitForTransferPage();
  await transfer.selectFromAccount(transferData.fromAccount);
  await transfer.selectToAccount(transferData.toAccount);
  await transfer.fillAmount(transferData.amount);
  await transfer.submitTransfer();

  const conf = await transfer.getConfirmationDetails();
  expect(conf).not.toBeNull();
  if (!conf) return;
  expect(conf.transferredAmount).toBeTruthy();
  expect(conf.fromAccount).toBe('800000');
  expect(conf.toAccount).toBe('800001');

  await home.openRecentTransactions();
  await recent.waitForRecentTransactions();

  const amountText = `$${Number(conf.transferredAmount).toFixed(2)}`;
  const row = await recent.findRowByAmount(amountText);
  await expect(row).toBeVisible({ timeout: 10000 });
});
