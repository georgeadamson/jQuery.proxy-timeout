
(function ($) {

    var proxyTimers = {},       // Hash of Timer IDs currently pending.
        proxyFunctions = {},    // Hash of proxy functions currently pending.
        $_proxy = $.proxy;      // Reference to jQuery's original proxy method.

    // Pimp jQuery's $.proxy helper with an optional timeout argument.
    // When timeout argument is specified:
    // - The proxied function will run n milliseconds after to run the proxy function.
    // - If you call this again with the same function* before the timeout expires, it will be canceled and a new one created.
    // - The proxy function returns the Timer ID instead of the function result (Allowing it to be canceled using clearTimeout)
    // - If needed, you can get the proxy function itself by passing just the Timer ID to this method (unless it has expired)
    // - It is functionally equivalent to: setTimeout( function(){ fn.call(context) }, timeout );
    //   *This feature is useful for normalising noisy repetitive events such as window-resize, to prevent multiple dupe triggers.
    $.proxy = function (timeout, fn, context) {

        if (!$.isNumeric(timeout)) {

            // Revert to jQuery's standard proxy method when no timeout specified:
            return $_proxy.apply(this, [].slice.call(arguments));

        } else {

            // Helper to return the proxied function for a given Timer ID:
            if (arguments.length === 1) {
                return proxyFunctions[timeout];

                // Bail out if fn is useless:
            } else if (!$.isFunction(fn)) {
                return undefined;

                // Otherwise return proxy function that will run fn after specified timeout: (Proxy returns the Timeout ID)
            } else {

                clearTimeout(proxyTimers[fn]);

                var proxy = $_proxy.apply(this, [].slice.call(arguments, 1)),

                wrapper = function () {

                    var self = this,
                        args = [].slice.call(arguments),

                    timerId = proxyTimers[fn] = setTimeout(function () {
                        delete proxyFunctions[proxyTimers[fn]];
                        delete proxyTimers[fn];
                        proxy.apply(self, args);
                    }, timeout);

                    proxyFunctions[timerId] = proxy;
                    return timerId;

                }

                return wrapper;

            }

        }

    }

})(jQuery);