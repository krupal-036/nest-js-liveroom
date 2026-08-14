const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '..', 'frontend', 'dist');
const destination = path.join(__dirname, '..', 'backend', 'public');

if (!fs.existsSync(source)) {
    console.error('Frontend dist folder not found:', source);
    process.exit(1);
}

fs.rmSync(destination, { recursive: true, force: true });

fs.cpSync(source, destination, {
    recursive: true,
});

console.log('Frontend dist copied successfully:');
console.log(`${source} -> ${destination}`);