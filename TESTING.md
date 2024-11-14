1. Setup and Navigation: I started the test as usual by navigating to the homepage and clicking the "Register" button, then verifying the URL to confirm successful navigation.

2. Registration: I then registered a new user for use similar to the first happy path. 

3. Presentation Creation: I then test that the user can create a new presentation. It verifies that the new presentation appears on the dashboard to confirm it was created successfully.

4. Slide Customisation:
    - Text Box: I first added a text box to the first slide, verifying the appearance of the text box on the screen. This also tests form input and submission behavior.
    - Adding Slides: This creates additional slides, ensuring that the user can navigate between slides.
    - Image: I then added an image on the second slide and checked it was displaying properly. This shows multiple components across different slides.
    - Video: I then made another slide and added a video to ensure videos could be displayed on another slide.

5. Editing and Deleting Elements: I then navigated back to the first slide to check if the textbox persists. I tested using double click to bring up the edit modal.

I then changed the textbox text and found it on the screen to verify that text can be edited.

I then checked if the textbox could be deleted using right click. After right clicking the block I check to see if the element is on screen. It cannot be found to verify it has been deletd.

6. Rearrange Slides: I clicked on the rearrage slides button to verify that the rearrange modal opens and that slide rearrangement UI elements load correctly. I attempted to get cypress to drag and drop but could not get it to work.

7. Preview Mode: I clicked on the preview button to ensures that clicking the "Preview Presentation" button opens a new tab, confirming that the preview functionality launches as expected.

8. Logout and Login: basic user actions to complete the path.