# babel-plugin-tiny

Babel plugin for custom Tiny resolution.

## Installation

```sh
$ npm install tiny-babel-plugin
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["tiny"]
}
```

### Via CLI

```sh
$ babel --plugins tiny script.js
```

### Via Node API

```javascript
require('babel').transform('code', {
  plugins: ['tiny']
});
```
