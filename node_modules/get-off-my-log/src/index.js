/**
 * My JavaScript logging library for node and browser.
 * Probably lamer than the other log libraries, but this one is mine so nerr.
 */

/*globals console, define, module */

(function (globals) {
    'use strict';

    var functions, methods;
    
    functions = {
        initialise: initialise
    };

    exportFunctions();

    /**
     * Public function `initialise`.
     *
     * Returns a new logger that has `info`, `warn` and `error` methods.
     *
     * @param origin {string}      The logger name, appears in log messages.
     * @param [logger] {function}  An optional logger function, can be used to
     *                             e.g. log messages to a file. Defaults to
     *                             `console.log`.
     */
    function initialise (origin, logger) {
        var methodName, result = {};
    
        for (methodName in methods) {
            if (methods.hasOwnProperty(methodName)) {
                result[methodName] = methods[methodName].bind(null, logger || console.log.bind(console), origin);
            }
        }
    
        return result;
    }
    
    methods = {
        info: createLogMethod('INFO'),
        warn: createLogMethod('WARN'),
        error: createLogMethod('ERROR')
    };
    
    function createLogMethod (level) {
        return write.bind(null, level);
    }
    
    function write (level, logger, origin, message) {
        logger([
            getTimestamp(),
            level,
            origin + ':',
            message
        ].join(' '));
    }
    
    function getTimestamp () {
        var time = new Date();
    
        return [
            formatDate(time),
            formatTime(time)
        ].join(' ');
    }
    
    function formatDate (time) {
        return [
            1900 + time.getYear(),
            padNumber(time.getMonth() + 1),
            padNumber(time.getDate())
        ].join('-');
    }
    
    function formatTime (time) {
        return [
            padNumber(time.getHours()),
            padNumber(time.getMinutes()),
            padNumber(time.getSeconds())
        ].join(':');
    }
    
    function padNumber (number) {
        if (number < 10) {
            return '0' + number;
        }
    
        return number;
    }

    function exportFunctions () {
        if (typeof define === 'function' && define.amd) {
            define(function () {
                return functions;
            });
        } else if (typeof module !== 'undefined' && module !== null) {
            module.exports = functions;
        } else {
            globals.log = functions;
        }
    }
}(this));

