# New Typescript React Component CLI utility
- Simplified version based on a fork from [Robert Orlinski](https://github.com/robert-orlinski/new-component), originally forked from the [Josh Comeau package](https://github.com/joshwcomeau/new-component)
- Simple, customizable utility for adding new React components to your project
- This project is a globally-installable CLI for adding new React components.


## Features

- Simple CLI interface for adding functional components written in TypeScript.
- Uses [Prettier](https://github.com/prettier/prettier)
- Offers global config, which can be overridden on a project-by-project basis.
- Colourful terminal output

## Quickstart

```bash
# Yarn:
$ yarn global add new-react-component-ts

# NPM
$ npm i -g new-react-component-ts
```

`cd` into your project's directory, and try creating a new component:

<img src="https://github.com/joshwcomeau/new-component/blob/master/docs/demo.gif?raw=true" width="888" height="369" alt="demo of CLI functionality">


Your project will now have a new directory at `src/components/Button`. This directory has two files:

```jsx
// `Button/index.ts`
export { default } from './Button';
```

```jsx
// `Button/Button.tsx`
import { Component } from 'react';

class Button extends Component {
  render() {
    return <div>Test content</div>;
  }
}

export default Button;
```

> This structure might appear odd to you, with an `index.ts` that points to a named file. I've found this to be an optimal way to set up components; the `index.ts` allows you to `import` from the directory (eg. `import Button from 'components/Button'`), while having `Button.tsx` means that you're never lost in a sea of `index.ts` files in your editor.
>
> This structure is not currently configurable, but I'm happy to consider implementing alternatives!

<br />

## Configuration

Configuration can be done through 3 different ways:

- Creating a global `.new-component-config.json` in your home directory (`~/.new-component-config.json`).
- Creating a local `.new-component-config.json` in your project's root directory.
- Command-line arguments.

The resulting values are merged, with command-line values overwriting local values, and local values overwriting global ones.

<br />

## API Reference

### Type

Control the type of component created:

- `functional` for a stateless functional component (default).
- `class` for a traditional Component class,
- `pure-class` for a PureComponent class,

Legacy `createClass` components are not supported.

**Usage:**

Command line: `--type <value>` or `-t <value>`

JSON config: `{ "type": <value> }`
<br />

### Directory

Controls the desired directory for the created component. Defaults to `components`

**Usage:**

Command line: `--dir <value>` or `-d <value>`

JSON config: `{ "dir": <value> }`
<br />

### Language

Controls the language for the created components. Can be either `ts` (default) or `js`.

**Usage:**

Command line: `--language <value>` or `-l <value>`

JSON config: `{ "language": <value> }`
<br />

### File Extension

Controls the file extension for the created components. Can be either `js` (default) or `jsx`. 

> As you see, `tsx` is not predicted - everything because if you choose TypeScript as the [language](#language), file extension always remain `tsx` and you don't have to tweak this option in any way. 

**Usage:**

Command line: `--extension <value>` or `-x <value>`

JSON config: `{ "extension": <value> }`
<br />

### Prettier Config

Delegate settings to Prettier, so that your new component is formatted as you'd like. Defaults to Prettier defaults.

For a full list of options, see the [Prettier docs](https://github.com/prettier/prettier#options).

**Usage:**

Command line: N/A (Prettier config is only controllable through JSON)

JSON config: `{ "prettierConfig": { "key": "value" } }`
<br />

**Example:**

```js
{
  "prettierConfig": {
    "singleQuote": true,
    "semi": false,
  }
}
```

(Ideally, the plugin would consume your project's prettier settings automatically! But I haven't built this yet. PRs welcome!)

<br />

## Platform Support

This has only been tested in macOS. I think it'd work fine in linux, but I haven't tested it. Windows is a big question mark (would welcome contribution here!).

<br />

## Development

To get started with development:

- Check out this git repo locally, you will need to ensure you have Yarn installed globally.
- In the folder run `yarn install`
- Check that command runs `node ../new-component/src/index.js --help`
- Alternatively you can set up a symlink override by running `npm link` then `new-component --help`. Note: this will override any globally installed version of this package.
