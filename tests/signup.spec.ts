import {test, expect} from '@playwright/test';
import {faceitUrl} from '../constants';

// Selectors to be replaced with proper ones more stable and reliable based on test-ids

const signUpButtonSelector = `[data-testid="signup-header"]`;
const emailFieldSelector = `input[type="email"]`;
const nicknameFieldSelector = `input[id="nickname"]`;
const firstNameFieldSelector = `input[id="firstname"]`;
const lastNameFieldSelector = `input[id="lastname"]`;
const passwordFieldSelector = `input[id="password"]`;
const confirmPasswordFieldSelector = `input[id="passwordConfirm"]`;
const dropdownSelector = `.sc-fxwrCY.dfinVz`;
const dateSelector = `#selected\\.2`;
const monthSelector = `#selected\\.3`;
const yearSelector = `#selected\\.30`;
const countrySelector = `#selected\\.232`

// mock backend response
async function seedNewUserForTest() {

    return Promise.resolve({
        email: `e2e_${Number.parseInt(`${Math.random() * 1000}`)}@mail.com`,
        password: `faceit!${Number.parseInt(`${Math.random() * 1000}`)}`,
        nickname: `e2e_${Number.parseInt(`${Math.random() * 1000}`)}`,
        firstName: 'John',
        lastName: 'Doe'
    });
}

const cookieBannerSelector = `[id="onetrust-banner-sdk"]`;

test('sign up flow', async ({page}) => {
    await page.goto(faceitUrl);

    // wait for cookie banner to be on the page
    await page.waitForSelector(cookieBannerSelector);

    // click on accept cookies button
    await page.getByRole('button', {name: 'Accept cookies'}).click();


    // wait for sign in button to be on the page
    const signUpButton = await page.waitForSelector(signUpButtonSelector);

    // Click sign in button
    await signUpButton.click();

    // Switch the context to the iframe
    const iframeElement = await page.waitForSelector('#parasite-container > iframe');
    const frame = await iframeElement.contentFrame();

    if (!frame) {
        throw "frame must be on the page"
    }

    // fetch user credentials
    const user = await seedNewUserForTest();

    // Fill in email and password fields
    const emailField = await frame.waitForSelector(emailFieldSelector);
    await emailField.type(user.email);

    // Click continue in button
    const continueButton = await frame.waitForSelector('[type="submit"]');

    await continueButton.click();

    const nicknameField = await frame.waitForSelector(nicknameFieldSelector);
    await nicknameField.type(user.nickname);

    const firstNameField = await frame.waitForSelector(firstNameFieldSelector);
    await firstNameField.type(user.firstName);

    const lastNameField = await frame.waitForSelector(lastNameFieldSelector);
    await lastNameField.type(user.lastName);

    const passwordField = await frame.waitForSelector(passwordFieldSelector);
    await passwordField.type(user.password);

    const confirmPasswordField = await frame.waitForSelector(confirmPasswordFieldSelector);
    await confirmPasswordField.type(user.password);

    const dropdowns = await frame.$$(dropdownSelector);

    const selectDateDropdownField = dropdowns[0];
    const selectMonthDropdownField = dropdowns[1];
    const selectYearDropdownField = dropdowns[2];
    const selectCountryDropdownField = dropdowns[3];

    await selectDateDropdownField.click();

    const selectedDateField = await frame.waitForSelector(dateSelector);
    await selectedDateField.click();

    // select month from dropdown
    await selectMonthDropdownField.click();

    const selectedMonthField = await frame.waitForSelector(monthSelector);
    await selectedMonthField.click();

    // select year from dropdown
    await selectYearDropdownField.click();

    const selectedYearField = await frame.waitForSelector(yearSelector);
    await selectedYearField.click();

    // select country from dropdown
    await selectCountryDropdownField.click();

    const selectedCountryField = await frame.waitForSelector(countrySelector);
    await selectedCountryField.click();

    const createAccountButton = await frame.waitForSelector('[type="submit"]');
    await createAccountButton.click();

    // Check user is registered in
    const userProfile = await page.waitForSelector(`[data-testid="avatar"]`);
    expect(userProfile).toBeTruthy();
});
