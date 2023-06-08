import {test, expect} from '@playwright/test';
import {faceitUrl} from '../constants';

const signInButtonSelector = `[data-testid="signin-header"]`;
const emailFieldSelector = `input[type="email"]`;
const passwordFieldSelector = `input[type="password"]`;


// mock backend response

type SeedNewUserProps = {
    emailVerified?: boolean; // when false backend also should tell pin from the email?
    phoneVerified?: boolean;
}

async function seedNewUserForTest(seedNewUserProps: SeedNewUserProps = {}) {
    return Promise.resolve({
        email: 'Follo_22@faceit.com',
        password: 'faceit',
        nickname: 'nickname',
    });
}

test('sign in flow', async ({page}) => {
    await page.goto(faceitUrl);

    // wait for sign in button to be on the page
    const signInButton = await page.waitForSelector(signInButtonSelector);

    // Click sign in button
    await signInButton.click();

    // Switch the context to the iframe
    const iframeElement = await page.waitForSelector('#parasite-container > iframe');
    const frame = await iframeElement.contentFrame();

    // fetch user credentials
    const user = await seedNewUserForTest();

    // Fill in email and password fields
    const emailField = await frame.waitForSelector(emailFieldSelector);
    await emailField.fill(user.email);

    const passwordField = await frame.waitForSelector(passwordFieldSelector);
    await passwordField.fill(user.password);

    // Click log in button
    const logInButton = await frame.waitForSelector('[type="submit"]');

    await logInButton.click();

    // redirect to home page
    await page.waitForURL(faceitUrl + '/home');

    // Check user is logged in
    const userProfile = await page.getByText(user.nickname);
    expect(userProfile).toBeTruthy();
});
