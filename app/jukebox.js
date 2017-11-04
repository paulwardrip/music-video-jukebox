
var library;

var onYouTubePlayerAPIReady;

$(document).ready(function () {
    var $menu = $(".menu");
    var $listing = $(".listing");
    var $queuelist = $(".queuelist");
    var $window = $(window);
    var played = {};
    var playorder = [];
    var loopidx = -1;
    var queue = [];
    var playmode = "queue";
    var jumpto;
    var spaceout = $(".heads").height() + $(".functi").height();
    var itry;
    var itrysomuch = 0;

    $menu.autolightbox();

    $menu.prepend($(".heads").detach());
    $menu.prepend($(".functi").detach());

    function loadLibrary() {
        library = JSON.parse(localStorage.getItem("music-video-jukebox-library"));
        if (!library) library = [];
        saveLibrary();
    }

    function saveLibrary() {
        localStorage.setItem("music-video-jukebox-library", JSON.stringify(library));
    }

    loadLibrary();

    function selectsong(forcerandom) {
        function randomtime() {
            console.info("Next song will be random.");
            var song = Math.round(Math.random() * (library.length - 1));
            console.debug(song, "of", library.length);

            if (!played[library[song].url]) {
                played[library[song].url] = true;
                playorder.push(library[song]);
                return library[song];
            } else {
                return selectsong();
            }
        }

        if (forcerandom) {
            return randomtime();
        }

        if (jumpto) {
            console.info("Next song will be user-selected.");
            var nu = jumpto;
            jumpto = null;
            return nu;
        }

        if (queue.length > 0) {
            console.info("Next song will be the next item in the queue.");
            var s = queue.splice(0,1);
            listQueue();
            return s[0];

        } else {
            if (playorder.length == library.length) {
                console.info("Next song will be repeating the order the complete catalog was played in.");
                loopidx++;
                if (loopidx == library.length) loopidx = 0;
                return playorder[loopidx];

            } else {
                return randomtime();

            }
        }
    }

    function sortLibrary() {
        library.sort(function (a, b) {
            var c = a.artist< b.artist ? -1 : 1;
            if (c == 0) {
                return a.song < b.song ? -1 : 1;
            } else {
                return c;
            }
        })
    }

    var videoup = selectsong();
    queue.push(selectsong());
    var player;

    function c(e) {
        if (e.type === "dragenter") {
            $(e.target).css("background-color", "deepskyblue");
        }
        if (e.preventDefault) {
            e.preventDefault();
        }
        return false;
    }

    $(".play-mode").click(function () {
        if (playmode === "queue") {
            playmode = "now";
            $(".play-mode .queue").hide();
            $(".play-mode .now").show();
        } else {
            playmode = "queue";
            $(".play-mode .queue").show();
            $(".play-mode .now").hide();
        }
    });

    $(".drop-library").on("dragover", c);
    $(".drop-library").on("dragenter", c);

    $(".drop-library").on("drop", function (e) {
        e = e || window.event;
        if (e.preventDefault) {
            e.preventDefault();
        }

        console.log ("drop");

        var dt = e.originalEvent.dataTransfer;

        var files = dt.files;
        if (files.length == 1) {

            var file = files[0];
            console.log ("read");
            var reader = new FileReader();

            reader.addEventListener("loadend", function (event) {
                library = JSON.parse(event.target.result);
                $(".import .status").html("Imported " + library.length + " videos.");
                $(".import").css("background-color", "darkseagreen");
                setTimeout(function () {
                    $(".import").fadeOut(2000, function () {
                        $menu.autolightbox();
                    });
                },2000);
                console.log("Imported", library.length);
                saveLibrary();
            });

            reader.readAsText(file);
        }
    });

    onYouTubePlayerAPIReady = function () {
        console.log("Youtube Player Ready");

        console.log("video", videoup);
        $("#playing .artist").html(videoup.artist);
        $("#playing .song").html(videoup.song);

        player = new YT.Player('player', {
            width: $window.width(),
            height: $window.height() - 5,
            videoId: videoup.url,
            playerVars: {
                autoplay: 1,
                iv_load_policy: 3,
                controls: 0,
                showinfo: 0,
                rel: 0
            },
            events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange,

                onError: function (e) {
                    console.error("Youtube Error!");
                    console.error(e);

                    itrysomuch++;
                    if (itrysomuch > 3) {
                        nextup();
                    } else {
                        console.debug(itrysomuch, itry);
                        player.loadVideoById(itry);
                        player.playVideo();
                    }
                }
            }
        });
    };

    function nextup() {
        itry = videoup.url;
        itrysomuch = 0;
        videoup = selectsong();
        console.info(videoup);
        player.loadVideoById(videoup.url);
        console.info(videoup.url);
        player.playVideo();
        $("#playing .artist").html(videoup.artist);
        $("#playing .song").html(videoup.song);

        if (queue.length === 0) queue.push(selectsong());
        listQueue();
    }

    // autoplay video
    function onPlayerReady(event) {
        event.target.playVideo();
    }

    // when video ends
    function onPlayerStateChange(event) {
        console.debug(event);
        console.debug(YT.PlayerState);
        if(event.data === 0) {
            nextup();
        }
    }

    function menusize() {
        $menu.heightPercent(.8);
        $menu.widthPercent(.8);
        $queuelist.widthPercent(.48);
        $listing.widthPercent(.48);

        $(".heads h3").css({
            display: "inline-block",
            width: $queuelist.width() + "px",
            "padding-left": "7px"
        });

        var lhi = $menu.height() - spaceout - 25;

        $listing.css("height", lhi + "px");
        $queuelist.css("height", lhi + "px");

        $(".play-mode").css({
            position: "absolute",
            left: $queuelist.width() + 35 + "px",
            top: "55px"
        });
    }

    $window.resize(function(){
        menusize();
        player.setSize($window.width(), $window.height());
    });

    menusize();
    list();

    function list() {
        $listing.html("");
        for (var idx in library) {
            var s = library[idx];

            var $elem = $($("#sogentry-template").html());

            function setup(songentry) {
                $elem.find(".artist").html(songentry.artist);
                $elem.find(".song").html(songentry.song);

                $elem.click(function (e) {
                    if (playmode === "queue") {
                        queue.push(songentry);
                        console.log(songentry);
                        listQueue();
                    } else {
                        jumpto = songentry;
                        console.log(jumpto);
                        nextup();
                        $menu.hide();
                    }
                });

                $listing.append($elem);
            }

            setup(s);
        }
    }

    function listQueue() {
        $queuelist.html("");
        for (var idx in queue) {
            var s = queue[idx];

            var $elem = $($("#sogentry-template").html());

            function setup(songentry, idxxx) {
                $elem.find(".artist").html(songentry.artist);
                $elem.find(".song").html(songentry.song);
                $elem.css("position", "relative");

                var $trashy = $('<i class="fa fa-trash-o" aria-hidden="true" style="position: absolute; right: 10px; bottom: 10px"></i>');
                var $bumpy = $('<i class="fa fa-hand-o-up" aria-hidden="true" style="position: absolute; right: 10px; top: 10px"></i>');

                $elem.append($trashy);
                $trashy.click(function () {
                    queue.splice(idxxx, 1);
                    listQueue();
                });

                if (idxxx > 0) {
                    $elem.append($bumpy);
                    $bumpy.click(function () {
                        var y = idxxx - 1;
                        queue[idxxx] = queue.splice(y, 1, queue[idxxx])[0];
                        listQueue();
                    });
                }

                $queuelist.append($elem);
            }

            setup(s, idx);
        }
    }

    $(".addrandom").click(function () {
        console.info("Random Requested");
        queue.push(selectsong(true));
        listQueue();
    });

    $(".menu .fa-window-close-o").click(function () {
        $menu.hide();
    });

    $(".addvideo .fa-window-close-o").click(function () {
        $(".addvideo").hide();
    });

    $(".menuicon").click(function () {
        $menu.show();
        $menu.centerize();
        $menu.autolightbox();
        listQueue();
    });

    $(".skipicon").click(function () {
        nextup();
    });

    $(".addyoutube").click(function () {
        $(".addvideo").show();
        $(".addvideo").centerize();
        $(".addvideo").autolightbox();
    });

    $("#addbtn").click(function () {
        var vid = {
            url: $("#url").val(),
            artist: $("#artist").val(),
            song: $("#song").val()
        };

        library.push(vid);
        sortLibrary();
        saveLibrary();
        list();
        $(".addvideo").hide();
        $menu.autolightbox();
        $menu.hide();

        $("#url").val("");
        $("#artist").val("");
        $("#song").val("");
    });

    $(".import-link").click(function () {
        $(".import").autolightbox();
        $(".import").show();
        $(".import").centerize();
    });

    $(".export-link").click(function () {
        var json = JSON.stringify(library, null, 2);
        console.log (json);
        $(".export-link").attr("href", "data:image/png;base64," + btoa(unescape(encodeURIComponent(json))));
        $(".export-link").attr("download", "library.json");
    });
});