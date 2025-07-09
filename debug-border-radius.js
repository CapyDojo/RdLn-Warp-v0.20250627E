// Debug script to inspect border-radius on input panels
// Copy and paste this into your browser console while on the desktop view

console.log('🔍 DEBUG: Inspecting input panel border-radius...');

// Find all input panels
const inputPanels = document.querySelectorAll('[data-input-panel]');
console.log(`Found ${inputPanels.length} input panels`);

inputPanels.forEach((panel, index) => {
  console.log(`\n--- Input Panel ${index + 1} ---`);
  console.log('Panel element:', panel);
  
  // Find the glass panel inside
  const glassPanel = panel.querySelector('.glass-panel');
  if (glassPanel) {
    console.log('Glass panel element:', glassPanel);
    
    // Get computed styles
    const styles = window.getComputedStyle(glassPanel);
    console.log('Border radius values:');
    console.log('  border-top-left-radius:', styles.borderTopLeftRadius);
    console.log('  border-top-right-radius:', styles.borderTopRightRadius);
    console.log('  border-bottom-left-radius:', styles.borderBottomLeftRadius);
    console.log('  border-bottom-right-radius:', styles.borderBottomRightRadius);
    
    // Check applied classes
    console.log('Applied classes:', glassPanel.className);
    
    // Check if it's mobile or desktop
    const isDesktop = window.innerWidth >= 1024;
    console.log('Is desktop view:', isDesktop);
    
    // Check parent containers
    const mobileTopPanel = panel.closest('.mobile-top-panel');
    const mobileBottomPanel = panel.closest('.mobile-bottom-panel');
    console.log('Has mobile-top-panel class:', !!mobileTopPanel);
    console.log('Has mobile-bottom-panel class:', !!mobileBottomPanel);
  }
});

// Check layout classes
const body = document.body;
const html = document.documentElement;
console.log('\n--- Layout Classes ---');
console.log('Body classes:', body.className);
console.log('HTML classes:', html.className);
console.log('Current theme:', document.documentElement.getAttribute('data-theme'));

// Check for layout-current class
const layoutCurrent = document.querySelector('.layout-current');
console.log('Has layout-current class:', !!layoutCurrent);
if (layoutCurrent) {
  console.log('Layout current element:', layoutCurrent);
}

// Check window size
console.log('\n--- Window Size ---');
console.log('Window width:', window.innerWidth);
console.log('Window height:', window.innerHeight);
console.log('Should be desktop (>= 1024px):', window.innerWidth >= 1024);
