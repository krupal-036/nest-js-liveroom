const fs = require('fs');
const path = require('path');

const TARGET_FOLDERS = new Set(['node_modules', 'dist', '.next']);

const rootDir = path.resolve(__dirname, '..');

console.log('Scanning and cleaning workspace...');

function cleanDirectory(currentPath) {
  try {
    const files = fs.readdirSync(currentPath, { withFileTypes: true });

    files.forEach((file) => {
      const fullPath = path.join(currentPath, file.name);

      if (file.isDirectory()) {
        if (TARGET_FOLDERS.has(file.name)) {
          try {
            fs.rmSync(fullPath, { recursive: true, force: true });
            console.log(`🗑️  Removed: ${path.relative(rootDir, fullPath)}`);
          } catch (err) {
            console.error(`❌ Failed to remove ${path.relative(rootDir, fullPath)}:`, err.message);
          }
        } else {
          cleanDirectory(fullPath);
        }
      }
    });
  } catch (err) {
    console.error(`Error reading directory ${currentPath}:`, err.message);
  }
}

cleanDirectory(rootDir);

console.log('✨ Cleanup finished successfully!');
