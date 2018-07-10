# Get off my log!

[![Build status][ci-image]][ci-status]

My JavaScript logging library
for node and browser.
Probably lamer
than the other log libraries,
but this one is mine
so nerr.

* [Does the world really need another logging library?](#does-the-world-really-need-another-logging-library)
* [Should I use this library instead of something else?](#should-i-use-this-library-instead-of-something-else)
* [What does this library offer?](#what-does-this-library-offer)
* [What size is it?](#what-size-is-it)
* [How do I install it?](#how-do-i-install-it)
* [How do I use it?](#how-do-i-use-it)
    * [Loading the library](#loading-the-library)
    * [Calling the exported functions](#calling-the-exported-functions)
    * [Examples](#examples)
* [How do I set up the build environment?](#how-do-i-set-up-the-build-environment)
* [What license is it released under?](#what-license-is-it-released-under)

## Does the world really need another logging library?

Absolutely, definitely, resoundingly no,
it does not.

## Should I use this library instead of something else?

Almost certainly no,
you should use something else
instead of this library.

## What does this library offer?

It is fully supported by unit tests,
is small of interface and implementation,
and works in both node.js
and the browser.

Furthermore,
it behaves exactly how I want,
which is quite important
when you're me.

## What size is it?

2.6 kb unminified with comments, 0.7 kb minified, 0.4 kb minified + gzipped

## How do I install it?

Any of the following will do:

```
npm install get-off-my-log

jam install get-off-my-log

bower install get-off-my-log

component install philbooth/get-off-my-log

git clone git@github.com:philbooth/get-off-my-log.git
```

## How do I use it?

### Loading the library

If you are running in
Node.js,
[Browserify]
or another CommonJS-style
environment,
you can `require`
get-off-my-log like so:

```javascript
var log = require('get-off-my-log');
```

It also the supports
the AMD-style format
preferred by [Require.js][require]:

```javascript
require.config({
    paths: {
        log: 'get-off-my-log/src'
    }
});

require([ 'log' ], function (log) {
});
```

If you are
including get-off-my-log
with an HTML `<script>` tag,
or neither of the above environments
are detected,
get-off-my-log will just export its interface globally
as `log`.

### Calling the exported functions

Before logging any data,
you must initialise the library
with an `origin` string,
using the `initialise` function:

```javascript
var fooLog = log.initialise('foo');
```

The benefit of this step
is that it enables
straightforward searching and filtering
of log files
if you are running a project
where you wish to differentiate
between the origins of different log messages:

```javascript
var userLog, systemLog;

userLog = log.initialise('user');
systemLog = log.initialise('system');
```

There is also a second, optional argument to `initialise`,
the `logger` function.
If it is undefined,
it defaults to `console.log`.
However, if you would like to, say,
log messages to a file
rather than the console,
providing a custom logger
enables you to do that:

```javascript
var userLog, systemLog;

userLog = log.initialise('user', userLogger);
systemLog = log.initialise('system', systemLogger);

function userLogger (message) {
    fs.writeFileSync(logs.user, message + '\n');
}

function systemLogger (message) {
    fs.writeFileSync(logs.system, message + '\n');
}
```

Regardless of how
you choose to initialise your logger(s),
each one is returned from `initialise`
as an object with three methods:
`info`, `warn` and `error`.

Each of these methods
takes one argument,
the message that you want to log.
The message will be sent to the appropriate `logger` function
(or `console.log` if you used the default),
prefixed with a timestamp,
the log level of the method
(either `INFO`, `WARN` or `ERROR`),
and the origin
that you set in the call to `initialise`.

### Examples

```javascript
var resizeLog, isFired, isDrawing;

// Initialise the window resize logger
resizeLog = log.initialise('resize');

isFired = isDrawing = false;

window.addEventListener('resize', throttleResize, false);

function throttleResize () {
    if (isDrawing === false) {
        isFired = true;
        draw();
    } else {
        // Write warning-level message to the console
        resizeLog.warn('already drawing');
    }
}

function draw () {
    if (isFired === true) {
        isFired = false;
        isDrawing = true;

        // Write info-level message to the console
        resizeLog.info('started drawing');

        // Draw...

        requestAnimationFrame(draw);
    } else {
        isDrawing = false;

        // Write info-level message to the console
        resizeLog.info('stopped drawing');
    }
}
```

```javascript
var log, databaseLog;

log = require('get-off-my-log');

// Initialise the database logger
databaseLog = log.initialise('database', databaseLogger);

function databaseLogger (message) {
    fs.writeFileSync('/var/log/foo/database.log', message);
}

function update (query, data) {
    // Write info-level message to database log file
    databaseLog.info('updating ' + query + ' with ' + data);

    // Update datbase...

    if (error) {
        // Write error-level message to database log file
        databaseLog.error(error.message);
    }
}
```

## How do I set up the build environment?

The build environment relies on
[Node.js][node],
[JSHint],
[Mocha],
[Chai] and
[UglifyJS].
Assuming that you already have Node.js and NPM set up,
you just need to run `npm install` to
install all of the dependencies as listed in `package.json`.

The unit tests are in `test/index.js`.
You can run them with the command `npm test`.
To run the tests in a web browser,
open `test/index.html`.

## What license is it released under?

[MIT][license]

[ci-image]: https://secure.travis-ci.org/philbooth/get-off-my-log.png?branch=master
[ci-status]: http://travis-ci.org/#!/philbooth/get-off-my-log
[node]: http://nodejs.org/
[browserify]: http://browserify.org/
[require]: http://requirejs.org/
[jshint]: https://github.com/jshint/node-jshint
[mocha]: http://visionmedia.github.com/mocha
[chai]: http://chaijs.com/
[uglifyjs]: https://github.com/mishoo/UglifyJS
[license]: https://github.com/philbooth/get-off-my-log/blob/master/COPYING

