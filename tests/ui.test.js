const { test, expect } = require('@playwright/test');

const baseUrl = 'http://localhost:3000/';

const user = 'peter@abv.bg';
const password = '123456';

const allBoosLinkSelector = 'a[href="/catalog"]';
const myBooksLinkSelector = 'a[href="/profile"]';
const addBookLinkSelector = 'a[href="/create"]';

const loginButtonSelector = 'a[href="/login"]';
const logoutButtonSelector = '#logoutBtn';
const registerButtonSelector = 'a[href="/register"]';
const submitButtonSelector = 'input[type="submit"]';
const createBookSubmitButtonSelector = '#create-form input[type="submit"]';
const otherBooksButtonSelector = '.otherBooks a.button';
const editButtonSelector = '.actions a:nth-child(1)';
const deleteButtonSelector = 'a[href="javascript:void(0)"]';
const likeButtonSelector = '.actions a[href="javascript:void(0)"]';

const emailInputSelector = 'input[name="email"]';
const passwordInputSelector = 'input[name="password"]';
const repeatPasswordInputSelector = 'input[name="confirm-pass"]';

const createFormSelector = '#create-form';
const titleSelector = '#title';
const descriptionSelector = '#description';
const imageSelector = '#image';
const typeSelector = '#type';
const dashboardSelector = '.dashboard';
const bookElementsSelector = '.other-books-list li';
const noBooksSelector = '.no-books';
const otherBooksSelector = '.otherBooks';
const bookInformationSelector = '.book-information';
const detailsPageTitleSelector = '.book-information h3';
const detailsPageTypeSelector = '.book-information .type';
const detailsPageImageSelector = '.img img';
const bookDescriptionTitleSelector = '.book-description h3';
const bookDescriptionContentSelector = '.book-description p';

//By default, dialogs are auto-dismissed by Playwright!!! 

// Verifying links
test('Verify "All books" is visible', async ({ page }) => {
    await page.goto(baseUrl);
    await page.waitForSelector('nav.navbar');

    const allBoosLink = await page.$(allBoosLinkSelector);
    const isLinkVisible = await allBoosLink.isVisible();

    expect(isLinkVisible).toBe(true);
});

test('Verify "Login" button is visible', async ({ page }) => {
    await page.goto(baseUrl);
    await page.waitForSelector('nav.navbar');

    const loginButton = await page.$(loginButtonSelector);
    const isLoginButtonVisible = await loginButton.isVisible();

    expect(isLoginButtonVisible).toBe(true);
});

test('Verify "Register" button is visible', async ({ page }) => {
    await page.goto(baseUrl);
    await page.waitForSelector('nav.navbar');

    const registerButton = await page.$(registerButtonSelector);
    const isRegisterButtonVisible = await registerButton.isVisible();

    expect(isRegisterButtonVisible).toBe(true);
});

test('Verify "All books" is visible after user login', async ({ page }) => {
    await page.goto(baseUrl + 'login');
    await page.fill(emailInputSelector, user);
    await page.fill(passwordInputSelector, password);
    await page.click(submitButtonSelector);

    const allBooksLink = await page.$(allBoosLinkSelector);
    const isAllBooksLinkVisible = await allBooksLink.isVisible();

    expect(isAllBooksLinkVisible).toBe(true);
});

test('Verify "My Books" link is visible after user login', async ({ page }) => {
    await page.goto(baseUrl + 'login');
    await page.fill(emailInputSelector, user);
    await page.fill(passwordInputSelector, password);
    await page.click(submitButtonSelector);

    const myBooksLink = await page.$(myBooksLinkSelector);
    const isMyBooksIsVisible = await myBooksLink.isVisible();

    expect(isMyBooksIsVisible).toBe(true);
});

