#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function main() {
    const action = process.argv[2];
    const file = process.argv[3];
    const htmlPath = path.join(__dirname, file || 'index.html');
    
    if (!action || (action !== 'add' && action !== 'remove')) {
        console.log('Usage: node modify-html.js <add|remove>');
        process.exit(1);
    }
    
    let html = fs.readFileSync(htmlPath, 'utf8');
    const bodyEndIndex = html.lastIndexOf('</body>');
    
    if (action === 'add') {
        const timestamp = Date.now();
        const newLine = `\t<p data-delta-change="true">Added at ${timestamp}</p>\n`;
        const modified = html.slice(0, bodyEndIndex) + newLine + html.slice(bodyEndIndex);
        fs.writeFileSync(htmlPath, modified);
        console.log(`Added line: ${newLine.trim()}`);
    } else {
        // Find last element with data-delta-change and modify it
        const lines = html.split('\n');
        for (let i = lines.length - 1; i >= 0; i--) {
            if (lines[i].includes('data-delta-change="true"')) {
                lines[i] = lines[i].replace(/Added at \d+/, `Modified at ${Date.now()}`);
                break;
            }
        }
        const modified = lines.join('\n');
        fs.writeFileSync(htmlPath, modified);
        console.log('Modified last added line');
    }
}

main();
