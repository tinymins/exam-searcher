(function(){
    var isTouch = ('ontouchstart' in document.documentElement) ? 'touchstart' : 'click', _on = $.fn.on;
        $.fn.on = function(){
            arguments[0] = (arguments[0] === 'click') ? isTouch: arguments[0];
            return _on.apply(this, arguments); 
        };
})();