test('Verify "Add Book" link and "Logout button" is visible after user login', async ({ page }) => {
    await page.goto(baseUrl + 'login');
    await page.fill(emailInputSelector, user);
    await page.fill(passwordInputSelector, password);
    await page.click(submitButtonSelector);

    // check button
    const logoutButton = await page.$(logoutButtonSelector);
    const isLogoutButtonVisible = await logoutButton.isVisible();
    expect(isLogoutButtonVisible).toBe(true);

    // check link
    const addBookLink = await page.$(addBookLinkSelector);
    const isAddBookIsVisible = await addBookLink.isVisible();

    expect(isAddBookIsVisible).toBe(true);
});

// Verifying Login page
test('Login with valid credentials', async ({ page }) => {
    await page.goto(baseUrl + 'login');
    await page.fill(emailInputSelector, user);
    await page.fill(passwordInputSelector, password);
    await page.click(submitButtonSelector);

    await page.$(allBoosLinkSelector);

    expect(page.url()).toBe(baseUrl + 'catalog');
});

test('Submit the form with empty input fields', async ({ page }) => {
    await page.goto(baseUrl + 'login');
    await page.click(submitButtonSelector);

    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });

    await page.$(loginButtonSelector);

    expect(page.url()).toBe(baseUrl + 'login');
});

test('Submit the form with empty email input field', async ({ page }) => {
    await page.goto(baseUrl + 'login');
    await page.fill(passwordInputSelector, password);
    await page.click(submitButtonSelector);

    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });

    await page.$(loginButtonSelector);

    expect(page.url()).toBe(baseUrl + 'login');
});

test('Submit the form with empty password input field', async ({ page }) => {
    await page.goto(baseUrl + 'login');
    await page.fill(emailInputSelector, user);
    await page.click(submitButtonSelector);

    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });

    await page.$(loginButtonSelector);

    expect(page.url()).toBe(baseUrl + 'login');
});

// Verifying Register page

// Once run this test the username will be in the database so that the test will be skipped if all tests run without rerun the server
test.skip('Register with valid credentials', async ({ page }) => {
    await page.goto(baseUrl + 'register');
    await page.fill(emailInputSelector, 'testRegister@abv.bg');
    await page.fill(passwordInputSelector, password);
    await page.fill(repeatPasswordInputSelector, password);
    await page.click(submitButtonSelector);

    await page.$(allBoosLinkSelector);

    //check link
    expect(page.url()).toBe(baseUrl + 'catalog');

    // check button
    const logoutButton = await page.$(logoutButtonSelector);
    const isLogoutButtonVisible = await logoutButton.isVisible();
    expect(isLogoutButtonVisible).toBe(true);
});

test('Register with empty input fields', async ({ page }) => {
    await page.goto(baseUrl + 'register');
    await page.click(submitButtonSelector);

    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });

    await page.$(loginButtonSelector);

    expect(page.url()).toBe(baseUrl + 'register');
});

test('Register with empty email input field', async ({ page }) => {
    await page.goto(baseUrl + 'register');
    await page.fill(passwordInputSelector, password);
    await page.fill(repeatPasswordInputSelector, password);
    await page.click(submitButtonSelector);

    await page.$(allBoosLinkSelector);

    //check link
    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });

    await page.$(loginButtonSelector);

    expect(page.url()).toBe(baseUrl + 'register');
});

test('Register with empty password input field', async ({ page }) => {
    await page.goto(baseUrl + 'register');
    await page.fill(emailInputSelector, 'email@abv.bg');
    await page.fill(repeatPasswordInputSelector, password);
    await page.click(submitButtonSelector);

    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });

    await page.$(loginButtonSelector);

    expect(page.url()).toBe(baseUrl + 'register');
});

test('Register with empty confirm password input field', async ({ page }) => {
    await page.goto(baseUrl + 'register');
    await page.fill(emailInputSelector, 'emptyConfirm@abv.bg');
    await page.fill(repeatPasswordInputSelector, password);
    await page.click(submitButtonSelector);

    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });

    await page.$(loginButtonSelector);

    expect(page.url()).toBe(baseUrl + 'register');
});

