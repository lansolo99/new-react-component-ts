# New Typescript React Component CLI utility
- Simplified version based on a fork from [Robert Orlinski](https://github.com/robert-orlinski/new-component), originally forked from the [Josh Comeau package](https://github.com/joshwcomeau/new-component)
- Simple, customizable utility for adding new React components to your project
- This project is a globally-installable CLI for adding new React components.

<br />

## Features

- Simple CLI interface for adding functional components written in TypeScript.
- 2 editable templates models: with or without props
- 2 ways of inserting components:
  - As a new root component
  - As a sibling of an existing component
- Offers global config, which can be overridden on a project-by-project basis.
- Colourful terminal output

<br />

## Install

```bash
# Yarn:
$ yarn global add new-react-component-ts
```

<br />

## Usage

<br />

> `cd` into your project's directory, and try creating a new component:

```bash
new-component Button
```

<br />

> Your project will now have a new directory at `src/components/Button`. This directory has two files:

```ts

// `Button/index.ts`
export { default } from './Button';
```

```tsx
// `Button/Button.tsx`

const Button = () => <div>Component without props</div>;

export default Button;
```

<br />

> Now you can import your created component via `import Button from 'components/Button'`

<br />

## Configuration

<br />

Configuration can be done through 3 different ways:

- Creating a global `.new-component-config.json` in your home directory (`~/.new-component-config.json`).
- Creating a local `.new-component-config.json` in your project's root directory.
- Command-line arguments.

The resulting values are merged, with command-line values overwriting local values, and local values overwriting global ones.

<br />

## API Reference

### Type

Control the type of component created:

- `default` for a functional component WITHOUT props.
- `props` for a functional component WITH base props markup.


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

### Sibling of

Controls the file created as being a sibling component of an existing one

> A sibling component is a common pattern that set multiples components belonging to the same feature. The file structure approach is [well described](https://www.joshwcomeau.com/react/file-structure/) by Josh Comeau. Eg:


- Button
- ButtonIcon
- ButtonGroup

**Usage:**

Command line: `--siblingof <existingComponentName>` or `-s <existingComponentName>`
<br /><br />

> Using this command will not create a new folder but inserting the new component in the provided component'name folder.

```bash
new-component ButtonGroup -s Button
```

> The index file will append the new sibling component reference as a named export into the proper index.ts file.

If the root component doesn't exist, the command will throw an error.

<br>

### Prettier Config

Delegate settings to Prettier, so that your new component is formatted as you'd like. Defaults to Prettier defaults.

For a full list of options, see the [Prettier docs](https://github.com/prettier/prettier#options).

**Usage:**

<br />
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

<br />

## Platform Support

This has only been tested in macOS.

<br/>

## Roadmap

Here are some improvement I plan to release sooner or later

- [ ] Implement proprer eslint configuration
- [ ] Refactor actions using async/await instead of promises

