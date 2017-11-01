var Journal = function (){
    var version = "1.0.5";

    var level = localStorage.getItem("Journal-Level") || "warn";
    var loggers = JSON.parse(localStorage.getItem("Journal-Loggers")) || [];

    var objreftable = [];

    var logs = [];

    var c = {
        debug: console.info.bind(console),
        info: console.info.bind(console),
        warn: console.warn.bind(console),
        error: console.error.bind(console)
    };

    function clearLevels() {
        loggers = [];
        localStorage.setItem("Journal-Loggers", []);
        setLevel("warn");
        return "warn";
    }

    function mostSpecific(ident){
        var both, func, file;

        loggers.forEach(function(log){
            if (log.function) {
                if (log.function === ident.function) {
                    if (log.file && log.file === ident.file) {
                        both = log;
                    } else {
                        func = log;
                    }
                } else {
                    return
                }
            } else if (log.file) {
                if (log.file === ident.file) {
                    file = log;
                } else {
                    return;
                }
            }
        });

        return both || func || file || { level: level };
    }

    function setLevel(lv, func, file) {
        if (lv !== "debug" && lv !== "info" && lv !== "warn" && lv !== "error" && lv !== "off") {
            c.error(lv, "is not a valid log level.");
            return null;
        }
        if (!func && !file) {
            localStorage.setItem("Journal-Level", lv);
            level = lv;
        } else {
            var ident = {
                function: func,
                file: file,
                level: lv
            };

            var dopush = true;
            for (var idx in loggers) {
                if (loggers[idx].function === ident.function
                    && loggers[idx].file === ident.file) {
                    loggers[idx].level = ident.level;
                    dopush = false;
                    break;
                }
            }

            if (dopush){
                loggers.push(ident);
            }

            localStorage.setItem("Journal-Loggers", JSON.stringify(loggers));
        }
        return lv;
    }

    function extractStackTrace() {
        var identity = {};
        var obj = {};
        Error.captureStackTrace(obj, extractStackTrace);
        var stacktop = obj.stack.substr(obj.stack.indexOf("at", obj.stack.indexOf("at") + 1));
        var stacknl = stacktop.indexOf("\n");
        if (stacknl > -1) stacktop = stacktop.substr(0, stacknl);
        if (stacktop.indexOf("(") > -1) {
            identity.function = stacktop.substr (stacktop.indexOf("at ") + 3, stacktop.indexOf(" (") - 3);
        }
        stacktop = stacktop.substr(stacktop.lastIndexOf("/") + 1);
        identity.line = stacktop.substr(stacktop.indexOf(":") + 1, stacktop.lastIndexOf(":") -
            stacktop.indexOf(":") - 1);
        identity.file = (stacktop.indexOf(".js") > -1) ?
            stacktop.substr(0, stacktop.indexOf(".js") + 3) :
            stacktop.substr(0, stacktop.indexOf(".html") + 5);
        return identity;
    }

    function isLevelActive(ident) {
        var toident = mostSpecific(ident);

        var l = {
            debug: false,
            info: false,
            warn: false,
            error: false
        };

        if (toident.level === "debug") {
            l.error = l.warn = l.info = l.debug = true;
        } else if (toident.level === "info") {
            l.error = l.warn = l.info = true;
        } else if (toident.level === "warn") {
            l.error = l.warn = true;
        } else if (toident.level === "error") {
            l.error = true;
        } else if (toident.level === "off") {
            // Nothing Enabled
        }

        return l[ident.level];
    }

    function makelog(lv){
        return function(){
            if (!arguments || arguments.length === 0) {
                setLevel(lv);
                return
            }

            var ident = extractStackTrace();
            ident.level = lv;
            logs.push({ ident: ident, arguments: arguments });

            if (isLevelActive(ident)){
                var aarr = Array.prototype.slice.call(arguments);
                var lwhere = "@ " + (ident.function ? ident.function + "() in " : "") + ident.file + ":" + ident.line;
                aarr.push(lwhere);
                c[lv].apply(console, aarr);
            }
        }
    }

    var debug = makelog("debug");
    var info = makelog("info");
    var warn = makelog("warn");
    var error = makelog("error");

    console.log = info;
    console.debug = debug;
    console.info = info;
    console.warn = warn;
    console.error = error;

    c.info ("Welcome to Journal, current log level:", level);



    function show(objnum) {
        var b = document.getElementsByTagName("body")[0];
        var style = b.currentStyle || window.getComputedStyle(b);

        if (objnum !== undefined) {
            var m2 = document.createElement("div");
            m2.style = "font-family: Verdana, Arial, Helvetica, sans-serif; position: absolute; top: -" +
                style.marginTop + "; left: -" + style.marginLeft +
                "; overflow-y:auto; background: #E0E0E0; padding: 50px; z-index: 100; width: " +
                (window.innerWidth - 100) + "px; height: " + (window.innerHeight - 100) + "px";
            m2.id = "journalobjview";
            document.getElementsByTagName("body")[0].appendChild(m2);

            m2.innerHTML = "<pre>" + JSON.stringify(objreftable[objnum], null, 2) + "</pre>";

            m2.innerHTML += "<div id='closejournalobject' style='border: 2px solid black; z-index: 101; " +
                "background: white; cursor: pointer; position: absolute; " +
                "top: 25px; right: 25px; padding: 5px'>X</div>";

            document.getElementById("closejournalobject").onclick = function () {
                document.getElementsByTagName("body")[0].removeChild(m2);
            };

            return
        }

        var modal = document.createElement("div");

        modal.style = "font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 11px; " +
            "position: absolute; top: -" + style.marginTop + "; left: -" + style.marginLeft +
            "; overflow-y:auto; background: #E0E0E0; padding: 50px; z-index: 98; width: " +
            (window.innerWidth - 100) + "px; height: " + (window.innerHeight - 100) + "px";
        modal.id = "journalview";

        document.getElementsByTagName("body")[0].appendChild(modal);

        modal.innerHTML += "<h1>Journal Logger System v" + version + "</h1>";

        modal.innerHTML += "<div>" +
            "<div style='width: 100px; display: inline-block'><strong>Level</strong></div>" +
            "<div style='width: 150px; display: inline-block'><strong>File</strong></div>" +
            "<div style='width: 200px; display: inline-block'><strong>Function</strong></div>" +
            "<div style='width: " + (window.innerWidth - 600) +
            "px; display: inline-block'><strong>Message</strong></div></div>";

        for (var idx in logs) {
            var color = logs[idx].ident.level === "error" ? "#FFE0E0" :
                (logs[idx].ident.level === "warn") ? "#FFFFE0" : "#F9F9F9";
            var msgpart = "<div style='background: " + color + "'>" +
                "<div style='width: 100px; display: inline-block'>" +
                logs[idx].ident.level.toUpperCase() + "</div>" +
                "<div style='width: 150px; display: inline-block'>" +
                logs[idx].ident.file + ":" + logs[idx].ident.line + "</div>" +
                "<div style='width: 200px; display: inline-block'>" +
                (logs[idx].ident.function ? logs[idx].ident.function : "")+ "</div>" +
                "<div style='width: " + (window.innerWidth - 600) + "px; display: inline-block'>";

            for (var adx in logs[idx].arguments) {
                if (typeof logs[idx].arguments[adx] === "object") {
                    if (adx > 0) msgpart += " ";
                    msgpart += "<div style='display: inline-block; cursor: pointer; color: blue'" +
                        "onclick='Journal.show(" + objreftable.length + ")'>[object]</div>";
                    objreftable.push(logs[idx].arguments[adx]);
                } else {
                    if (adx > 0) msgpart += " ";
                    msgpart += logs[idx].arguments[adx];
                }
            }

            msgpart += "</div></div>";

            modal.innerHTML += msgpart;
        }

        modal.innerHTML += "<div id='closejournal' style='border: 2px solid black; z-index: 99; " +
            "background: white; cursor: pointer; position: absolute; " +
            "top: 25px; right: 25px; padding: 5px'>X</div>";

        document.getElementById("closejournal").onclick = function () {
            document.getElementsByTagName("body")[0].removeChild(modal);
        };

        return "Showing Journal";
    }

    return {
        debug: debug,
        info: info,
        warn: warn,
        error: error,
        off: function() { setLevel("off") },
        log: info,
        setLevel: setLevel,
        clearLevels: clearLevels,
        show: show,
        levels: function() {
            return(loggers);
        }
    }
}();