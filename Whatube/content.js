var changeText = true;
var addIcon = true;

var facebookYoutubePattern = /((https?:\/\/)?(www\.)facebook.com\/l\.php\?u=)?(https?:\/\/)?(www\.)?(youtube\.com\/watch\?.*v=|youtu\.be\/)([^%^=^&]*)&?.*/i;

var youtubePlaylistPattern = /((https?:\/\/)?(www\.)facebook.com\/l\.php\?u=)?(https?:\/\/)?(www\.)?youtube\.com\/playlist\?.*list=([^%^=^&]*)&?.*/i;


function sendMessage(type, message, callback) {
    chrome.runtime.sendMessage(
        {
            "type": type,
            "message": message
        },
        callback
    );
}

function getYoutubeVideoTitle(url, callback) {
    var match = facebookYoutubePattern.exec(unescape(url));
    if (null === match) {
        return false;
    }

    var message = match[match.length - 1];

    sendMessage("video", message, callback);

    return true;
}

function getYoutubePlaylistTitle(url, callback) {
    var match = youtubePlaylistPattern.exec(unescape(url));
    if (null === match) {
        return false;
    }
    console.log(url);
    var message = match[match.length - 1];
    console.log(message);

    sendMessage("playlist", message, callback);
}


var youtubeHintUrl = chrome.extension.getURL("images/youtube_fb.png");
var youtubeHintImg = $(document.createElement('img'))
    .attr('src', youtubeHintUrl)
    .css('margin-right', '4px')
    .css('margin-bottom', '-2px');
var youtubeHintDiv = $(document.createElement('div'))
    .css('direction', 'ltr')
    .append(youtubeHintImg);

function modifyLink(link, title) {
    if (!addIcon) {
        $(link).text(title);
    } else {
        //HACK: currently only LTR is supported, so Hebrew titles will look weird.
        $(link).empty().append(youtubeHintDiv.clone().append(title));
    }
}

function matchPattern(text, pattern) {
    var match = text.match(pattern);
    return ((match !== null) && (match[0] === text));
}

function titleSwapFactory(anchor) {
    return function (title) {
        // Set the title.
        anchor.title = title;

        if (changeText) {
            // If the link displays a youtube link, replace it with the title.
            var text = $(anchor).text();
            if (matchPattern(text, facebookYoutubePattern)) {
                // Modify for video
                modifyLink(anchor, title);
            } else if (matchPattern(text, youtubePlaylistPattern)) {
                // Modify for playlist
                //TODO: maybe add number of songs here? (.feed.entry.length)
                modifyLink(anchor, title + " (playlist)");
            }
        }
    };
}

function setYoutubeLinkTitles() {
    $("a").each(function (index, value) {
        if (this.title === "") {
            var titleFound = false;
            titleFound = getYoutubeVideoTitle(this.href, titleSwapFactory(value));
            if (!titleFound) {
                getYoutubePlaylistTitle(this.href, titleSwapFactory(value));
            }
        }
    });
}

// Automatically swap titles of any new links.
var observer = new MutationSummary({
    callback: setYoutubeLinkTitles,
    queries: [
        { attribute: 'href' }
    ]
});

// Swap all current link titles
setYoutubeLinkTitles();


// Open first article's comments

// Get all articles
var articles = $("div[role=article]");

// Swap CSS classes to show the contents
//$($(articles[0]).find("form")[0]).removeClass("collapsed_comments hidden_add_comment");

// This is the important line - it loads all comments! (clicks the "view more comments" link
$(articles[0]).find("a.UFIPagerLink")[0].click();