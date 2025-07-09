// CSS Rule Inspector - Find what's overriding border-radius
// Run this in browser console after the first debug script

console.log('🔍 CSS RULE INSPECTOR: Finding border-radius overrides...');

// Function to get all CSS rules affecting an element
function getAllCSSRules(element, property) {
  const rules = [];
  const sheets = Array.from(document.styleSheets);
  
  sheets.forEach(sheet => {
    try {
      const cssRules = Array.from(sheet.cssRules || sheet.rules || []);
      cssRules.forEach(rule => {
        if (rule.style && rule.style[property]) {
          // Check if this rule applies to our element
          try {
            if (element.matches(rule.selectorText)) {
              rules.push({
                selector: rule.selectorText,
                value: rule.style[property],
                priority: rule.style.getPropertyPriority(property),
                specificity: getSpecificity(rule.selectorText)
              });
            }
          } catch (e) {
            // Ignore invalid selectors
          }
        }
      });
    } catch (e) {
      // Ignore CORS errors for external stylesheets
    }
  });
  
  return rules;
}

// Simple specificity calculation
function getSpecificity(selector) {
  const ids = (selector.match(/#/g) || []).length;
  const classes = (selector.match(/\./g) || []).length;
  const elements = (selector.match(/[a-z]/g) || []).length;
  return ids * 100 + classes * 10 + elements;
}

// Find input panels and analyze their border-radius rules
const inputPanels = document.querySelectorAll('[data-input-panel] .glass-panel');
console.log(`Analyzing ${inputPanels.length} glass panels...`);

inputPanels.forEach((panel, index) => {
  console.log(`\n=== PANEL ${index + 1} ===`);
  
  // Check each border-radius property
  const properties = [
    'border-top-left-radius',
    'border-top-right-radius', 
    'border-bottom-left-radius',
    'border-bottom-right-radius'
  ];
  
  properties.forEach(prop => {
    console.log(`\n--- ${prop} ---`);
    const rules = getAllCSSRules(panel, prop);
    
    if (rules.length > 0) {
      // Sort by specificity (highest first)
      rules.sort((a, b) => b.specificity - a.specificity);
      
      rules.forEach(rule => {
        console.log(`  ${rule.selector} { ${prop}: ${rule.value} ${rule.priority ? '!important' : ''} } (specificity: ${rule.specificity})`);
      });
      
      // Show computed value
      const computed = window.getComputedStyle(panel)[prop];
      console.log(`  COMPUTED: ${computed}`);
    } else {
      console.log('  No rules found');
    }
  });
});

// Check if our current-layout rules are being applied
console.log('\n=== LAYOUT CURRENT RULES CHECK ===');
const layoutCurrentRules = [
  '.layout-current [data-input-panel] .glass-panel.glass-content-panel',
  '[data-theme] .layout-current [data-input-panel] .glass-panel'
];

layoutCurrentRules.forEach(selector => {
  console.log(`\nChecking selector: ${selector}`);
  try {
    const elements = document.querySelectorAll(selector);
    console.log(`  Found ${elements.length} matching elements`);
    elements.forEach((el, i) => {
      console.log(`  Element ${i + 1}:`, el);
    });
  } catch (e) {
    console.log(`  Error: ${e.message}`);
  }
});

// Test our media query
console.log('\n=== MEDIA QUERY TEST ===');
const mediaQuery = window.matchMedia('(min-width: 1024px)');
console.log('Desktop media query matches:', mediaQuery.matches);
console.log('Window width:', window.innerWidth);
