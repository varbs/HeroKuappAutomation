const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/loginPage');

test('Verify the page title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('The Internet');
});

test('Verify valid login', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Username').fill('tomsmith');
    await page.getByLabel('Password').fill('SuperSecretPassword!');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/secure/);
    await expect(page.getByText('You logged into a secure area!')).toBeVisible();
});

test('Verify login with wrong password', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Username').fill('tomsmith');
    await page.getByLabel('Password').fill('wrongPassword');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Your password is invalid!')).toBeVisible();
});

test('Verify login with Page object Model', async ({ page }) => {
    const login = new LoginPage(page);

    await page.goto('/login');
    await login.login('tomsmith', 'SuperSecretPassword!');

    await expect(page).toHaveURL(/secure/);
});

const cases = [
    {
        name: 'valid user',
        username: 'tomsmith',
        password: 'SuperSecretPassword!',
        expected: 'You logged into a secure area!'
    },
    {
        name: 'wrong password',
        username: 'tomsmith',
        password: 'wrongPassword',
        expected: 'Your password is invalid!'
    },
    {
        name: 'wrong username',
        username: 'wrongUsername',
        password: 'SuperSecretPassword!',
        expected: 'Your username is invalid!'
    }
];

test.describe('Login test with data-driven approach', () => {
    for (const c of cases) {
        test(`Verify login with ${c.name}`, async ({ page }) => {
            const login = new LoginPage(page);
            await page.goto('/login');
            await login.login(c.username, c.password);

            await expect(page.getByText(c.expected)).toBeVisible();
        });
    }
});

test('Verify checkboxes can be checked', async ({ page }) => {
    await page.goto('checkboxes');

    const boxes = page.locator('#checkboxes input');

    await boxes.nth(0).check();
    await expect(boxes.nth(0)).toBeChecked();

    await boxes.nth(1).uncheck();
    await expect(boxes.nth(1)).not.toBeChecked();
});

test('Verify dropdown selection', async ({ page }) => {
    await page.goto('/dropdown');

    await await page.getByRole('combobox').selectOption('Option 1');
    await expect(page.getByRole('combobox')).toHaveValue('1');

    await await page.getByRole('combobox').selectOption('Option 2');
    await expect(page.getByRole('combobox')).toHaveValue('2');
});

test('Verify link opens a new tab', async ({ page }) => {
    await page.goto('/windows');

    const [newTab] = await Promise.all([
        page.waitForEvent('popup'),
        page.getByRole('link', { name: 'Click Here' }).click()
    ]);

    await expect(newTab.getByRole('heading', { name: 'New Window' })).toBeVisible();
});

test.describe('Login UI', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
    })

    test('Verify username field is visible', async ({ page }) => {
        await expect(page.getByLabel('Username')).toBeVisible();
    });

    test('Verify password field is visible', async ({ page }) => {
        await expect(page.getByLabel('Password')).toBeVisible();
    });

    test('Verify login button is visible', async ({ page }) => {
        await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    });
});


test.describe('Login with soft assertions', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
    });

    test('Verify username is visible', async ({ page }) => {
        await expect.soft(page.getByLabel('Username')).toBeVisible();
    });

    test('Verify password is visible', async ({ page }) => {
        await expect.soft(page.getByLabel('Password')).toBeVisible();
    });

    test('Verify login button is visible', async ({ page }) => {
        await expect.soft(page.getByRole('button', { name: 'Login' })).toBeVisible();
    });
});

test('Verify hover shows user name', async ({ page }) => {
    await page.goto('/hovers');
    await page.locator('.figure').first().hover();
    await expect(page.getByText('name: user1')).toBeVisible();

    await page.locator('.figure').nth(1).hover();
    await expect(page.getByText('name: user2')).toBeVisible();
});

test('Verify tables has 4 rows', async ({ page }) => {
    await page.goto('/tables');

    const table1Row = page.locator('#table1 tbody tr');
    await expect(table1Row).toHaveCount(4);

    const firstRowText = await table1Row.first().innerText();
    console.log('First row text:', firstRowText);

    const table2Row = page.locator('#table2 tbody tr');
    await expect(table2Row).toHaveCount(4);

    const secondRowText = await table2Row.nth(1).innerText();
    console.log('Second row text:', secondRowText);
});

test('Verify file upload', async ({ page }) => {
    await page.goto('/upload');
    await page.setInputFiles('#file-upload', 'tests/data/sample.txt');
    await page.getByRole('button', { name: 'Upload' }).click();

    await expect(page.getByText('File Uploaded!')).toBeVisible();
});

test('Verify login sends a request', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Username').fill('tomsmith');
    await page.getByLabel('Password').fill('SuperSecretPassword!');

    const [reponse] = await Promise.all([
        page.waitForResponse(res => res.url().includes('/authenticate')),
        page.getByRole('button', { name: 'Login' }).click(),
    ]);

    expect(reponse.status()).toBeLessThan(400);
});

test('Verify and capture login page', async ({ page }) => {
    await page.goto('/login');
    await page.screenshot({ path: 'login.png' });
});

test('Verify page shows an error when the API fails', async ({ page }) => {
    await page.route('***/api/products', route =>
        route.fulfill({ status: 500, body: 'Server error' })
    );

    await page.goto('products');
});


test('Verify accepting a JS alert', async ({ page }) => {
    await page.goto('/javascript_alerts');

    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'Click for JS Alert' }).click();

    await expect(page.getByText('You successfully clicked an alert')).toBeVisible();
});

const alertCases = [
    {
        buttonName: 'JS Alert',
        expectedText: 'You successfully clicked an alert'
    },
    {
        buttonName: 'JS Confirm',
        expectedText: 'You clicked: Ok'
    },
    {
        buttonName: 'JS Prompt',
        expectedText: 'You entered:'
    },
];


test.describe('Verify accepting a different JS alerts', () => {
    for (const c of alertCases) {
        test(`Verify accepting a 'Click for ${c.buttonName}'`, async ({ page }) => {
            await page.goto('/javascript_alerts');

            page.once('dialog', dialog => dialog.accept());
            await page.getByRole('button', { name: `Click for ${c.buttonName}` }).click();

            await expect(page.getByText(`${c.expectedText}`)).toBeVisible();
        });
    }
});


