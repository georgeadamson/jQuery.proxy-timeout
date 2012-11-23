jQuery.proxy-timeout
====================

Enhance jQuery.proxy() to run proxied function automatically after n milliseconds.
(Handy for normalizing multiple resize events etc.)

Syntax:
* $.proxy( fn, context )           // Standard usage
* $.proxy( timeout, fn, context )  // Enhanced usage

By providing one extra parameter you can make the proxied function run after a timeout period.
The cunning part is that it can be used to automatically dedupe repetitive function calls. See notes in js.