test('Register with different password and confirm password input field', async ({ page }) => {
    await page.goto(baseUrl + 'register');
    await page.fill(emailInputSelector, 'diffPass@abv.bg');
    await page.fill(passwordInputSelector, password);
    await page.fill(repeatPasswordInputSelector, '456789');
    await page.click(submitButtonSelector);

    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('Passwords don\'t match!');
        await dialog.accept();
    });

    await page.$(loginButtonSelector);

    expect(page.url()).toBe(baseUrl + 'register');
});

// Add Book page tests

test('Add book with valid data', async ({ page }) => {
    await page.goto(baseUrl + 'login');

    await page.fill(emailInputSelector, user);
    await page.fill(passwordInputSelector, password);

    await Promise.all([
        page.click(submitButtonSelector),
        page.waitForURL(baseUrl + 'catalog')
    ]);

    await page.click(addBookLinkSelector);
    await page.waitForSelector(createFormSelector);
    await page.fill(titleSelector, 'Test Book');
    await page.fill(descriptionSelector, 'Test book description');
    await page.fill(imageSelector, 'https://shorturl.at/cjmy0');
    await page.selectOption(typeSelector, 'Other');

    await page.click(createBookSubmitButtonSelector);

    await page.waitForURL(baseUrl + 'catalog');

    expect(page.url()).toBe(baseUrl + 'catalog');
});

test('Add book with empty title feld', async ({ page }) => {
    await page.goto(baseUrl + 'login');

    await page.fill(emailInputSelector, user);
    await page.fill(passwordInputSelector, password);

    await Promise.all([
        page.click(submitButtonSelector),
        page.waitForURL(baseUrl + 'catalog')
    ]);

    await page.click(addBookLinkSelector);
    await page.waitForSelector(createFormSelector);
    await page.fill(descriptionSelector, 'Test book description');
    await page.fill(imageSelector, 'https://shorturl.at/cjmy0');
    await page.selectOption(typeSelector, 'Fiction');

    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });

    await page.$(addBookLinkSelector);

    expect(page.url()).toBe(baseUrl + 'create');
});

test('Add book with empty description feld', async ({ page }) => {
    await page.goto(baseUrl + 'login');

    await page.fill(emailInputSelector, user);
    await page.fill(passwordInputSelector, password);

    await Promise.all([
        page.click(submitButtonSelector),
        page.waitForURL(baseUrl + 'catalog')
    ]);

    await page.click(addBookLinkSelector);
    await page.waitForSelector(createFormSelector);
    await page.fill(titleSelector, 'Test Book');
    await page.fill(imageSelector, 'https://shorturl.at/cjmy0');
    await page.selectOption(typeSelector, 'Mistery');

    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });

    await page.$(addBookLinkSelector);

    expect(page.url()).toBe(baseUrl + 'create');
});

test('Add book with empty image feld', async ({ page }) => {
    await page.goto(baseUrl + 'login');

    await page.fill(emailInputSelector, user);
    await page.fill(passwordInputSelector, password);

    await Promise.all([
        page.click(submitButtonSelector),
        page.waitForURL(baseUrl + 'catalog')
    ]);

    await page.click(addBookLinkSelector);
    await page.waitForSelector(createFormSelector);
    await page.fill(titleSelector, 'Test Book');
    await page.fill(descriptionSelector, 'Test book description');
    await page.selectOption(typeSelector, 'Mistery');

    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });

    await page.$(addBookLinkSelector);

    expect(page.url()).toBe(baseUrl + 'create');
});

// All Books page tests

test('Login and verify that all books are displayed', async ({ page }) => {
    await page.goto(baseUrl + 'login');

    await page.fill(emailInputSelector, user);
    await page.fill(passwordInputSelector, password);

    await Promise.all([
        page.click(submitButtonSelector),
        page.waitForURL(baseUrl + 'catalog')
    ]);

    await page.waitForSelector(dashboardSelector);

    const bookElements = await page.$$(bookElementsSelector);

    expect(bookElements.length).toBeGreaterThan(0);
});

