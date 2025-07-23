// sauce-login.spec.js
const { test, expect } = require('@playwright/test');

const loginUrl = 'https://www.saucedemo.com/';

test.describe('Sauce Demo Login Page Tests', () => {

  // Positive Test: Valid login
  test('Login with valid credentials', async ({ page }) => {
    await page.goto(loginUrl);
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL(/inventory.html/);
  });

  // Verify input fields visibility and enabled
  test('Username and Password fields are visible and enabled', async ({ page }) => {
    await page.goto(loginUrl);
    await expect(page.locator('#user-name')).toBeVisible();
    await expect(page.locator('#user-name')).toBeEnabled();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#password')).toBeEnabled();
  });

  // Negative Test: Invalid username
  test('Invalid username shows error', async ({ page }) => {
    await page.goto(loginUrl);
    await page.fill('#user-name', 'invalid_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
  });

  // Negative Test: Invalid password
  test('Invalid password shows error', async ({ page }) => {
    await page.goto(loginUrl);
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'wrong_password');
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
  });

  // Negative Test: Both invalid
  test('Invalid username and password shows error', async ({ page }) => {
    await page.goto(loginUrl);
    await page.fill('#user-name', 'bad_user');
    await page.fill('#password', 'bad_password');
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
  });

  // Negative Test: Blank inputs
  test('Blank username and password shows error', async ({ page }) => {
    await page.goto(loginUrl);
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
  });

  // Security test: Script injection attempt
  test('Script injection attempt handled securely', async ({ page }) => {
    await page.goto(loginUrl);
    await page.fill('#user-name', "<script>alert(1)</script>");
    await page.fill('#password', "<script>alert(1)</script>");
    await page.click('#login-button');
    // Expect no pop-up and error message or safe handling
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  // Special characters test
  test('Special characters in inputs', async ({ page }) => {
    await page.goto(loginUrl);
    await page.fill('#user-name', '!@#$%^&*()');
    await page.fill('#password', '!@#$%^&*()');
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
  });
});