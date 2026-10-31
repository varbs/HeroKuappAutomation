# HeroKuapp Automation

Automated tests written with [Playwright](https://playwright.dev) in JavaScript:

- **UI tests** for [The Internet](https://the-internet.herokuapp.com), a practice site for test automation. They run on Chromium, Firefox, WebKit, Google Chrome and Microsoft Edge.
- **API tests** for [JSONPlaceholder](https://jsonplaceholder.typicode.com), a free fake REST API.

## Explore the repo

- [GitDiagram](https://gitdiagram.com/varbs/herokuappautomation): an interactive diagram of the project's structure
- [GitIngest](https://gitingest.com/varbs/HeroKuappAutomation): the whole codebase as one text digest, handy for pasting into an AI assistant

## What's covered

### UI tests

These live in [tests/ui/login.spec.js](tests/ui/login.spec.js):

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

### API tests

These live in [tests/api/post.spec.js](tests/api/post.spec.js) and use the `/posts` endpoint:

| Request | What it checks |
| --- | --- |
| `GET /posts/1` | Returns 200 and the expected post |
| `POST /posts` | Returns 201 and echoes back the new post with an `id` |
| `PUT /posts/1` | Returns 200 and the updated post |
| `DELETE /posts/1` | Returns 200 |
| `GET /posts/9999` | Returns 404 for a post that doesn't exist |
| `GET /posts` | Returns 100 posts, each with the expected fields and types |

## Project structure

```
.
├── .github/workflows/playwright.yml   # CI on GitHub Actions
├── pages/
│   └── loginPage.js                   # Page object for the login page
├── tests/
│   ├── api/post.spec.js               # API tests
│   ├── ui/login.spec.js               # UI tests
│   └── data/sample.txt                # File used by the upload test
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

The `ui-chrome` and `ui-edge` projects use the Google Chrome and Microsoft Edge browsers installed on your computer. If you don't have them, install them with `npx playwright install chrome msedge`, or skip those projects (see below).

## Running the tests

```bash
# Run everything (UI on all five browsers, plus API)
npx playwright test

# Run only the API tests
npx playwright test --project=api

# Run the UI tests on one browser
npx playwright test --project=ui-chromium

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

For UI tests, screenshots and traces are kept only when a test fails (`'retain-on-failure'` in [playwright.config.js](playwright.config.js)). They're saved to `test-results/` and attached to the report.

## Configuration

Main settings in [playwright.config.js](playwright.config.js):

| Project | Tests | Base URL |
| --- | --- | --- |
| `ui-chromium`, `ui-firefox`, `ui-webkit` | UI | `https://the-internet.herokuapp.com` |
| `ui-chrome`, `ui-edge` | UI, on the installed Chrome and Edge | `https://the-internet.herokuapp.com` |
| `api` | API | `https://jsonplaceholder.typicode.com` |

Because of the base URLs, tests can use short paths such as `page.goto('/login')` or `request.get('/posts/1')`. Failed tests are retried twice on CI and not at all locally.

## Continuous integration

The GitHub Actions workflow in [.github/workflows/playwright.yml](.github/workflows/playwright.yml) runs the suite on every push and pull request to `main` or `master`. It uploads the HTML report as a build artifact and keeps it for 30 days.

## Test credentials

The practice site provides these login details:

- Username: `tomsmith`
- Password: `SuperSecretPassword!`
