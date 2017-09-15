
var library;

var onYouTubePlayerAPIReady;

$(document).ready(function () {
    var $menu = $(".menu");
    var $window = $(window);
    var played = {};
    var playorder = [];
    var loopidx = -1;

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

    function sortLibrary() {
        library.sort(function (a, b) {
            var c = (a.artist.compare(b.artist));
            if (c == 0) {
                return a.song.compare(b.song);
            } else {
                return c;
            }
        })
    }

    var videoup = selectsong();

    var player;

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

    // autoplay video
    function onPlayerReady(event) {
        event.target.playVideo();
    }

    // when video ends
    function onPlayerStateChange(event) {
        if(event.data === 0) {
            videoup = selectsong();
            console.log("Video Ended");
            player.cueVideoById(videoup.url);
            player.playVideo();
            console.log("Set Next Video");
            $("#playing .artist").html(videoup.artist);
            $("#playing .song").html(videoup.song);
        }
    }

    function menusize() {
        $menu.heightPercent(.8);
        $menu.widthPercent(.8);
    }

    $window.resize(menusize);
    menusize();

    $(".menuicon").click(function () {
        $menu.show();
        $menu.centerize();
        lightbox.parent($menu);
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
        $(".addvideo").hide();
        lightbox.parent($menu);
        $menu.hide();

        $("#url").val("");
        $("#artist").val("");
        $("#song").val("");
    })
});