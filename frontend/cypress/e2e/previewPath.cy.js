window.describe('Preview Path', () => {
  const imgURL = 'https://preview.redd.it/i-got-bored-so-i-decided-to-draw-a-random-image-on-the-v0-4ig97vv85vjb1.png?width=1280&format=png&auto=webp&s=7177756d1f393b6e093596d06e1ba539f723264b';
  const videoURL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley';
  window.before(() => {
    window.cy.visit('localhost:3000/');
  });

  window.it('user previewing a slide', () => {
    // Navigate to register page
    window.cy.get('a[aria-label="Register for Presto"]')
      .click();
    window.cy.url().should('include', 'localhost:3000/register');

    // Registers Successfully
    window.cy.get('input[id="email"]')
      .focus()
      .type('random1@random.com');
    window.cy.get('input[id="name"]')
      .focus()
      .type('random1');
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
    window.cy.contains('My First Presentation')
      .click();

    // Add TextBox to slide
    window.cy.get('button[aria-controls="content-options"]')
      .click()
    window.cy.get('button[aria-label="add text"]')
      .click()
    window.cy.get('input[id="textContent"]')
      .focus()
      .type('Random text');
    window.cy.get('button[aria-label="submit text box"]')
      .click();
    window.cy.wait(1000);
    window.cy.get('[data-testid="slide-container"]').should('be.visible');
    window.cy.get('[data-testid="slide-container"]')
      .find('[aria-label="Text Block"]')
      .should('exist');

    // Add a slide, first click off screen to toggle off the overlay.
    window.cy.get('body').click(0, 0);
    window.cy.get('button[aria-label="add slide"')
      .click();
    window.cy.wait(1000);
    window.cy.get('div[aria-label="Slide number 2"]')
      .should('be.visible')
      .and('contain', 2);

    // Add image to slide
    window.cy.get('button[aria-controls="content-options"]')
      .click()
    window.cy.get('button[aria-label="add image"]')
      .click()
    window.cy.get('input[id="imageURL"]')
      .focus()
      .type(imgURL);
    window.cy.get('button[aria-label="submit image"]')
      .click();
    window.cy.wait(1000);
    window.cy.get('[data-testid="slide-container"]').should('be.visible');
    window.cy.get('[data-testid="slide-container"]')
      .find('[aria-label="Image Block"]')
      .should('exist');

    // Add a slide
    window.cy.get('body').click(0, 0);
    window.cy.get('button[aria-label="add slide"')
      .click();
    window.cy.wait(1000);
    window.cy.get('div[aria-label="Slide number 3"]')
      .should('be.visible')
      .and('contain', 3);
    
    // Add video to slide
    window.cy.get('button[aria-controls="content-options"]')
      .click()
    window.cy.get('button[aria-label="add video"]')
      .click()
    window.cy.get('input[id="videoURL"]')
      .focus()
      .type(videoURL);
    window.cy.get('button[aria-label="submit video"]')
      .click();
    window.cy.wait(1000);
    window.cy.get('[data-testid="slide-container"]').should('be.visible');
    window.cy.get('[data-testid="slide-container"]')
      .find('[aria-label="Video Block"]')
      .should('exist');
    
    // Return to slide with text box
    window.cy.get('body').click(0, 0);
    window.cy.get('button[aria-label="previous slide"')
      .click();
    window.cy.get('button[aria-label="previous slide"')
      .click();

    // Open Edit Modal
    window.cy.get('[aria-label="Text Block"]')
      .dblclick();
    window.cy.get('input[id="textContentEdit"]')
      .focus()
      .type('(changed)');
    window.cy.get('button[aria-label="save text box"]')
      .click();

    // Check if text box has been edited
    window.cy.contains('Random text(changed)').should('exist');

    // Delete textbox with right click
    window.cy.get('[aria-label="Text Block"]')
      .rightclick();

    // Check if text box has been deleted
    window.cy.contains('Random text(changed)').should('not.exist');
    
    // Check rearrange slides Opens 
    window.cy.get('button[aria-controls="slide-settings"]')
      .click()
    window.cy.get('button[aria-label="Rearrange Slides"]')
      .click();
    window.cy.get('[id="rearrange-title"]').should('contain', 'Rearrange Slides');
    window.cy.get('[data-testid="slide-grid"]').should('be.visible');

    // Close the modal
    window.cy.get('[aria-label="Close rearrange slides modal"]').click();

    // Ensure preview opens a new tab
    window.cy.window().then((win) => {
      window.cy.stub(win, 'open').as('windowOpen');
    });

    window.cy.get('button[aria-label="Preview Presentation"]')
      .click();
    window.cy.get('@windowOpen').should('have.been.calledOnce');

    // Toggle off slide settings
    window.cy.get('body').click(0, 0);

    // Try Logout from EditPresentation page
    window.cy.get('option[aria-label="Logout of Presto"]')
      .click();
    window.cy.url().should('include', 'localhost:3000/');

    // Login successfully
    window.cy.get('a[aria-label="Login to Presto"]')
      .click();
    window.cy.url().should('include', 'localhost:3000/login');
    window.cy.get('input[id="email"]')
      .focus()
      .type('random1@random.com');
    window.cy.get('input[id="password"]')
      .focus()
      .type('password123');
    window.cy.get('button[aria-label="Login button"]')
      .click();
    window.cy.url().should('include', 'localhost:3000/dashboard');
  });
});
