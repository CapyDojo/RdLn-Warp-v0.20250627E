// Simple script to open the test page in the default browser
import { exec } from 'child_process';
import os from 'os';

const url = 'http://localhost:3000/test-fix';

// Determine the command based on the operating system
let command;
switch (os.platform()) {
  case 'win32':
    command = `start ${url}`;
    break;
  case 'darwin':
    command = `open ${url}`;
    break;
  default:
    command = `xdg-open ${url}`;
    break;
}

console.log(`Opening ${url} in your default browser...`);
exec(command, (error) => {
  if (error) {
    console.error(`Failed to open browser: ${error}`);
    return;
  }
  console.log('Browser opened successfully!');
  console.log('Please check the browser console (F12) to see the test results.');
});