// Must be deleted all books from the database first to pass this test. It will be skipped until then.
test.skip('Login and verify that no books are displayed', async ({ page }) => {
    await page.goto(baseUrl + 'login');

    await page.fill(emailInputSelector, user);
    await page.fill(passwordInputSelector, password);

    await Promise.all([
        page.click(submitButtonSelector),
        page.waitForURL(baseUrl + 'catalog')
    ]);

    await page.waitForSelector(dashboardSelector);

    const noBooksMessage = await page.textContent(noBooksSelector);

    expect(noBooksMessage).toBe('No books in database!');
});

// Details page tests

test('Login and navigate to Details page', async ({ page }) => {
    await page.goto(baseUrl + 'login');

    await page.fill(emailInputSelector, user);
    await page.fill(passwordInputSelector, password);

    await Promise.all([
        page.click(submitButtonSelector),
        page.waitForURL(baseUrl + 'catalog')
    ]);

    await page.click(allBoosLinkSelector);
    await page.waitForSelector(otherBooksSelector);
    await page.click(otherBooksButtonSelector);
    await page.waitForSelector(bookInformationSelector);

    const detailsPageTitle = await page.textContent(detailsPageTitleSelector);

    expect(detailsPageTitle).toBe('Test Book');
});

test('Login and verify that guest user sees the details button and button works correctly', async ({ page }) => {
    await page.goto(baseUrl + 'login');

    await page.fill(emailInputSelector, 'john@abv.bg');
    await page.fill(passwordInputSelector, password);

    await Promise.all([
        page.click(submitButtonSelector),
        page.waitForURL(baseUrl + 'catalog')
    ]);

    await page.click(allBoosLinkSelector);
    await page.waitForSelector(otherBooksSelector);
    await page.click(otherBooksButtonSelector);
    await page.waitForSelector(bookInformationSelector);

    const detailsPageTitle = await page.textContent(detailsPageTitleSelector);

    expect(detailsPageTitle).toBe('Test Book');
});

test('Login and verify that all info is displayed correctly', async ({ page }) => {
    await page.goto(baseUrl + 'login');

    await page.fill(emailInputSelector, 'john@abv.bg');
    await page.fill(passwordInputSelector, password);

    await Promise.all([
        page.click(submitButtonSelector),
        page.waitForURL(baseUrl + 'catalog')
    ]);

    await page.click(allBoosLinkSelector);
    await page.waitForSelector(otherBooksSelector);
    await page.click(otherBooksButtonSelector);
    await page.waitForSelector(bookInformationSelector);

    const detailsPageTitle = await page.textContent(detailsPageTitleSelector);
    const detailsPageType = await page.textContent(detailsPageTypeSelector);
    const imageHandle = await page.$(detailsPageImageSelector);
    const imageSrc = await imageHandle.getAttribute('src');
    const bookDescriptionTitle = await page.textContent(bookDescriptionTitleSelector);
    const bookDescriptionContent = await page.textContent(bookDescriptionContentSelector);

    expect(detailsPageTitle).toBe('Test Book');
    expect(detailsPageType).toBe('Type: Other');
    expect(imageSrc).toContain('https://shorturl.at/cjmy0');
    expect(bookDescriptionTitle).toBe('Description:');
    expect(bookDescriptionContent).toBe('Test book description');
});

test('Login and verify that Edit and Delete buttons are visible for creator', async ({ page }) => {
    await page.goto(baseUrl + 'login');

    await page.fill(emailInputSelector, user);
    await page.fill(passwordInputSelector, password);

    await Promise.all([
        page.click(submitButtonSelector),
        page.waitForURL(baseUrl + 'catalog')
    ]);

    await page.click(allBoosLinkSelector);
    await page.waitForSelector(otherBooksSelector);
    await page.click(otherBooksButtonSelector);
    await page.waitForSelector(bookInformationSelector);

    const editButton = await page.$(editButtonSelector);
    const editTextContent = await editButton.textContent();

    const deleteButton = await page.$(deleteButtonSelector);
    const isDeleteButtonVisile = await deleteButton.isVisible();

    expect(editTextContent).toBe('Edit');
    expect(isDeleteButtonVisile).toBe(true);
});

