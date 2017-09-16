var Centerize = function() {

    function borderedWidth(elem) {
        var $elem = $(elem);
        var borl = parseInt($elem.css("border-left-size")) || 0;
        var borr = parseInt($elem.css("border-right-size")) || 0;
        var rad = parseInt($elem.css("border-radius")) || 0;

        return $elem.innerWidth() - (borl + borr + (rad * 2));
    }

    function borderedHeight(elem) {
        var $elem = $(elem);
        var bort = parseInt($elem.css("border-top-size")) || 0;
        var borb = parseInt($elem.css("border-bottom-size")) || 0;
        var rad = parseInt($elem.css("border-radius")) || 0;

        return $elem.innerHeight() - (bort + borb + (rad * 2));
    }

    function heightof(parent,inner) {
        if (parent[0].tagName.toLowerCase() == "body") {
            return $(window).height();
        } else if (inner) {
            return borderedHeight(parent);
        } else {
            return parent.outerHeight();
        }
    }

    function widthof(parent,inner) {
        if (inner) {
            return borderedWidth(parent);
        } else {
            return parent.outerWidth();
        }
    }

    function __c(doh, dov) {
        return function (__this, parent) {
            if (!parent) {
                parent = __this.parent();
            }

            if (doh) __this.css("left", (parent.outerWidth() - __this.outerWidth()) / 2 + "px");
            if (dov) __this.css("top", (heightof(parent) - __this.outerHeight()) / 2 + "px");

            console.log(dov, (parent.outerHeight() - __this.outerHeight()) / 2);
        }
    }

    var __cdef = __c(true, true);
    var __chor = __c(true, false);
    var __cver = __c(false, true);

    function __h(useaspect) {
        return function (__this, percent, parent) {
            if (!percent) percent = 1;
            if (percent > 1) percent = percent / 100;

            if (!parent) {
                parent = $(__this.parent());
            }

            var aspect;
            var w;
            var h = Math.floor(heightof(parent, true) * percent);
            if (useaspect) {
                aspect = __this.width() / __this.height();
                w = Math.floor(h * aspect);
            } else {
                w = __this.width();
            }

            if (__this[0].tagName.toLowerCase() == "canvas") {
                __this[0].height = h;
                __this[0].width = w;
            } else {
                __this.css({
                    height: h + "px",
                    width: w + "px"
                });
            }
        }
    }

    var __ha = __h(true);
    var __ho = __h(false);

    function __w(useaspect) {
        return function (__this, percent, parent) {
            if (!percent) percent = 1;
            if (percent > 1) percent = percent / 100;

            if (!parent) {
                parent = $(__this.parent());
            }

            var aspect;
            var h;
            var w = Math.floor(parent.width() * percent);
            if (useaspect) {
                aspect = __this.height() / __this.width();
                h = Math.floor(w * aspect);
            } else {
                h = __this.height();
            }

            if (__this[0].tagName.toLowerCase() == "canvas") {
                __this[0].height = h;
                __this[0].width = w;
            } else {
                __this.css({
                    height: h + "px",
                    width: w + "px"
                });
            }
        }
    }

    var __wa = __w(true);
    var __wo = __w(false);

    function __t(doh, dov, useaspect) {
        return function (__this, parent) {
            if (!parent) {
                parent = $(__this.parent());
            }

            var h = heightof(parent, true);
            var w = widthof(parent, true);

            var haspect = __this.height() / __this.width();
            var waspect = __this.width() / __this.height();

            var sib = __this.siblings(), count = sib.length;

            console.log("parent",w,h,doh, dov, useaspect);

            sib.each(function () {
                console.log($(this));

                if ($(this).css("position") != "absolute") {
                    h -= $(this).outerHeight();
                    w -= $(this).outerWidth();

                    console.log("sibling:", this, h, w);
                }

                if (!--count) {
                    if (dov) {
                        if (__this[0].tagName.toLowerCase() == "canvas") {
                            __this[0].height = h;

                            if (useaspect) {
                                __this[0].width = h * waspect;
                            }
                        } else {
                            __this.css("height", h + "px");
                            if (useaspect) {
                                __this.css("width", h * waspect + "px");
                            }
                        }
                    }
                    if (doh) {
                        if (__this[0].tagName.toLowerCase() == "canvas") {
                            __this[0].height = h;

                            if (useaspect) {
                                __this[0].width = w * haspect;
                            }
                        } else {
                            __this.css("width", w + "px");

                            if (useaspect) {
                                __this.css("height", w * haspect + "px");
                            }
                        }
                    }
                }
            });
        }
    }

    var __tdef = __t(true, true);
    var __thor = __t(true, false);
    var __tver = __t(false, true);
    var __tvera = __t(false, true, true);
    var __thora = __t(true, false, true);

    $.fn.centerize = function (parent) {
        __cdef(this, parent);
    };
    $.fn.horizontal = function (parent) {
        __chor(this, parent);
    };
    $.fn.vertical = function (parent) {
        __cver(this, parent);
    };
    $.fn.heightAspect = function (percent, parent) {
        __ha(this, percent, parent);
    };
    $.fn.heightPercent = function (percent, parent) {
        __ho(this, percent, parent);
    };
    $.fn.widthPercent = function (percent, parent) {
        __wo(this, percent, parent);
    };
    $.fn.widthAspect = function (percent, parent) {
        __wa(this, percent, parent);
    };
    $.fn.takeup = function (parent) {
        __tdef(this, parent);
    };
    $.fn.takeupWidth = function (parent) {
        __thor(this, parent);
    };
    $.fn.takeupHeight = function (parent) {
        __tver(this, parent);
    };
    $.fn.takeupWidthAspect = function (parent) {
        __thora(this, parent);
    };
    $.fn.takeupHeightAspect = function (parent) {
        __tvera(this, parent);
    };
    $.fn.borderedHeight = function () {
        borderedHeight(this);
    };
    $.fn.borderedWidth = function () {
        borderedWidth(this);
    };

    return {
        centerize: __cdef,
        horizontal: __chor,
        vertical: __cver,
        heightPercent: __ho,
        heightAspect: __ha,
        widthPercent: __wo,
        widthAspect: __wa,
        takeup: __tdef,
        takeupWidth: __thor,
        takeupHeight: __tver,
        takeupWidthAspect: __thora,
        takeupHeightAspect: __tvera,
        borderedHeight: borderedHeight,
        borderedWidth: borderedWidth

    }
}();