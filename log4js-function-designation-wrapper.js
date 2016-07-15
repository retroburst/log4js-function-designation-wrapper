// requires
var check = require('check-types');
var util = require('util');
var underscore = require('underscore');

/********************************************************
 * Builds a logger wrapper around the log4js logger.
 ********************************************************/
var loggerWrapper = function loggerWrapper(logger, moduleDesignation){
    // properties
    this.moduleDesignation = moduleDesignation;
    this.logger = logger;
    
    // private methods
    /********************************************************
     * Applies a log method with re-worked arguments.
     ********************************************************/
    var applyLogMethod = function applyLogMethod(logger, method, args, options, moduleDesignation, functionDesignation, isLevelEnabledMethod){
        if(check.not.assigned(logger) || (!isLevelEnabledMethod.apply(logger))) return;
        if(check.object(options) && args.length === 1){
            method.apply(logger, buildArguments(options.arguments, options.moduleDesignation || moduleDesignation, options.functionDesignation || functionDesignation));
        } else {
            method.apply(logger, buildArguments(args, moduleDesignation, functionDesignation));
        }
    };
    
    /********************************************************
     * Builds an re-worked arguments array.
     ********************************************************/
    var buildArguments = function buildArguments(args, moduleDesignation, functionDesignation){
        var argsArray = null;
        if(check.array(args) || underscore.isArguments(args)){
            argsArray = Array.prototype.slice.call(args);
        } else {
            argsArray = [args];
        }
        if(check.nonEmptyString(functionDesignation)){
            argsArray.splice(0, 0, util.format("[%s] :", functionDesignation));
        }
        if(check.nonEmptyString(moduleDesignation)){
            argsArray.splice(0, 0,util.format("%s :", moduleDesignation));
        }
        return(argsArray);
    };
    
    // methods
    /********************************************************
     * Returns a value indicating if this logger wrapper is 
     * valid.
     ********************************************************/
    this.valid = function valid(){
        return(check.assigned(logger));
    };
    
    /********************************************************
     * Wraps the call to log a trace message.
     ********************************************************/
    this.trace = function trace(options){
        applyLogMethod(logger, logger.trace, arguments, options, moduleDesignation, trace.caller.name, logger.isTraceEnabled);
    };
    
    /********************************************************
     * Wraps the call to log a debug message.
     ********************************************************/
    this.debug = function debug(options){
        applyLogMethod(logger, logger.debug, arguments, options, moduleDesignation, debug.caller.name, logger.isDebugEnabled);
    };

    /********************************************************
     * Wraps the call to log a info message.
     ********************************************************/
    this.info = function info(options){
        applyLogMethod(logger, logger.info, arguments, options, moduleDesignation, info.caller.name, logger.isInfoEnabled);
    };
    
    /********************************************************
     * Wraps the call to log a warn message.
     ********************************************************/
    this.warn = function warn(options){
        applyLogMethod(logger, logger.warn, arguments, options, moduleDesignation, warn.caller.name, logger.isWarnEnabled);
    };
    
    /********************************************************
     * Wraps the call to log a error message.
     ********************************************************/
    this.error = function error(options){
        applyLogMethod(logger, logger.error, arguments, options, moduleDesignation, error.caller.name, logger.isErrorEnabled);
    };

    /********************************************************
     * Wraps the call to log a fatal message.
     ********************************************************/
    this.fatal = function fatal(options){
        applyLogMethod(logger, logger.fatal, arguments, options, moduleDesignation, fatal.caller.name, logger.isFatalEnabled);
    };
    
    /********************************************************
     * Wraps the call to log a mark message.
     ********************************************************/
    this.mark = function mark(options){
        applyLogMethod(logger, logger.mark, arguments, options, moduleDesignation, mark.caller.name, logger.isMarkEnabled);
    };
};

module.exports = function (logger, moduleDesignation) {
    return new loggerWrapper(logger, moduleDesignation);
};

