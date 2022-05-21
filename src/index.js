#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const program = require('commander');

const {
  getConfig,
  buildPrettifier,
  logIntro,
  logItemCompletion,
  logConclusion,
  logError,
} = require('./helpers');
const {
  requireOptional,
  mkDirPromise,
  readFilePromiseRelative,
  writeFilePromise,
  appendFilePromise,
} = require('./utils');

// Load our package.json, so that we can pass the version onto `commander`.
const { version } = require('../package.json');

// Get the default config for this component (looks for local/global overrides,
// falls back to sensible defaults).
const config = getConfig();

// Convenience wrapper around Prettier, so that config doesn't have to be
// passed every time.
const prettify = buildPrettifier(config.prettierConfig);

program
  .version(version)
  .arguments('<componentName>')
  .option(
    '-t, --type <componentType>',
    'Type of React component to generate (default: "functional")',
    /^(class|pure-class|functional|functional-props)$/i,
    config.type
  )
  .option(
    '-d, --dir <pathToDirectory>',
    'Path to the "components" directory (default: "src/components")',
    config.dir
  )
  .option(
    '-l, --language <filesLanguage>',
    'Which files language to use for all component\'s files (default: "js")',
    config.language
  )
  .option(
    '-x, --extension <fileExtension>',
    'Which file extension to use for the component (skipped in TypeScript components - for TS it is always "tsx")',
    config.extension
  )
   .option(
    '-s, --siblingof <fileName>',
    'What is the sibling component name of the component to be created (sibling dir should exist)',
    config.siblingof
  )
  .parse(process.argv);

const [componentName] = program.args;

// Always set the component's extension to ".tsx" if desired language is TypeScript.
const componentFileExtension = 
  program.language === 'ts' ? 'tsx' : program.extension;

// Set proper template file extension, based on language.
const templateFileExtension = program.language === 'ts' ? 'tsx' : 'js';

// Find the path to the selected template file.
const templatePath = `./templates/${program.language}/${program.type}.${templateFileExtension}`;

// Get all of our file paths worked out, for the user's project.
const componentDir = `${program.dir}/${componentName}`;
const filePath = `${componentDir}/${componentName}.${componentFileExtension}`;
const indexPath = `${componentDir}/index.${program.language}`;

// Our index template is super straightforward, so we'll just inline it for now.
const indexTemplate = prettify(`\
export { default } from './${componentName}';
`);

logIntro({ name: componentName, dir: componentDir, type: program.type, language: program.language });

// Check if componentName is provided
if (!componentName) {
  logError(
    `Sorry, you need to specify a name for your component like this: new-component <name>`
  );
  process.exit(0);
}

// Check if component's language is either JS or TS 
if (program.language !== 'ts' && program.language !== 'js') {
  logError(
    `Sorry, you need to provide correct language shorthand ("js" or "ts")`
  );
  process.exit(0);
}

// Check to see if a directory at the given path exists
const fullPathToParentDir = path.resolve(program.dir);
if (!fs.existsSync(fullPathToParentDir)) {
  logError(
    `Sorry, you need to create a parent "components" directory.\n(new-component is looking for a directory at ${program.dir}).`
  );
  process.exit(0);
}

// Check to see if this component has already been created
const fullPathToComponentDir = path.resolve(componentDir);
const componentDirExist = fs.existsSync(fullPathToComponentDir)


// Check to see if siblingof flag has been passed
if (componentDirExist && !program.siblingof) {
  logError(
    `Looks like this component already exists!`
  );
 
  process.exit(0);
}else{
const siblingOfcomponentExist = fs.existsSync(path.resolve(`${program.dir}/${program.siblingof}/${componentName}.${componentFileExtension}`))
  if(siblingOfcomponentExist){
     logError(
    `Looks like this component already exists!`
  );
  
    process.exit(0);
  }else{
    logItemCompletion(
     `${componentName} will be sibling of ${program.siblingof}.`
   );
  }

 

}

if(!program.siblingof){
  
// Start by creating the directory that our component lives in.
mkDirPromise(componentDir)
  .then(() => readFilePromiseRelative(templatePath))
  .then((template) => {
    logItemCompletion('Directory created.');
    return template;
  })
  .then((template) =>
    // Replace our placeholders with real data (so far, just the component name)
    template.replace(/COMPONENT_NAME/g, componentName)
  )
  .then((template) =>
    // Format it using prettier, to ensure style consistency, and write to file.
    writeFilePromise(filePath, prettify(template))
  )
  .then((template) => {
    logItemCompletion('Component built and saved to disk.');
    return template;
  })
  .then((template) =>
    // We also need the `index.js` file, which allows easy importing.
    writeFilePromise(indexPath, prettify(indexTemplate))
  )
  .then((template) => {
    logItemCompletion('Index file built and saved to disk.');
    return template;
  })
  .then((template) => {
    logConclusion();
  })
  .catch((err) => {
    console.error(err);
  });
}else{
  // Will be a sibling of existing component name
  const siblingOfComponentDir = `${program.dir}/${program.siblingof}`;
  const siblingOfFilePath = `${siblingOfComponentDir}/${componentName}.${componentFileExtension}`;
  const siblingOfIndexPath = `${siblingOfComponentDir}/index.${program.language}`;

  const siblingOfComponentIndexTemplate = prettify(`\
export { default as ${componentName} } from './${componentName}';
`);

  // Bypass the directory creation 
  readFilePromiseRelative(templatePath)
   .then((template) => {
    return template;
  })
   .then((template) =>
    // Replace our placeholders with real data (so far, just the component name)
    template.replace(/COMPONENT_NAME/g, componentName)
  )
   .then((template) =>
    // Format it using prettier, to ensure style consistency, and write to file in siblingof dir.
    writeFilePromise(siblingOfFilePath, prettify(template))
  )
   .then((template) => {
    logItemCompletion('Sibling component built and saved to disk.');
    return template;
  })
   .then((template) =>
    // We also need the `index.js` file, which allows easy importing.
    appendFilePromise(siblingOfIndexPath, prettify(siblingOfComponentIndexTemplate))
  )
   .then((template) => {
    logItemCompletion('Index file edited and saved to disk.');
    return template;
  })
   .catch((err) => {
    console.error(err);
  });
  
}
