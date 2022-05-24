#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const program = require('commander');

const {
  getConfig,
  buildPrettifier,
  logIntro,
  logItemCompletion,
  logError,
} = require('./helpers');
const {
  mkDirPromise,
  readFilePromiseRelative,
  writeFilePromise,
  appendFilePromise,
} = require('./utils');

const { version } = require('../package.json');
const config = getConfig();
const prettify = buildPrettifier(config.prettierConfig);

program
  .version(version)
  .arguments('<componentName>')
  .option(
    '-t, --type <componentType>',
    'Type of React component to generate (default: "default")',
    /^(default|props)$/i,
    config.type
  )
  .option(
    '-d, --dir <pathToDirectory>',
    'Path to the "components" directory (default: "src/components")',
    config.dir
  )
   .option(
    '-s, --siblingof <fileName>',
    'What is the sibling component name of the component to be created (sibling dir should exist)',
    config.siblingof
  )
  .parse(process.argv);

const [componentName] = program.args;
const templatePath = `./templates/${program.type}.tsx`;
const componentDir = `${program.dir}/${componentName}`;
const filePath = `${componentDir}/${componentName}.tsx`;
const indexPath = `${componentDir}/index.ts`;
const isSiblingOf = program.siblingof || undefined

const indexTemplate = prettify(`\
export { default } from './${componentName}';
`);

logIntro({ name: componentName, dir: componentDir, type: program.type});

// Check if componentName is provided
if (!componentName) {
  logError(
    `Sorry, you need to specify a name for your component like this: new-component <name>`
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

// Check to see if -s flag (siblingof) has been passed
if (componentDirExist && !isSiblingOf) {
  logError(
    `Looks like this component already exists!`
  );
  process.exit(0);
} else {
const siblingOfComponentExist = fs.existsSync(path.resolve(`${program.dir}/${program.siblingof}/${componentName}.tsx`))
  if(siblingOfComponentExist){
     logError(
    `Looks like this sibling component already exists!`
  );
  
    process.exit(0);
  }else{
    if(isSiblingOf){

      logItemCompletion(
       `${componentName} will be sibling of ${program.siblingof}.`
     );
    }
  }
}


if(!isSiblingOf){
  // Is a new root component

  mkDirPromise(componentDir)
  .then(() => readFilePromiseRelative(templatePath))
  .then((template) =>
    template.replace(/COMPONENT_NAME/g, componentName)
  )
  .then((template) =>
    writeFilePromise(filePath, prettify(template))
  )
  .then((template) =>
    writeFilePromise(indexPath, prettify(indexTemplate))
  )
  .then((template) => {
    logItemCompletion('Root component and index file created.');
    return template;
  })
  .catch((err) => {
    console.error(err);
  });
 
}else{
  // Is a sibling of an existing root component

  const siblingOfComponentDir = `${program.dir}/${program.siblingof}`;
  const siblingOfFilePath = `${siblingOfComponentDir}/${componentName}.tsx`;
  const siblingOfIndexPath = `${siblingOfComponentDir}/index.ts`;
  const siblingOfComponentIndexTemplate = prettify(`\
export { default as ${componentName} } from './${componentName}';
`);
 
  readFilePromiseRelative(templatePath)
   .then((template) =>
    template.replace(/COMPONENT_NAME/g, componentName)
  )
   .then((template) =>
    writeFilePromise(siblingOfFilePath, prettify(template))
  )
   .then((template) =>
    appendFilePromise(siblingOfIndexPath, prettify(siblingOfComponentIndexTemplate))
  )
   .then((template) => {
    logItemCompletion('Sibling component created and relative index file edited.');
    return template;
  })
   .catch((err) => {
    console.error(err);
  });
  
}
