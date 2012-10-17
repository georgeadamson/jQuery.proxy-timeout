
(function ($) {

    var proxyTimers = {},       // Hash of Timer IDs currently pending.
        proxyFunctions = {},    // Hash of proxy functions currently pending.
        _proxy = $.proxy;       // Reference to jQuery's original proxy method.

    // Pimp jQuery's $.proxy helper with an optional timeout argument.
    // When timeout argument is specified:
    // - The proxied function will run automatically after n milliseconds.
    // - If you call this again with the same function before the timeout expires, it will be canceled and a new one created*.
    // - This method returns the Timer ID instead of the proxy function (Allowing it to be canceled using clearTimeout)
    // - If needed, you can get the proxy function by passing the Timer ID to this method (unless it has expired)
    // ( *This feature is useful for normalising noisy repetitive events such as window-resize, to prevent multiple dupe triggers)
    $.proxy = function (fn, context, timeout) {

        // Helper to return the proxied function for a given Timer ID:
        if ($.isNumeric(fn)) {
            return proxyFunctions[fn];

        // Revert to jQuery's standard proxy method when no timeout specified:
        } else if (timeout === undefined) {
            return _proxy(fn, context);

        // Bail out if fn is useless:
        } else if (!$.isFunction(fn)) {
            return undefined;

        // Otherwise run the proxy function after specified timeout: (This returns a Timer ID)
        } else {

            clearTimeout(proxyTimers[fn]);

            var proxy = _proxy(fn, context),

            timer = proxyTimers[fn] = setTimeout(function () {
                console.log(proxyTimers)
                delete proxyFunctions[proxyTimers[fn]];
                delete proxyTimers[fn];
                console.log(proxyTimers)
                proxy();
            }, timeout);

            proxyFunctions[timer] = proxy;
            return timer;

        }

    }

})(jQuery);