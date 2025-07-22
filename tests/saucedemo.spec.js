const { test, expect } = require('@playwright/test');

test.describe('Login Page Tests', () => {

  // Before each test, navigate to the login page
  test.beforeEach(async ({ page }) => {
    await page.goto('https://saucedemo.com/');
  });

  test('TC001: Login with valid credentials', async ({ page }) => {
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL(/inventory.html/);
    // Additional checks can be added to verify successful login
  });

  test('TC002: Login with invalid username', async ({ page }) => {
    await page.fill('#user-name', 'invalid_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page.locator('.error-message-container')).toBeVisible();
    await expect(page.locator('.error-message-container')).toContainText('Username and password do not match');
  });

  test('TC003: Login with invalid password', async ({ page }) => {
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'wrong_password');
    await page.click('#login-button');
    await expect(page.locator('.error-message-container')).toBeVisible();
    await expect(page.locator('.error-message-container')).toContainText('Username and password do not match');
  });

  test('TC004: Login with empty username', async ({ page }) => {
    await page.fill('#user-name', '');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    // Assuming the app shows an error for empty username
    await expect(page.locator('.error-message-container')).toBeVisible();
  });

  test('TC005: Login with empty password', async ({ page }) => {
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', '');
    await page.click('#login-button');
    // Assuming the app shows an error for empty password
    await expect(page.locator('.error-message-container')).toBeVisible();
  });

  test('TC006: Login with both fields empty', async ({ page }) => {
    await page.fill('#user-name', '');
    await page.fill('#password', '');
    await page.click('#login-button');
    // Expect error message
    await expect(page.locator('.error-message-container')).toBeVisible();
  });

  test('TC007: Error message styling and display', async ({ page }) => {
    await page.fill('#user-name', 'invalid');
    await page.fill('#password', 'invalid');
    await page.click('#login-button');
    const errorMsg = page.locator('.error-message-container');
    await expect(errorMsg).toBeVisible();
    // Additional style assertions can be added if needed
  });

});