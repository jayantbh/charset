/**
 * SVG letter files processing utility script.
 * Usage: node process.js "Font Name" lower|upper
 * Example: node process.js "San Francisco" lower
 * 
 * Error codes:
 * 1x: System error.
 * 2x: Program error.
 */

const fs = require('fs');
const exec = require('child_process').execSync;

const printHelp = () => {
    console.info('Usage:   node process.js "Font Name" upper(default)|lower');
    console.info('Example: node process.js "San Francisco" lower');
}

const rmRf = path => {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

const makeCleanDirectory = path => {
    rmRf(path);
    fs.mkdirSync(path);
}

// Step 0
// ------
// Script specific checks
// Ensure that the required args are present, and correct

const args = process.argv.slice(2);
if (!args.length) {
    console.error('Too few arguments.');
    printHelp();
    process.exit(20);
}

const [fontName, casing = 'upper'] = args;
const allowedCases = ['lower', 'upper'];

if (!allowedCases.includes(casing)) {
    console.error('Invalid letter case parameter.');
    console.error(`Allowed cases are: ${allowedCases.join(', ')}.`);
    printHelp();
    process.exit(21);
}

const isUpper = casing === 'upper';

// Step 1
// ------
// Generate all SVGs from the CharSet.xd
// You should end up with 26 files in the project root
// with filenames from `Path 2.svg` to `Path 27.svg`
// Here we ensure that exactly 26 SVGs are present in this directory.

const numberOfLetters = 26;

try {
    const numberOfSvgs = fs.readdirSync('./')
        .filter(file => file.match(/.svg$/))
        .length;
    if (numberOfSvgs !== numberOfLetters) {
        console.error(`We're looking for ${numberOfLetters} SVG files. Each corresponding to a letter.`);
        console.error(`We found ${numberOfSvgs}. Please make sure there's exactly ${numberOfLetters} SVG files.`);
        console.error(`Note that I can't currently know if you entered the correct files or not.`);
        process.exit(22);
    } else {
        console.log('Step 1: SVG file count verified.');
    }
} catch (error) {
    process.exit(10);
}

// Step 2
// ------
// Run SVGO on all files.
// You need to have SVGO installed globally for this to work.
// The SVGO config is in svgo.json

try {
    exec('svgo --config ./svgo.json -f .').toString();
    console.log('Step 2: SVGO process completed.');
} catch (error) {
    console.error('Step 2 failed.');
    console.error(error);
    process.exit(11);
}

// Step 3
// ------
// Move and rename all files to match their corresponding alphabet
// inside the specified font folder

const fileNameOffset = 2;
const asciiOffset = isUpper ? 65 : 97;

makeCleanDirectory(`./${fontName}`);

try {
    for (let i = 0; i < numberOfLetters; i++) {
        const offsettedIndex = i + fileNameOffset;
        const letter = String.fromCharCode(i + asciiOffset);
        const oldName = `./Path ${offsettedIndex}.svg`;
        const newName = `./${fontName}/${letter}.svg`;
        fs.renameSync(oldName, newName);
        console.log(`Renamed ${newName}`);
    }

    console.log('Step 3: Files renamed and moved into their font directory.');
} catch (error) {
    console.error('Step 3 failed.');
    console.error(error);
    process.exit(12);
}

console.log('Process complete!')