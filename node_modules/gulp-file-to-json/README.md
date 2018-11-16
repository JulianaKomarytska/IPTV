# gulp-file-to-json

> Gulp plugin to convert a file and its MD5 hash value into a JSON representation.

[![NPM version](https://badge.fury.io/js/gulp-file-to-json.svg)](https://www.npmjs.org/package/gulp-file-to-json) [![Dependency Status](https://david-dm.org/vast-engineering/gulp-file-to-json.svg)](https://david-dm.org/vast-engineering/gulp-file-to-json) [![devDependency Status](https://david-dm.org/vast-engineering/gulp-file-to-json/dev-status.svg)](https://david-dm.org/vast-engineering/gulp-file-to-json?type=dev)

## Install

```bash
npm install --save-dev gulp-file-to-json
```

## Usage

Transform `example.css`:

```css
body {color: olive;}
```

Into `example.json`:

```json
{
  "md5": "d8fba0d7a4fcb4a293d22ff3361d5a70",
  "value": "body {color: olive;}"
}
```

Using `gulpfile.js`:

```javascript
var gulp = require('gulp');
var file2json = require('gulp-file-to-json');

gulp.task('json-file', function () {
  return gulp.src('example/example.css')
    .pipe(file2json())
    .pipe(gulp.dest('example'));
});
```

## Credits

Inspired by [font-store](https://github.com/CrocoDillon/font-store) (Base64 encodes web fonts to cache in LocalStorage for high performance).

## License

[MIT](https://github.com/vast-engineering/gulp-file-to-json/blob/master/LICENSE) © 2016 Vast.com, Inc.

<!--
TODO:

[![Build Status](https://img.shields.io/travis/TODO/gulp-file-to-json.svg?branch=master)](https://travis-ci.org/TODO/gulp-file-to-json)

[![Coveralls Status](https://img.shields.io/coveralls/TODO/gulp-file-to-json.svg)](https://coveralls.io/r/TODO/gulp-file-to-json)
-->