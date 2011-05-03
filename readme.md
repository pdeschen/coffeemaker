# CoffeeMaker

 CoffeeMaker is a JavaScript basic build system written for [node](http://nodejs.org).

 CoffeeMaker is a 4.333 hour project of in part, my interest in learning more about node, commonjs and some other
 javascript neat stuff. To my knowledge, there are currently no build system running over node.

## Features

  * Basic task dependency support
  * Basic template rendering and i18n support
  * Http serve task helper  

## Installation

Install from npm:

    $ npm install coffeemaker

Install from git clone or tarball:

    $ node coffeemaker.js

## Usage Examples

Simple example:

    $ coffeemaker

With spec file location

    $ coffeemaker -f /some/path/spec.js

With spec file location and target list

    $ coffeemaker -f /some/path/spec.js [doc,archive]

## Usage

Output from `-h`:

    Usage: coffeemaker [-f buildspec] [target1, target2, ...]

	Options:
	  -f       Build spec.js location (default to ./spec.js
	  -h       Display help information
	  -v       Display version number

## Todo

  * Add doc as an helper (dox)
  * Add mustache as an helper
  * Add file modification listener for task relaunch
  * Add lint helper (jslint)
  * Add minify helper (https://github.com/mishoo/UglifyJS)
  * Add TDD helper (expresso)
  * Add generation of npm package.json helper
  * Add release version helper

## Known Bugs

  * Task dependencies does not detect infinite loop
  * Lots of error handling missing

## Contributors

  * Pascal Deschenes

## License 

(The MIT License)

Copyright (c) 2011 Pascal Deschenes

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.