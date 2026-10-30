# HeroKuapp Automation

End-to-end UI tests for [The Internet](https://the-internet.herokuapp.com), a practice site for test automation, written with [Playwright](https://playwright.dev) in JavaScript.

The tests run on Chromium, Firefox and WebKit.

## What's covered

All tests live in [tests/login.spec.js](tests/login.spec.js):

| Area | What it checks |
| --- | --- |
| Home page | The page title is "The Internet" |
| Login | Valid login, wrong password, and wrong username (data-driven) |
| Login (Page Object Model) | Login through the `LoginPage` class |
| Login UI | The username, password and login button are visible (hard and soft assertions) |
| Checkboxes | Checking and unchecking |
| Dropdown | Choosing options |
| Multiple windows | A link opens a new tab |
| Hovers | Hovering shows the user's name |
| Tables | Row counts and row text |
| File upload | Uploading [tests/data/sample.txt](tests/data/sample.txt) |
| Network | The login form sends an `/authenticate` request that succeeds |
| Network mocking | Routing an API call to return a 500 |
| Screenshots | Saving a screenshot of the login page to `login.png` |
| JavaScript alerts | Accepting alert, confirm and prompt dialogs |

## Project structure

```
.
├── .github/workflows/playwright.yml   # CI on GitHub Actions
├── pages/
│   └── loginPage.js                   # Page object for the login page
├── tests/
│   ├── data/sample.txt                # File used by the upload test
│   └── login.spec.js                  # Test suite
├── playwright.config.js               # Playwright settings
└── package.json
```

## Requirements

- [Node.js](https://nodejs.org) (LTS version)

## Setup

```bash
npm install
npx playwright install
```

## Running the tests

```bash
# Run everything on all three browsers
npx playwright test

# Run on one browser
npx playwright test --project=chromium

# Run one test by name
npx playwright test -g "Verify valid login"

# Watch the browser while the tests run
npx playwright test --headed

# Open the interactive UI mode
npx playwright test --ui
```

## Reports

Each run writes an HTML report to `playwright-report/`. To open it:

```bash
npx playwright show-report
```

Screenshots and traces are recorded for every test (`screenshot: 'on'` and `trace: 'on'` in [playwright.config.js](playwright.config.js)). They're saved to `test-results/` and attached to the report.

## Configuration

Main settings in [playwright.config.js](playwright.config.js):

- **`baseURL`**: `https://the-internet.herokuapp.com`, so tests can call `page.goto('/login')`
- **Browsers**: Chromium, Firefox and WebKit
- **Parallel runs**: on locally; on CI, tests use one worker and get 2 retries

## Continuous integration

The GitHub Actions workflow in [.github/workflows/playwright.yml](.github/workflows/playwright.yml) runs the suite on every push and pull request to `main` or `master`. It uploads the HTML report as a build artifact and keeps it for 30 days.

## Test credentials

The practice site provides these login details:

- Username: `tomsmith`
- Password: `SuperSecretPassword!`
