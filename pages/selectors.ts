export const URLS = {
  BASE: 'https://demo.testfire.net',
  LOGIN: 'https://demo.testfire.net/login.jsp',
};

export const SELECTORS = {
  USERNAME_FALLBACK: 'input[name=uid]',
  PASSWORD_FALLBACK: 'input[name=passw]',
  LOGIN_BTN_FALLBACK: 'input[name=btnSubmit]',

  TRANSFER_LINK: 'a:has-text("Transfer Funds")',
  RECENT_LINK: 'a:has-text("View Recent Transactions")',

  FROM_SELECT: 'select[name=fromAccount]',
  TO_SELECT: 'select[name=toAccount]',
  AMOUNT_INPUT: 'input[name=transferAmount]',
  TRANSFER_BTN: 'input[name=transfer]',

  BODY: 'body',
  HELLO_TEXT: 'Hello Admin User',
};
