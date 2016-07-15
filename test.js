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
    var obj = { name: "Lord British", hitposints : 255 };
    // when overriding, you can pass arguments to the underlying log function via this arguments property,
    // it can be an array of things or a single thing
    logger.debug({ functionDesignation: "my-IIFE", arguments: "Lord British is here." });
    logger.warn({ functionDesignation: "my-IIFE", arguments: ["Failed to do something.", obj] });
}());