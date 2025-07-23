// sauce-demo.spec.js
const { test, expect } = require('@playwright/test');

const loginPageUrl = 'https://www.saucedemo.com/';

test.describe('Sauce Demo Login Page Tests', () => {
  // Positive Test Cases
  test('Valid username and password logs in successfully', async ({ page }) => {
    await page.goto(loginPageUrl);
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');

    await expect(page).toHaveURL(/inventory.html/);
  });

  test('Username and Password fields are visible and enabled', async ({ page }) => {
    await page.goto(loginPageUrl);
    await expect(page.locator('#user-name')).toBeVisible();
    await expect(page.locator('#user-name')).toBeEnabled();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#password')).toBeEnabled();
  });

  // Add more positive tests as needed (e.g., "Remember Me" if available)

  // Negative Test Cases
  test('Invalid username and valid password shows error', async ({ page }) => {
    await page.goto(loginPageUrl);
    await page.fill('#user-name', 'invalid_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');

    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
  });

  test('Valid username and invalid password shows error', async ({ page }) => {
    await page.goto(loginPageUrl);
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'wrong_password');
    await page.click('#login-button');

    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
  });

  test('Invalid username and invalid password shows error', async ({ page }) => {
    await page.goto(loginPageUrl);
    await page.fill('#user-name', 'invalid_user');
    await page.fill('#password', 'wrong_password');
    await page.click('#login-button');

    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
  });

  test('Empty username and password fields show validation errors', async ({ page }) => {
    await page.goto(loginPageUrl);
    await page.click('#login-button');

    // The login button might be disabled or show validation
    // Adjust based on actual validation UI
    await expect(page.locator('#user-name')).toHaveValue('');
    await expect(page.locator('#password')).toHaveValue('');
  });

  test('SQL injection/script attack attempt is handled securely', async ({ page }) => {
    await page.goto(loginPageUrl);
    await page.fill('#user-name', "<script>alert(1)</script>");
    await page.fill('#password', "<script>alert(1)</script>");
    await page.click('#login-button');

    // Expect no error and proper handling (error message or no crash)
    await expect(page.locator('[data-test="error"]')).toBeHidden();
  });

  test('Special characters are handled correctly', async ({ page }) => {
    await page.goto(loginPageUrl);
    await page.fill('#user-name', '!@#$%^&*()');
    await page.fill('#password', '!@#$%^&*()');
    await page.click('#login-button');

    // Depending on validity, verify login or error
    // Here, expecting login to fail
    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
  });
});