test('Login and verify that Edit and Delete buttons are not visible for non-creators', async ({ page }) => {
    await page.goto(baseUrl + 'login');

    await page.fill(emailInputSelector, 'john@abv.bg');
    await page.fill(passwordInputSelector, password);

    await Promise.all([
        page.click(submitButtonSelector),
        page.waitForURL(baseUrl + 'catalog')
    ]);

    await page.click(allBoosLinkSelector);
    await page.waitForSelector(otherBooksSelector);
    await page.click(otherBooksButtonSelector);
    await page.waitForSelector(bookInformationSelector);

    const editButton = await page.$(editButtonSelector);
    const editButtonTextContent = await editButton.textContent();


    const deleteButton = await page.$(deleteButtonSelector);
    const deleteButtonTextContent = await deleteButton.textContent();

    expect(editButtonTextContent).not.toBe('Edit');
    expect(deleteButtonTextContent).not.toBe('Delete');
});

test('Login and verify that Like button is not visible for creator', async ({ page }) => {
    await page.goto(baseUrl + 'login');

    await page.fill(emailInputSelector, user);
    await page.fill(passwordInputSelector, password);

    await Promise.all([
        page.click(submitButtonSelector),
        page.waitForURL(baseUrl + 'catalog')
    ]);

    await page.click(allBoosLinkSelector);
    await page.waitForSelector(otherBooksSelector);
    await page.click(otherBooksButtonSelector);
    await page.waitForSelector(bookInformationSelector);

    const likeButton = await page.$(likeButtonSelector);
    const likeButtonTextContent = await likeButton.textContent();

    expect(likeButtonTextContent).not.toBe('Like');

});

test('Login and verify that Like button is visible for non-creator', async ({ page }) => {
    await page.goto(baseUrl + 'login');

    await page.fill(emailInputSelector, 'john@abv.bg');
    await page.fill(passwordInputSelector, password);

    await Promise.all([
        page.click(submitButtonSelector),
        page.waitForURL(baseUrl + 'catalog')
    ]);

    await page.click(allBoosLinkSelector);
    await page.waitForSelector(otherBooksSelector);
    await page.click(otherBooksButtonSelector);
    await page.waitForSelector(bookInformationSelector);

    const likeButton = await page.$(likeButtonSelector);
    const likeButtonTextContent = await likeButton.textContent();

    expect(likeButtonTextContent).toBe('Like');

});

// Logout functionality tests

test('Verify that Logout button is visible', async ({ page }) => {
    await page.goto(baseUrl + 'login');

    await page.fill(emailInputSelector, 'john@abv.bg');
    await page.fill(passwordInputSelector, password);

    await Promise.all([
        page.click(submitButtonSelector),
        page.waitForURL(baseUrl + 'catalog')
    ]);

    const logoutButton = await page.$(logoutButtonSelector);
    const isLogoutButtonVisible = await logoutButton.isVisible();

    expect(isLogoutButtonVisible).toBe(true);

});

test('Verify redirection of Logout link after user login', async ({ page }) => {
    await page.goto(baseUrl + 'login');

    await page.fill(emailInputSelector, user);
    await page.fill(passwordInputSelector, password);

    await Promise.all([
        page.click(submitButtonSelector),
        page.waitForURL(baseUrl + 'catalog')
    ]);

    const logoutButton = await page.$(logoutButtonSelector);
    await logoutButton.click();

    const redirectURL = page.url();
    expect(redirectURL).toBe(baseUrl + 'catalog');

});