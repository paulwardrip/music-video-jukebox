
var library;

var onYouTubePlayerAPIReady;

$(document).ready(function () {
    var $menu = $(".menu");
    var $listing = $(".listing");
    var $artists = $(".artists");
    var $window = $(window);
    var played = {};
    var playorder = [];
    var loopidx = -1;
    var queue = [];

    var lightbox = AutoLightBox($menu);

    function loadLibrary() {
        library = JSON.parse(localStorage.getItem("music-video-jukebox-library"));
        if (!library) library = [];
        saveLibrary();
    }

    function saveLibrary() {
        localStorage.setItem("music-video-jukebox-library", JSON.stringify(library));
    }

    loadLibrary();

    function selectsong() {
        if (queue.length > 0) {
            var s = queue.splice(0,1);
            return s;

        } else {
            if (playorder.length == library.length) {
                loopidx++;
                if (loopidx == library.length) loopidx = 0;
                return playorder[loopidx];
            } else {
                var song = Math.round(Math.random() * (library.length - 1));

                console.log(played[library[song].url]);
                if (!played[library[song].url]) {
                    played[library[song].url] = true;
                    playorder.push(library[song]);
                    return library[song];
                } else {
                    return selectsong();
                }
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

    var player;

    function c(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        return false;
    }

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
                console.log("Imported", library.length);
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
                onStateChange: onPlayerStateChange
            }
        });
    };

    function nextup() {
        videoup = selectsong();
        player.cueVideoById(videoup.url);
        player.playVideo();
        $("#playing .artist").html(videoup.artist);
        $("#playing .song").html(videoup.song);
    }

    // autoplay video
    function onPlayerReady(event) {
        event.target.playVideo();
    }

    // when video ends
    function onPlayerStateChange(event) {
        if(event.data === 0) {
            nextup();
        }
    }

    function menusize() {
        $menu.heightPercent(.8);
        $menu.widthPercent(.8);
        $artists.widthPercent(.49);
        $artists.takeupHeight();
        $listing.widthPercent(.49);
        $listing.heightPercent(1);
    }

    $window.resize(menusize);
    menusize();
    list();

    function list() {
        $listing.html("");
        for (var idx in library) {
            var s = library[idx];

            var $elem = $($("#sogentry-template").html());
            $elem.find(".artist").html(s.artist);
            $elem.find(".song").html(s.song);
            $elem.data("entry", s);

            $elem.click(function (e) {
                queue.push($(e.target).data("entry"));
            });

            $listing.append($elem);
        }
    }

    $(".menu .fa-window-close-o").click(function () {
        $menu.hide();
    });

    $(".addvideo .fa-window-close-o").click(function () {
        $(".addvideo").hide();
    });

    $(".menuicon").click(function () {
        $menu.show();
        $menu.centerize();
        lightbox.parent($menu);
    });

    $(".skipicon").click(function () {
        nextup();
    });

    $(".addyoutube").click(function () {
        $(".addvideo").show();
        $(".addvideo").centerize();
        lightbox.parent($(".addvideo"));
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
        lightbox.parent($menu);
        $menu.hide();

        $("#url").val("");
        $("#artist").val("");
        $("#song").val("");
    });

    $(".export-link").click(function () {
        var json = JSON.stringify(library, null, 2);
        c
        $(".export-link").attr("href", "data:image/png;base64," + btoa(json));
        $(".export-link").attr("download", "library.json");
    });
});