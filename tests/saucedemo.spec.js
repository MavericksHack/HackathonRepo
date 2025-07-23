// sauce-demo.spec.js
const { test, expect } = require('@playwright/test');

const loginUrl = 'https://www.saucedemo.com/';

test.describe('Sauce Demo Login Page Tests', () => {
  
  // POSITIVE TEST CASES
  test('Valid login with correct credentials', async ({ page }) => {
    await page.goto(loginUrl);
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('Verify username and password fields are visible and enabled', async ({ page }) => {
    await page.goto(loginUrl);
    await expect(page.locator('#user-name')).toBeVisible();
    await expect(page.locator('#user-name')).toBeEnabled();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#password')).toBeEnabled();
  });

  // NEGATIVE TEST CASES
  test('Invalid username with valid password shows error', async ({ page }) => {
    await page.goto(loginUrl);
    await page.fill('#user-name', 'invalid_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
  });

  test('Valid username with invalid password shows error', async ({ page }) => {
    await page.goto(loginUrl);
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'wrong_password');
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
  });

  test('Both username and password invalid shows error', async ({ page }) => {
    await page.goto(loginUrl);
    await page.fill('#user-name', 'invalid_user');
    await page.fill('#password', 'wrong_password');
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
  });

  test('Empty username and password fields show validation error', async ({ page }) => {
    await page.goto(loginUrl);
    await page.click('#login-button');
    // Assume error is shown in locator '[data-test="error"]'
    await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
  });

  test('Attempt login with script tags or SQL injection strings', async ({ page }) => {
    await page.goto(loginUrl);
    await page.fill('#user-name', "<script>alert(1)</script>");
    await page.fill('#password', "<script>alert(1)</script>");
    await page.click('#login-button');
    // Expect error or safe handling
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('Login with special characters', async ({ page }) => {
    await page.goto(loginUrl);
    await page.fill('#user-name', '!@#$%^&*()');
    await page.fill('#password', '!@#$%^&*()');
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
  });
});