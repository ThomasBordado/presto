window.describe('Happy Path', () => {
  window.before(() => {
    window.cy.visit('localhost:3000/');
  });

  window.it('completes the full happy path for a user', () => {
    // Navigate to register page
    window.cy.get('a[aria-label="Register for Presto"]')
      .click();
    window.cy.url().should('include', 'localhost:3000/register');

    // Registers Successfully
    window.cy.get('input[id="email"]')
      .focus()
      .type('random@random.com');
    window.cy.get('input[id="name"]')
      .focus()
      .type('random');
    window.cy.get('input[id="password"]')
      .focus()
      .type('password123');
    window.cy.get('input[id="confirmPassword"]')
      .focus()
      .type('password123');
    window.cy.get('button[aria-label="Register button"]')
      .click();
    window.cy.url().should('include', 'localhost:3000/dashboard');

    // Creates a new presentation successfully
    window.cy.get('button[aria-label="Create new presentation button"]')
      .click();
    window.cy.get('input[id="presentation-title"]')
      .focus()
      .type('My Presentation');
    window.cy.get('input[id="presentation-description"]')
      .focus()
      .type('My First Presentation');
    window.cy.get('button[aria-label="Create presentation button"]')
      .click();
    window.cy.contains('My Presentation').should('exist');

    // Update thumbnail and name
    window.cy.contains('My First Presentation')
      .click();
    window.cy.get('button[aria-label="Edit Presentation Title and Thumbnail"]')
      .click();
    window.cy.get('input[id="editPresoEditTitle"]')
      .focus()
      .type(' (changed)');
    window.cy.get('input[id="editPresoEditThumbnail"]')
      .selectFile('./src/assets/LandingPage.jpg');
    window.cy.wait(1000);
    window.cy.get('button[aria-label="Save Title and Thumbnail"]')
      .click();
    window.cy.contains('My Presentation (changed)').should('exist');

    // Add slides
    window.cy.get('button[aria-label="add slide"')
      .click();
    window.cy.wait(1000);
    window.cy.get('button[aria-label="add slide"')
      .click();
    window.cy.wait(1000);
    window.cy.get('div[aria-label="Slide number 3"]')
      .should('be.visible')
      .and('contain', 3);

    // Switch between slides
    window.cy.get('button[aria-label="previous slide"]')
      .click();
    window.cy.get('div[aria-label="Slide number 2"]')
      .should('be.visible')
      .and('contain', 2);
    window.cy.get('button[aria-label="previous slide"]')
      .click();
    window.cy.get('div[aria-label="Slide number 1"]')
      .should('be.visible')
      .and('contain', 1);

    // Delete the presentation
    window.cy.get('option[aria-label="Delete Presentation"]')
      .click();
    window.cy.get('button[aria-label="Confirm Deletion"]')
      .click();
    window.cy.url().should('include', 'localhost:3000/dashboard');


    // Logout successfully
    window.cy.get('option[aria-label="Logout of Presto"]')
      .click();
    window.cy.url().should('include', 'localhost:3000/');

    // Login successfully
    window.cy.get('a[aria-label="Login to Presto"]')
      .click();
    window.cy.url().should('include', 'localhost:3000/login');
    window.cy.get('input[id="email"]')
      .focus()
      .type('random@random.com');
    window.cy.get('input[id="password"]')
      .focus()
      .type('password123');
    window.cy.get('button[aria-label="Login button"]')
      .click();
    window.cy.url().should('include', 'localhost:3000/dashboard');
  });
});
