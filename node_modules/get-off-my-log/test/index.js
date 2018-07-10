/*globals require, chai */

(function (require) {
    'use strict';

    var assert, modulePath, glob;

    if (typeof require === 'undefined') {
        assert = chai.assert;
        require = function () { return log; };
        glob = window;
    } else {
        assert = require('chai').assert;
        modulePath = '../src/index';
        glob = global;
    }

    suite('no setup:', function () {
        test('require does not throw', function () {
            assert.doesNotThrow(function () {
                require(modulePath);
            });
        });

        test('require returns object', function () {
            assert.isObject(require(modulePath));
        });
    });

    suite('require:', function () {
        var uninitialised;

        setup(function () {
            uninitialised = require(modulePath);
        });

        teardown(function () {
            uninitialised = undefined;
        });

        test('initialise function is defined', function () {
            assert.isFunction(uninitialised.initialise);
        });

        test('initialise returns object', function () {
            assert.isObject(uninitialised.initialise());
        });

        test('info function is not defined', function () {
            assert.isUndefined(uninitialised.info);
        });

        test('warn function is not defined', function () {
            assert.isUndefined(uninitialised.warn);
        });

        test('error function is not defined', function () {
            assert.isUndefined(uninitialised.error);
        });

        suite('initialise without logger:', function () {
            var count, these, args, originalConsole, initialised;

            setup(function () {
                count = 0;
                these = [];
                args = [];
                originalConsole = glob.console.log;
                glob.console.log = function () {
                    count += 1;
                    these.push(this);
                    args.push(arguments);
                };
                initialised = uninitialised.initialise('foo');
            });

            teardown(function () {
                glob.console.log = originalConsole;
                count = these = args = originalConsole = initialised = undefined;
            });

            test('info function is defined', function () {
                assert.isFunction(initialised.info);
            });

            test('warn function is defined', function () {
                assert.isFunction(initialised.warn);
            });

            test('error function is defined', function () {
                assert.isFunction(initialised.error);
            });

            test('console.log was not called', function () {
                assert.strictEqual(count, 0);
            });

            suite('info:', function () {
                var time;

                setup(function () {
                    time = new Date();
                    initialised.info('wibble');
                });

                teardown(function () {
                    time = undefined;
                });

                test('console.log was called once', function () {
                    assert.strictEqual(count, 1);
                });

                test('console.log was called on console', function () {
                    assert.strictEqual(these[0], console);
                });

                test('console.log was passed one argument', function () {
                    assert.lengthOf(args[0], 1);
                });

                test('console.log was passed string', function () {
                    assert.isString(args[0][0]);
                });

                test('console.log was passed unempty string', function () {
                    assert.notEqual(args[0][0], '');
                });

                test('console.log was passed correct number of components', function () {
                    assert.strictEqual(args[0][0].split(' ').length, 5);
                });

                test('console.log was passed correctly formatted date', function () {
                    var date;

                    date = args[0][0].split(' ')[0].split('-');

                    assert.lengthOf(date, 3);
                    assert.lengthOf(date[0], 4);
                    assert.lengthOf(date[1], 2);
                    assert.lengthOf(date[2], 2);
                });

                test('console.log was passed correct year', function () {
                    var date, year, month;

                    date = args[0][0].split(' ')[0].split('-');

                    year = parseInt(date[0]) - 1900;
                    month = parseInt(date[1]) - 1;

                    assert.isTrue(
                        year === time.getYear() || (
                            month === 0 && year === time.getYear() + 1
                        )
                    );
                });

                test('console.log was passed correct month', function () {
                    var date, month, day;

                    date = args[0][0].split(' ')[0].split('-');

                    month = parseInt(date[1]) - 1;
                    day = parseInt(date[2]);

                    assert.isTrue(
                        month === time.getMonth() || (
                            day === 1 && (
                                month === time.getMonth() + 1 || (
                                    month === 0 && time.getMonth() === 11
                                )
                            )
                        )
                    );
                });

                test('console.log was passed correct day', function () {
                    var date, day;

                    date = args[0][0].split(' ')[0].split('-');
                    day = parseInt(date[2]);

                    assert.isTrue(
                        day === time.getDate() || (
                            day === 1 && (
                                time.getDate() === 28 || time.getDate() === 30 || time.getDate() === 31
                            )
                        )
                    );
                });

                test('console.log was passed correctly formatted time', function () {
                    var timestamp, hour, minute, second;

                    timestamp = args[0][0].split(' ')[1].split(':');

                    assert.lengthOf(timestamp, 3);
                    assert.lengthOf(timestamp[0], 2);
                    assert.lengthOf(timestamp[1], 2);
                    assert.lengthOf(timestamp[2], 2);
                });

                test('console.log was passed correct hour', function () {
                    var timestamp, hour, minute;

                    timestamp = args[0][0].split(' ')[1].split(':');
                    hour = parseInt(timestamp[0]);
                    minute = parseInt(timestamp[1]);

                    assert.isTrue(
                        hour === time.getHours() || (
                            minute === 0 && (
                                hour === time.getHours() + 1 || (
                                    hour === 0 && time.getHours() === 23
                                )
                            )
                        )
                    );
                });

                test('console.log was passed correct minute', function () {
                    var timestamp, minute, second;

                    timestamp = args[0][0].split(' ')[1].split(':');
                    minute = parseInt(timestamp[1]);
                    second = parseInt(timestamp[2]);

                    assert.isTrue(
                        minute === time.getMinutes() || (
                            second === 0 && (
                                minute === time.getMinutes() + 1 || (
                                    minute === 0 && time.getMinutes() === 59
                                )
                            )
                        )
                    );
                });

                test('console.log was passed correct second', function () {
                    var timestamp, hour, minute, second;

                    timestamp = args[0][0].split(' ')[1].split(':');
                    hour = parseInt(timestamp[0]);
                    minute = parseInt(timestamp[1]);
                    second = parseInt(timestamp[2]);

                    assert.isTrue(
                        second === time.getSeconds() || second === time.getSeconds() + 1 || (
                            second === 0 && time.getSeconds() === 59
                        )
                    );
                });

                test('console.log was passed correct level', function () {
                    assert.strictEqual(args[0][0].split(' ')[2], 'INFO');
                });

                test('console.log was passed correct origin', function () {
                    assert.strictEqual(args[0][0].split(' ')[3], 'foo:');
                });

                test('console.log was passed correct message', function () {
                    assert.strictEqual(args[0][0].split(' ')[4], 'wibble');
                });
            });

            suite('warn:', function () {
                var time;

                setup(function () {
                    time = new Date();
                    initialised.warn('thequickbrownfoxjumpsoverthelazydog');
                });

                teardown(function () {
                    time = undefined;
                });

                test('console.log was called once', function () {
                    assert.strictEqual(count, 1);
                });

                test('console.log was passed correct number of components', function () {
                    assert.strictEqual(args[0][0].split(' ').length, 5);
                });

                test('console.log was passed correctly formatted date', function () {
                    var date;

                    date = args[0][0].split(' ')[0].split('-');

                    assert.lengthOf(date, 3);
                    assert.lengthOf(date[0], 4);
                    assert.lengthOf(date[1], 2);
                    assert.lengthOf(date[2], 2);
                });

                test('console.log was passed correctly formatted time', function () {
                    var timestamp, hour, minute, second;

                    timestamp = args[0][0].split(' ')[1].split(':');

                    assert.lengthOf(timestamp, 3);
                    assert.lengthOf(timestamp[0], 2);
                    assert.lengthOf(timestamp[1], 2);
                    assert.lengthOf(timestamp[2], 2);
                });

                test('console.log was passed correct level', function () {
                    assert.strictEqual(args[0][0].split(' ')[2], 'WARN');
                });

                test('console.log was passed correct origin', function () {
                    assert.strictEqual(args[0][0].split(' ')[3], 'foo:');
                });

                test('console.log was passed correct message', function () {
                    assert.strictEqual(args[0][0].split(' ')[4], 'thequickbrownfoxjumpsoverthelazydog');
                });
            });

            suite('error:', function () {
                var time;

                setup(function () {
                    time = new Date();
                    initialised.error('wibble');
                });

                teardown(function () {
                    time = undefined;
                });

                test('console.log was called once', function () {
                    assert.strictEqual(count, 1);
                });

                test('console.log was passed correct level', function () {
                    assert.strictEqual(args[0][0].split(' ')[2], 'ERROR');
                });
            });
        });

        suite('initialise with logger:', function () {
            var count, these, args, flag, originalConsole, initialised;

            setup(function () {
                count = 0;
                these = [];
                args = [];
                flag = false;
                originalConsole = glob.console.log;
                glob.console.log = function () {
                    flag = true;
                };
                initialised = uninitialised.initialise('bar', function () {
                    count += 1;
                    these.push(this);
                    args.push(arguments);
                });
            });

            teardown(function () {
                glob.console.log = originalConsole;
                count = these = args = flag = originalConsole = initialised = undefined;
            });

            test('info function is defined', function () {
                assert.isFunction(initialised.info);
            });

            test('warn function is defined', function () {
                assert.isFunction(initialised.warn);
            });

            test('error function is defined', function () {
                assert.isFunction(initialised.error);
            });

            test('logger was not called', function () {
                assert.strictEqual(count, 0);
            });

            suite('info:', function () {
                setup(function () {
                    initialised.info('wibble');
                });

                test('logger was called once', function () {
                    assert.strictEqual(count, 1);
                });

                test('logger was called on undefined', function () {
                    assert.isUndefined(these[0]);
                });

                test('logger was passed one argument', function () {
                    assert.lengthOf(args[0], 1);
                });

                test('logger was passed string', function () {
                    assert.isString(args[0][0]);
                });

                test('logger was passed correct number of components', function () {
                    assert.strictEqual(args[0][0].split(' ').length, 5);
                });

                test('logger was passed correct origin', function () {
                    assert.strictEqual(args[0][0].split(' ')[3], 'bar:');
                });

                test('console.log was not called', function () {
                    assert.isFalse(flag);
                });
            });
        });
    });
}(typeof require === 'function' ? require : undefined));

