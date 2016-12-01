// ==UserScript==
// @name        FM Post Numberer
// @namespace   http://blankmediagames.com
// @author      deferentsheep
// @description Numbers posts and adds ISO
// @include     http://blankmediagames.com/phpbb/*
// @include     http://www.blankmediagames.com/phpbb/*
// @include     https://blankmediagames.com/phpbb/*
// @include     https://www.blankmediagames.com/phpbb/*
// @grantnone
// @version     1.0.7
// ==/UserScript==
// --------------------
// Configurable parameters, you may change values here
// If true, runs the script in every subforum, otherwise only in those specified by desiredForums.
var allForums = true;

// List of forums to run the script on if allForums is false. Works with subforums as well (e.g. "Forum Mafia" will enable the script in "Signups", "Game Threads", etc.).
var desiredForums = ["Game Threads", "FM Discussion"];

// --------------------

function actualThing() {

    var willRun = false;
    $(".icon-home > a").each(function(index, value) {
        var label = $(this).html();
        var i;
        for (i = 0; !willRun && i < desiredForums.length; i++) {
            if (label == desiredForums[i]) {
                willRun = true;
            }
        }
    });

    if (!allForums && !willRun) {
        return;
    }

    var threadURL = $("h2").first().children("a").first().attr("href");
    var threadNumber = "";
    var i = threadURL.search("&t=") + 3;
    while (!isNaN(threadURL[i])) {
        threadNumber += threadURL[i++];
    }

    var pageNumber = $(".pagination").find("strong").first().html();

    $(".post").each(function(index, value) {
        if ($(this).children(".inner").first().children(".postprofile").length === 0) {
            return;
        }

        var postID = $(this).attr("id").substring(1);
        var postNumber = (pageNumber - 1) * 25 + index + 1;
        var authorLine = $(this).find(".author");
        var authorName = authorLine.find("strong").first().children("a").html();
        var authorString = authorLine.html();

        var insertIndex = authorString.search("</a>by") + 4;
        authorString = authorString.substring(0, insertIndex) + " Post <a href=\"./viewtopic.php?p=" + postID + "#p" + postID + "\"><strong>#" + postNumber + "</strong></a> " + authorString.substring(insertIndex, authorString.length);
        insertIndex = authorString.search(" ");
        authorString = authorString.substring(0, insertIndex) + " (<a href=\"./search.php?t=" + threadNumber + "&author=" + authorName + "\">ISO</a>)" + authorString.substring(insertIndex, authorString.length);
        authorLine.html(authorString);
    });
}

function loadScript(src, callback) {
    var s, r, t;
    r = false;
    s = document.createElement("script");
    s.type = "text/javascript";
    s.src = src;
    s.onload = s.onreadystatechange = function() {
        if (!r && (!this.readyState || this.readyState == "complete")) {
            r = true;
            callback();
        }
    };
    t = document.getElementsByTagName("script")[0];
    t.parentNode.insertBefore(s, t);
}

loadScript("//ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js", actualThing);

