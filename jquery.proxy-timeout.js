/*! Enhanced jQuery.proxy() method (Pimped with an optional timeout argument)
*   v1.10.0 - Oct 2012
*   https://github.com/georgeadamson/jQuery.proxy-timeout
*   Copyright (c) 2012 George Adamson; Licensed MIT, GPL
*/
(function ($,undefined) {

    var proxyTimers    = {},        // Hash of Timer IDs currently pending.
        proxyFunctions = {},        // Hash of proxy functions currently pending.
        jQueryProxy    = $.proxy,   // Reference to jQuery's original proxy method.
        slice          = [].slice,  // These last two variables simply improve minification a teeny tiny bit.
        apply          = 'apply';   // 

    // When timeout argument is specified:
    // - The proxied function will run n milliseconds after you invoke the proxy function.
    // - If you call this again with the same function* before the timeout expires, timeout will be canceled and a new one started.
    // - The proxy function returns the Timer ID instead of the function result (Allowing it to be canceled using clearTimeout)
    // - If needed, you can get the proxy function itself by passing just the Timer ID to this method (unless it has expired)
    // - It is functionally equivalent to: setTimeout( function(){ fn.call(context) }, timeout ) but with handy dedupe feature*.
    //   *Useful for normalising noisy repetitive events such as window-resize, thus preventing multiple duplicated triggers.
    $.proxy = function (timeout, fn, context) {

        var args = arguments;

        // Revert to jQuery's standard proxy method when no timeout specified:
        if ( !$.isNumeric(timeout) ) {

            return jQueryProxy[apply]( this, slice[apply](args) );

        } else {

            // Helper to return the proxied function for a given Timer ID: (In this context timeout is an ID not milliseconds)
            if (args.length === 1) {
                return proxyFunctions[timeout];

            // Bail out if fn is useless:
            } else if ( !$.isFunction(fn) ) {
                return undefined;

            // Otherwise return proxy function that will run fn after specified timeout: (Proxy returns the Timeout ID)
            } else {

                clearTimeout(proxyTimers[fn]);

                var proxy = jQueryProxy[apply]( this, slice.call(args, 1) ),

                wrapper = function () {

                    var self = this,
                        args = slice[apply](arguments),

                    timerId = proxyTimers[fn] = setTimeout(function () {
                        delete proxyFunctions[proxyTimers[fn]];
                        delete proxyTimers[fn];
                        proxy[apply](self, args);
                    }, timeout);

                    proxyFunctions[timerId] = proxy;
                    return timerId;

                };

                return wrapper;

            }

        }

    };

})(jQuery);