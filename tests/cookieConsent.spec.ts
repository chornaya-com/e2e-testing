import {test} from '@playwright/test';
import {faceitUrl} from "../constants";

const cookieBannerSelector = `[id="onetrust-banner-sdk"]`;
const hiddenState = 'hidden';

test('accept cookies', async ({page}) => {
    await page.goto(faceitUrl);

    // wait for cookie banner to be on the page
     await page.waitForSelector(cookieBannerSelector);

    // click on accept cookies button
    await page.getByRole('button', {name: 'Accept cookies'}).click();

    // reload page
    await page.reload();

    // check that cookie banner is not on the page
    await page.waitForSelector(cookieBannerSelector, {state: hiddenState});
})