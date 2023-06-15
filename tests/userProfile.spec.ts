import {test, expect} from '@playwright/test';
import {faceitUrl} from '../constants';
import {seedNewUser} from './utils/seedNewUser';

const signInButtonSelector = `[data-testid="signin-header"]`;
const emailFieldSelector = `input[type="email"]`;
const passwordFieldSelector = `input[type="password"]`;

test('check user profile exists', async ({page}) => {
    await page.goto(faceitUrl);

    // wait for sign in button to be on the page
    const signInButton = await page.waitForSelector(signInButtonSelector);

    // Click sign in button
    await signInButton.click();

    // Switch the context to the iframe
    const iframeElement = await page.waitForSelector('#parasite-container > iframe');
    const frame = await iframeElement.contentFrame();

    // fetch user credentials
    const user = await seedNewUser();

    // Fill in email and password fields
    const emailField = await frame.waitForSelector(emailFieldSelector);
    await emailField.fill(user.email);

    const passwordField = await frame.waitForSelector(passwordFieldSelector);
    await passwordField.fill(user.password);

    // Click log in button
    const logInButton = await frame.waitForSelector('[type="submit"]');

    await logInButton.click();

    // Check user is logged in
    const userProfile = await page.getByText(user.nickname);
    expect(userProfile).toBeTruthy();

    // Check user profile exists
    const userProfileLink = await page.waitForSelector(`a[href="/en/players/${user.nickname}"] [data-testid="avatar"]`);
    await page.waitForSelector('[data-testid="ContentWrapper"]');
    await userProfileLink.click();

    // redirect to user profile page
    await page.waitForURL( `${faceitUrl}/en/players/${user.nickname}`);

    // Check player banner exists
    const playerBanner = await page.getByText(`Member since`);
    expect(playerBanner).toBeTruthy();

});
