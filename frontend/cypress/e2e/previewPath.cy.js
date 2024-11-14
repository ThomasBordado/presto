describe('Happy Path', () => {
  before(() => {
    cy.visit('localhost:3000/');
  });

  it('user previewing a slide', () => {
    // Navigate to register page
    cy.get('a[aria-label="Register for Presto"]')
      .click();
    cy.url().should('include', 'localhost:3000/register');

    // Registers Successfully
    cy.get('input[id="email"]')
      .focus()
      .type('random1@random.com');
    cy.get('input[id="name"]')
      .focus()
      .type('random1');
    cy.get('input[id="password"]')
      .focus()
      .type('password123');
    cy.get('input[id="confirmPassword"]')
      .focus()
      .type('password123');
    cy.get('button[aria-label="Register button"]')
      .click();
    cy.url().should('include', 'localhost:3000/dashboard');

    // Creates a new presentation successfully
    cy.get('button[aria-label="Create new presentation button"]')
      .click();
    cy.get('input[id="presentation-title"]')
      .focus()
      .type('My Presentation');
    cy.get('input[id="presentation-description"]')
      .focus()
      .type('My First Presentation');
    cy.get('button[aria-label="Create presentation button"]')
      .click();
    cy.contains('My Presentation').should('exist');
    cy.contains('My First Presentation')
      .click();

    // Add TextBox to slide
    

    // Add slides
    cy.get('button[aria-label="add slide"')
      .click();
    cy.wait(1000);
    cy.get('button[aria-label="add slide"')
      .click();
    cy.wait(1000);
    cy.get('div[aria-label="slide number"]')
      .should('be.visible')
      .and('contain', 3);

    // Switch between slides
    cy.get('button[aria-label="previous slide"]')
      .click();
    cy.get('div[aria-label="slide number"]')
      .should('be.visible')
      .and('contain', 2);
    cy.get('button[aria-label="previous slide"]')
      .click();
    cy.get('div[aria-label="slide number"]')
      .should('be.visible')
      .and('contain', 1);

    // Delete the presentation
    cy.get('button[aria-label="delete presentation"]')
      .click();
    cy.get('button[aria-label="approve delete"]')
      .click();
    cy.url().should('include', 'localhost:3000/dashboard');


    // Logout successfully
    cy.get('button[aria-label="Logout of Presto"]')
      .click();
    cy.url().should('include', 'localhost:3000/');

    // Login successfully
    cy.get('a[aria-label="Login to Presto"]')
      .click();
    cy.url().should('include', 'localhost:3000/login');
    cy.get('input[id="email"]')
      .focus()
      .type('random@random.com');
    cy.get('input[id="password"]')
      .focus()
      .type('password123');
    cy.get('button[aria-label="Login button"]')
      .click();
    cy.url().should('include', 'localhost:3000/dashboard');
  });
});
