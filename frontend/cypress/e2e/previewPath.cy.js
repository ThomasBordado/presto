describe('Preview Path', () => {
  const imgURL = 'https://preview.redd.it/i-got-bored-so-i-decided-to-draw-a-random-image-on-the-v0-4ig97vv85vjb1.png?width=1280&format=png&auto=webp&s=7177756d1f393b6e093596d06e1ba539f723264b';
  const videoURL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley';
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
    cy.get('button[aria-label="tool pannel"]')
      .click()
    cy.get('button[aria-label="add text"]')
      .click()
    cy.get('input[id="textContent"]')
      .focus()
      .type('Random text');
    cy.get('button[aria-label="submit text box"]')
      .click();
    cy.wait(1000);
    cy.get('[data-testid="slide-container"]').should('be.visible');
    cy.get('[data-testid="slide-container"]')
      .find('[aria-label="Text Block"]')
      .should('exist');

    // Add a slide
    cy.get('button[aria-label="add slide"')
      .click();
    cy.wait(1000);
    cy.get('div[aria-label="Slide number 2"]')
      .should('be.visible')
      .and('contain', 2);

    // Add image to slide
    cy.get('button[aria-label="tool pannel"]')
      .click()
    cy.get('button[aria-label="add image"]')
      .click()
    cy.get('input[id="imageURL"]')
      .focus()
      .type(imgURL);
    cy.get('button[aria-label="submit image"]')
      .click();
    cy.wait(1000);
    cy.get('[data-testid="slide-container"]').should('be.visible');
    cy.get('[data-testid="slide-container"]')
      .find('[aria-label="Image Block"]')
      .should('exist');

    // Add a slide
    cy.get('button[aria-label="add slide"')
      .click();
    cy.wait(1000);
    cy.get('div[aria-label="Slide number 3"]')
      .should('be.visible')
      .and('contain', 3);
    
    // Add video to slide
    cy.get('button[aria-label="tool pannel"]')
      .click()
    cy.get('button[aria-label="add video"]')
      .click()
    cy.get('input[id="videoURL"]')
      .focus()
      .type(videoURL);
    cy.get('button[aria-label="submit video"]')
      .click();
    cy.wait(1000);
    cy.get('[data-testid="slide-container"]').should('be.visible');
    cy.get('[data-testid="slide-container"]')
      .find('[aria-label="Video Block"]')
      .should('exist');
    
    // Return to slide with text box
    cy.get('button[aria-label="previous slide"')
      .click();
    cy.get('button[aria-label="previous slide"')
      .click();

    // Open Edit Modal
    cy.get('[aria-label="Text Block"]')
      .dblclick();
    cy.get('input[id="textContentEdit"]')
      .focus()
      .type('(changed)');
    cy.get('button[aria-label="save text box"]')
      .click();

    // Check if text box has been edited
    cy.contains('Random text(changed)').should('exist');

    // Delete textbox with right click
    cy.get('[aria-label="Text Block"]')
      .rightclick();

    // Check if text box has been deleted
    cy.contains('Random text(changed)').should('not.exist');
    
    // Check rearrange slides Opens
    cy.get('button[aria-label="Rearrange Slides"]')
      .click();
    cy.get('[id="rearrange-title"]').should('contain', 'Rearrange Slides');
    cy.get('[data-testid="slide-grid"]').should('be.visible');

    // Close the modal
    cy.get('[aria-label="Close rearrange slides modal"]').click();

    // Ensure preview opens a new tab
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });

    cy.get('button[aria-label="Preview Presentation"]')
      .click();
    cy.get('@windowOpen').should('have.been.calledOnce');

    // Try Logout from EditPresentation page
    cy.get('button[aria-label="Logout of Presto"]')
      .click();
    cy.url().should('include', 'localhost:3000/');

    // Login successfully
    cy.get('a[aria-label="Login to Presto"]')
      .click();
    cy.url().should('include', 'localhost:3000/login');
    cy.get('input[id="email"]')
      .focus()
      .type('random1@random.com');
    cy.get('input[id="password"]')
      .focus()
      .type('password123');
    cy.get('button[aria-label="Login button"]')
      .click();
    cy.url().should('include', 'localhost:3000/dashboard');
  });
});
