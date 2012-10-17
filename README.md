jQuery.proxy-timeout
====================

Enhance jQuery.proxy() to run proxied function automatically after n milliseconds.
(Handy for normalizing multiple resize events etc.)

Syntax:
  $.proxy( fn, context, timeout )

TODO:
- Sensible handling of additional fn arguments (because I've broken the way jQuery.proxy() accepts them :(