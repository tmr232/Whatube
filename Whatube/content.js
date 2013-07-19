var changeText = true;
var addIcon = true;

var facebookYoutubePattern = /((https?:\/\/)?(www\.)facebook.com\/l\.php\?u=)?(https?:\/\/)?(m\.|www\.)?(youtube\.com\/watch\?.*v=|youtu\.be\/)([^%^=^&]*)&?.*/i;

var youtubePlaylistPattern = /((https?:\/\/)?(www\.)facebook.com\/l\.php\?u=)?(https?:\/\/)?(m\.|www\.)?youtube\.com\/playlist\?.*list=([^%^=^&]*)&?.*/i;

/**
 * Sends a request message to the background page.
 * @param type message type - 'video' or 'playlist'
 * @param message the message to send - the ID
 * @param callback to be called with the new title
 */
function sendMessage(type, message, callback) {
    chrome.runtime.sendMessage(
        {
            "type": type,
            "message": message
        },
        callback
    );
}

/**
 * Get the title of a Youtube video from the URL
 * @param url the video URL
 * @param callback to be called with the resulting title
 * @returns {boolean} true if the url is a valid video url
 */
function getYoutubeVideoTitle(url, callback) {
    var match = facebookYoutubePattern.exec(unescape(url));
    if (null === match) {
        return false;
    }

    var message = match[match.length - 1];

    sendMessage("video", message, callback);

    return true;
}


/**
 * Get the title of a Youtube playlist from the URL
 * @param url the playlist URL
 * @param callback to be called with the resulting title
 * @returns {boolean} true if the url is a valid playlist url
 */
function getYoutubePlaylistTitle(url, callback) {
    var match = youtubePlaylistPattern.exec(unescape(url));
    if (null === match) {
        return false;
    }

    var message = match[match.length - 1];

    sendMessage("playlist", message, callback);

    return true;
}


var youtubeHintUrl = chrome.extension.getURL("images/youtube_fb.png");
var youtubeHintImg = $(document.createElement('img'))
    .attr('src', youtubeHintUrl)
    .css('margin-right', '4px')
    .css('margin-bottom', '-2px');
var youtubeHintDivLtr = $(document.createElement('div'))
    .css('direction', 'ltr')
    .append(youtubeHintImg.clone());

var youtubeHintDivRtl = $(document.createElement('div'))
    .css('direction', 'rtl')
    .append(youtubeHintImg.clone());


var hebrewRegex = /[\u0590-\u05FF]/;
function containsHebrew(text) {
    return hebrewRegex.test(text);
}

//TODO: swap image alignment based on page direction (other side for Hebrew page).

/**
 * Gets a link (<a> element) and modifies its contents
 * @param link the link to modify
 * @param title the new title to set
 */
function modifyLink(link, title) {
    if (!addIcon) {
        $(link).text(title);
    } else {
        if (containsHebrew(title)) {
            $(link).empty().append(youtubeHintDivRtl.clone().prepend(title));
        } else {
            $(link).empty().append(youtubeHintDivLtr.clone().append(title));
        }
    }
}

/**
 * Checks if a regex pattern matches an entire string
 * @param text the string to match
 * @param pattern the regex pattern to check
 * @returns {boolean} true if it matches
 */
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