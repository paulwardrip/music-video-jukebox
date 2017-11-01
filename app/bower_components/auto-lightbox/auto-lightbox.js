var __albinstance;

var AutoLightBox = function(elem) {
    if (__albinstance !== undefined) {
        __albinstance.parent(elem);
        return __albinstance
    }

    var box = document.createElement("div");
    var attached = false;
    var parent;
    var visible = false;
    var control;

    function incrementControl() {
        control = function () {
            if (typeof window.LightboxAutoControl === 'undefined') {
                window.LightboxAutoControl = 1;
            } else {
                window.LightboxAutoControl++;
            }
            return window.LightboxAutoControl;
        }();
    }

    var show = function () {
        if (typeof $ !== 'undefined') {
            $(box).fadeTo(200, .5);
        } else {
            box.style.opacity = .5;
        }
        var style = window.getComputedStyle(parent);
        if (style.zIndex) {
            box.style.zIndex = style.zIndex - 1;
        } else {
            parent.style.zIndex = 100;
            box.style.zIndex = 99;
        }
        visible = true;
    };

    var hide = function () {
        if (typeof $ !== 'undefined') {
            $(box).fadeTo(200, 0);
        } else {
            box.style.opacity = 0;
        }
        visible = false;
    };

    function adjustSize() {
        box.style.height = "1px";
        box.style.width = "1px";

        if (visible) {
            box.style.height = window.innerHeight + "px";
            box.style.width = window.innerWidth + "px";
        }
    }

    function assignparent(elem) {
        if (elem) {
            if (elem instanceof jQuery) {
                elem = elem.get(0);
            } else if (typeof elem === 'string') {
                elem = document.querySelector(elem);
            }

            incrementControl();

            var zi;

            if (parent) {
                parent.classList.remove("lightbox-auto-control-" + (control - 1));
                box.classList.remove("lightbox-" + (control - 1));
                var comps = window.getComputedStyle(parent);

                zi = comps.zIndex;
            }

            parent = elem;

            if (parent.classList) {
                parent.classList.add("lightbox-auto-control-" + control);
            } else {
                parent.class = "lightbox-auto-control-" + control;
            }

            if (box.classList) {
                box.classList.add("lightbox-" + control);
            } else {
                box.class = "lightbox-" + control;
            }

            var style = window.getComputedStyle(elem);

            var z = style.zIndex;
            if (!z || z === "auto") {
                if (zi) {
                    z = zi + 2;
                } else {
                    z = 50;
                }

                elem.style.zIndex = z;
            }

            box.style.zIndex = (parseInt(z) - 1);
        }
    }

    var attach = function () {
        if (!attached) {
            document.body.appendChild(box);
            attached = true;
        }
    };

    var detach = function () {
        document.body.removeChild(box);
        attached = false;
    };

    box.style.position = "fixed";
    box.style.backgroundColor = "black";
    box.style.opacity = 0;
    box.style.left = 0;
    box.style.top = 0;

    assignparent(elem);
    adjustSize();

    attach();

    window.setInterval(function () {
        if (automatic) {
            var ac = document.querySelector(".lightbox-auto-control-" + control);

            if (ac) {
                var style = window.getComputedStyle(ac);
                if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === 0) {
                    if (visible) hide();
                } else {
                    if (!visible) show();
                }
            }
        }

        if (attached) {
            adjustSize();
        }
    }, 100);

    var automatic = true;

    var __api = {
        show: show,
        hide: hide,
        attach: attach,
        detach: detach,
        parent: assignparent,
        color: function (c) {
            box.style.backgroundColor = c;
        },
        automatic: automatic
    };

    __albinstance = __api;

    return __api;
};

function jqplug() {
    $.fn.autolightbox = function () {
        AutoLightBox(this);
    };
    console.log("Registered jQuery plugin for autolightbox.");
}

if (typeof $ !== 'undefined') {
    console.debug("jQuery is defined, registering plugin.");
    jqplug();
} else {
    console.debug("jQuery is not defined, waiting.");
    window.setTimeout(function () {
        if (typeof $ !== 'undefined') {
            jqplug();
        } else {
            console.debug("jQuery was never available, giving up on plugin.");
        }
    }, 0);
}