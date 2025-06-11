
/**
 * Utility functions to improve accessibility in the application
 */

// Focus first invalid field on form submission error
export function focusFirstError() {
  setTimeout(() => {
    const errorField = document.querySelector( "[aria-invalid=\"true\"]" ) as HTMLElement;
    if ( errorField ) {
      errorField.focus();
      errorField.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, 100 );
}

// Add ARIA attributes dynamically to form elements
export function enhanceFormAccessibility() {
  // Add required ARIA attributes to required fields
  document.querySelectorAll( "form [required], form [aria-required=\"true\"]" ).forEach(( element ) => {
    if ( element instanceof HTMLElement ) {
      element.setAttribute( "aria-required", "true" );
    }
  });

  // Ensure all form inputs have associated labels
  document.querySelectorAll( "form input, form select, form textarea" ).forEach(( element ) => {
    if ( element instanceof HTMLElement ) {
      const id = element.getAttribute( "id" );
      if ( id ) {
        const hasLabel = Boolean( document.querySelector( `label[for="${id}"]` ));
        if ( !hasLabel ) {
          console.warn( `Input with id "${id}" has no associated label. This is an accessibility issue.` );
        }
      } else {
        console.warn( "Form control has no ID attribute. This may cause accessibility issues." );
      }
    }
  });
}

// Helper for screen reader announcements
export function announceForScreenReader( message: string ) {
  let ariaLive = document.getElementById( "aria-live-announcer" );

  if ( !ariaLive ) {
    ariaLive = document.createElement( "div" );
    ariaLive.id = "aria-live-announcer";
    ariaLive.setAttribute( "aria-live", "polite" );
    ariaLive.setAttribute( "aria-atomic", "true" );
    ariaLive.classList.add( "sr-only" ); // Screen reader only
    document.body.appendChild( ariaLive );
  }

  ariaLive.textContent = message;

  // Clear after announcement has been read
  setTimeout(() => {
    ariaLive.textContent = "";
  }, 3000 );
}

// Check page for common accessibility issues
export function runAccessibilityChecks() {
  // Check for images without alt text
  const imagesWithoutAlt = document.querySelectorAll( "img:not([alt])" );
  if ( imagesWithoutAlt.length > 0 ) {
    console.warn( `${imagesWithoutAlt.length} images found without alt text. This is an accessibility issue.` );
  }

  // Check for proper heading hierarchy
  const headings = Array.from( document.querySelectorAll( "h1, h2, h3, h4, h5, h6" ));
  let lastLevel = 0;
  headings.forEach( heading => {
    const level = parseInt( heading.tagName.substring( 1 ), 10 );
    if ( level - lastLevel > 1 && lastLevel !== 0 ) {
      console.warn( `Heading level skipped from h${lastLevel} to h${level}. This may cause accessibility issues.` );
    }
    lastLevel = level;
  });

  // Check color contrast (simplified)
  // A full implementation would require computing actual contrast ratios
  const potentialContrastIssues = document.querySelectorAll(
    ".text-gray-400, .text-gray-300, .text-gray-200, .text-white[class*=\"bg-white\"], .text-black[class*=\"bg-black\"]"
  );
  if ( potentialContrastIssues.length > 0 ) {
    console.warn( `${potentialContrastIssues.length} elements found with potential color contrast issues.` );
  }
}
