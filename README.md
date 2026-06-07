# Playwright Automation Framework (POC)

This repository is a Playwright-based automation framework built with a Page Object Model (POM) and supported by live exploration using Playwright's MCP (Multi-Context Playwright) tooling.

## Structure

Project tree (illustrative):

```
.
├── pages/
│   ├── base.page.ts
│   ├── login.page.ts
│   ├── home.page.ts
│   ├── transfer-funds.page.ts
│   └── recent-transactions.page.ts
├── tests/
│   ├── banking-test-V3.spec.ts
│   ├── banking-test-Advanced-Version.spec.ts
│   └── banking-test-Initial-Version.spec.ts
├── test-data/
│   └── Transfer_TestData.json
├── config.json
└── README.md
```

(This tree is for documentation purposes only — use actual files in the workspace.)

## Prerequisites

- Node.js (16+)
- Playwright installed in the project (see `package.json`).
- Optional: access to Playwright MCP tools when doing live exploration.

## Running tests

Run all tests:

```bash
npx playwright test
```

Run a single spec file:

```bash
npx playwright test tests/banking-test-Advanced-Version.spec.ts --workers=1
```

## Where to change test data and config

- Update `config.json` to change `URL`, `username`, `password`, and `appName`.
- Add or modify transfer cases in `test-data/Transfer_TestData.json`.

## How MCP and prompts were used (workflow)

1. Use Playwright MCP to open the application in a real browser tab and perform live interactions. MCP lets you run Playwright code snippets via an interactive session to inspect the DOM and validate selectors.
2. During exploration we:
   - Opened the login URL from `config.json`.
   - Used MCP to fill credentials and submit the login form.
   - Evaluated the main page DOM to locate the tab elements (e.g., "View Account Summary").
   - Captured reliable locators and updated page objects accordingly.

Tips for using MCP interactively:

- From an MCP-capable prompt, run `await page.goto(config.URL)` to open the page.
- Use `await page.locator('selector').click()` or `await page.getByRole(...)` to interact.
- Use `await page.evaluate(() => { ... })` to run page-side scripts to inspect textContent or build selectors.

## Prompts and test generation

- The framework was built by iteratively prompting an assistant with clear goals (e.g., "Create POM classes", "Find reliable selectors via live exploration").
- Prompts used should include: desired file path, brief behavior description, and whether to prefer role-based locators with fallbacks.
- Example prompt pattern:

```
Create a Page Object `pages/LoginPage` with a `login(username, password)` method that prefers role-based locators and falls back to `input[name=uid]` and `input[name=passw]`.
```

## Best practices included

- Page Object Model for separation of concerns (`pages/` folder).
- Prefer `getByRole` with accessible name matchers, fall back to stable attributes.
- Centralize selectors and config (`pages/selectors.ts`, `config.json`).
- Keep test data separate under `test-data/`.

## Extending the framework

- To add a new page object, create a file under `pages/` and export a class that extends `BasePage`.
- To add data-driven tests, import JSON arrays from `test-data/` and use `test.describe` / `test.each` patterns.

## Troubleshooting

- If locator lookups fail, re-run an MCP exploration session and inspect the live DOM to update selectors.
- Use `npx playwright show-report` to open the HTML report when tests fail.
