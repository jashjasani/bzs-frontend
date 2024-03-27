import fs from 'fs';
import path from 'path';
import uglifyJS from 'uglify-js'

const sourceFolder = './src/js/'; // Replace with the path to your source folder
const destinationFolder = './dist/1.0/'; // Replace with the path to your destination folder

// Function to minify a single JavaScript file
function minifyFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const result = uglifyJS.minify(code);

  if (result.error) {
    console.error(`Error minifying ${filePath}: ${result.error}`);
    return;
  }

  const minifiedCode = result.code;
  const fileName = path.basename(filePath);
  const destinationPath = path.join(destinationFolder, fileName);

  fs.writeFileSync(destinationPath, minifiedCode, 'utf8');
  console.log(`Minified ${filePath} -> ${destinationPath}`);
}

// Function to process all JavaScript files in a folder
function processFolder(folderPath) {
  fs.readdirSync(folderPath).forEach((file) => {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      processFolder(filePath); // Recursively process subfolders
    } else if (path.extname(filePath) === '.js') {
      minifyFile(filePath); // Minify JavaScript files
    }
  });
}

// Create the destination folder if it doesn't exist
if (!fs.existsSync(destinationFolder)) {
  fs.mkdirSync(destinationFolder);
}

// Start processing the source folder
processFolder(sourceFolder);