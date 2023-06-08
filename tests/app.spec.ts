import { expect, test } from '@playwright/test';
import {faceitUrl} from "../constants";

test('should start page', async ({ page }) => {
    await page.goto(faceitUrl);

    await page.waitForSelector("#home-landing-page");
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/FACEIT/);
});