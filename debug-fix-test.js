// Simple test to apply border-radius directly
// Run this in the browser console to test if the fix works

console.log('🔧 DEBUG: Testing border-radius fix...');

// Function to apply the fix directly
function applyBorderRadiusFix() {
  console.log('Applying border-radius fix...');
  
  // Find all input panels in desktop view
  const inputPanels = document.querySelectorAll('[data-input-panel] .glass-panel.glass-content-panel');
  
  console.log(`Found ${inputPanels.length} input panels`);
  
  // Check if we're in desktop view
  const isDesktop = window.innerWidth >= 1024;
  console.log('Is desktop view:', isDesktop);
  
  if (!isDesktop) {
    console.log('❌ Not in desktop view - test requires desktop width >= 1024px');
    return;
  }
  
  // Apply the fix to each panel
  inputPanels.forEach((panel, index) => {
    console.log(`Processing panel ${index + 1}:`);
    console.log('  Before:', {
      topLeft: panel.style.borderTopLeftRadius,
      topRight: panel.style.borderTopRightRadius,
      bottomLeft: panel.style.borderBottomLeftRadius,
      bottomRight: panel.style.borderBottomRightRadius
    });
    
    // Apply the fix
    panel.style.setProperty('border-top-left-radius', '12px', 'important');
    panel.style.setProperty('border-top-right-radius', '12px', 'important');
    panel.style.setProperty('border-bottom-left-radius', '0px', 'important');
    panel.style.setProperty('border-bottom-right-radius', '0px', 'important');
    
    console.log('  After:', {
      topLeft: panel.style.borderTopLeftRadius,
      topRight: panel.style.borderTopRightRadius,
      bottomLeft: panel.style.borderBottomLeftRadius,
      bottomRight: panel.style.borderBottomRightRadius
    });
  });
  
  console.log('✅ Border-radius fix applied!');
  console.log('👀 Check if the input panels now have rounded top corners and square bottom corners');
}

// Run the test
applyBorderRadiusFix();

// Also provide a way to revert
window.revertBorderRadiusFix = function() {
  console.log('Reverting border-radius fix...');
  const inputPanels = document.querySelectorAll('[data-input-panel] .glass-panel.glass-content-panel');
  inputPanels.forEach(panel => {
    panel.style.removeProperty('border-top-left-radius');
    panel.style.removeProperty('border-top-right-radius');
    panel.style.removeProperty('border-bottom-left-radius');
    panel.style.removeProperty('border-bottom-right-radius');
  });
  console.log('✅ Border-radius fix reverted!');
};
