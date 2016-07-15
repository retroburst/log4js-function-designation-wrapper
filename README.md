# log4js-function-designation-wrapper

A simple wrapper for log4js that provides module and function name information in logs without having to define more
than one configured logger. It adds the calling module and function names into the resulting log entry by default but 
can be overridden to provide contextual information for annoymous functions, callback functions and IIFEs.

For normal logging scenarios, you can just call the wrapper as you would the underlying log4js object.
For logging from annoymous functions you can override the module designation and / or function designation, 
as well as the arguments for the underlying log4js function. Please see below for example usage.

## Install

```
npm install log4js-function-designation-wrapper
```


## Usage

```js

var log4js = require('log4js');
var log4jsWrapper = require('./log4js-function-designation-wrapper');

// one confgured logger
// you would usually set this up in your app.js or app initialisation module
global.logger = log4js.getLogger();

// module level logger
var logger = log4jsWrapper(global.logger, "module-name");

// do some logging using a named function expression
var logSome = function logSome(){
    logger.trace('trace');
    logger.debug('debug');
    logger.info('info');
};

// do some more logging using a named function expression
var logSomeMore = function logSomeMore(){
    logger.warn('warn');
    var error = new Error('test');
    error.code = 'fatal';
    logger.error(error);
    logger.fatal('fatal');
    logger.mark('mark');
}

// do some logging using a annoynmous function expression
var logFromAnnonFn = function(){
    var err = new Error('test');
    // override the function designation so this annoymous function can be
    // identified easier in the log
    logger.error({ functionDesignation: "my-annonymous-fn", arguments: ["Failed to do something.", err] });
};

// do some more logging using a annoynmous function expression
var logFromAnnonFn2 = function(){
    var err = new Error('test');
    // override the module and function designations for this log - useful for logging from
    // anonymous or named callbacks that were set up in an initialisation module
    logger.error({ moduleDesignation: "my-custom-module", functionDesignation: "my-annonymous-fn-2", arguments: ["Failed to do something.", err] });
};

logSome();
logSomeMore();
logFromAnnonFn();
logFromAnnonFn2();

// log from an IIFE
(function(){
    var obj = { name: "Lord British", hitpoints : 255 };
    // when overriding, you can pass arguments to the underlying log function via this arguments property,
    // it can be an array of things or a single thing
    logger.debug({ functionDesignation: "my-IIFE", arguments: "Lord British is here." });
    logger.warn({ functionDesignation: "my-IIFE", arguments: ["Failed to do something.", obj] });
}());


```

## Example Output

```

[2016-07-15 15:35:07.397] [TRACE] [default] - module-name : [logSome] : trace
[2016-07-15 15:35:07.404] [DEBUG] [default] - module-name : [logSome] : debug
[2016-07-15 15:35:07.405] [INFO] [default] - module-name : [logSome] : info
[2016-07-15 15:35:07.406] [WARN] [default] - module-name : [logSomeMore] : warn
[2016-07-15 15:35:07.406] [ERROR] [default] - module-name : [logSomeMore] : { [Error: test] code: 'fatal' }
Error: test
    at logSomeMore (/Users/retroburst/Development/log4js-function-designation-wrapper/test.js:21:17)
    at Object.<anonymous> (/Users/retroburst/Development/log4js-function-designation-wrapper/test.js:45:1)
    at Module._compile (module.js:435:26)
    at Object.Module._extensions..js (module.js:442:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:313:12)
    at Function.Module.runMain (module.js:467:10)
    at startup (node.js:136:18)
    at node.js:963:3
[2016-07-15 15:35:07.414] [FATAL] [default] - module-name : [logSomeMore] : fatal
[2016-07-15 15:35:07.414] [MARK] [default] - module-name : [logSomeMore] : mark
[2016-07-15 15:35:07.415] [ERROR] [default] - module-name : [my-annonymous-fn] : Failed to do something. [Error: test]
Error: test
    at logFromAnnonFn (/Users/retroburst/Development/log4js-function-designation-wrapper/test.js:30:15)
    at Object.<anonymous> (/Users/retroburst/Development/log4js-function-designation-wrapper/test.js:46:1)
    at Module._compile (module.js:435:26)
    at Object.Module._extensions..js (module.js:442:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:313:12)
    at Function.Module.runMain (module.js:467:10)
    at startup (node.js:136:18)
    at node.js:963:3
[2016-07-15 15:35:07.416] [ERROR] [default] - my-custom-module : [my-annonymous-fn-2] : Failed to do something. [Error: test]
Error: test
    at logFromAnnonFn2 (/Users/retroburst/Development/log4js-function-designation-wrapper/test.js:38:15)
    at Object.<anonymous> (/Users/retroburst/Development/log4js-function-designation-wrapper/test.js:47:1)
    at Module._compile (module.js:435:26)
    at Object.Module._extensions..js (module.js:442:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:313:12)
    at Function.Module.runMain (module.js:467:10)
    at startup (node.js:136:18)
    at node.js:963:3
[2016-07-15 15:35:07.416] [DEBUG] [default] - module-name : [my-IIFE] : Lord British is here.
[2016-07-15 15:35:07.416] [WARN] [default] - module-name : [my-IIFE] : Failed to do something. { name: 'Lord British', hitpoints: 255 }

```
