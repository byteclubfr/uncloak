[![Build Status](https://img.shields.io/travis//master.svg?style=flat)](https://travis-ci.org/)
[![Dependency Status](https://david-dm.org/.svg?style=flat)](https://david-dm.org/)
[![devDependency Status](https://david-dm.org//dev-status.svg?style=flat)](https://david-dm.org/#info=devDependencies)

# uncloak

a [reveal.js](https://github.com/hakimel/reveal.js) theme editor to tweak colors and font styles in a live GUI.

## Installation & Usage

    $ npm install uncloak
    $ cd uncloak
    $ npm install
    $ npm start

This will start a webserver on `localhost:8080`. The standard reveal.js presentation will be loaded in the left frame.

Everytime you tweak the inputs the right sidebar (colors, sizes…), 3 things happen in realtime :

* a SCSS file is generated, with the vars equivalent to the ones found in reveal.js (like beige.scss, solarized.scss…)
* a full CSS file is generated, ready to be used in your own presentations.
* live preview!

## License

The MIT License

Copyright (c) 2015, Delapouite

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
