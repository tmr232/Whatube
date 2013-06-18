var changeText = true;
var addIcon = true;

var facebookYoutubePattern = /((https?:\/\/)?(www\.)facebook.com\/l\.php\?u=)?(https?:\/\/)?(www\.)?(youtube\.com\/watch\?.*v=|youtu\.be\/)([^%^=^&]*)&?.*/i;


function getYoutubeTitle(url, callback) {
    var match = facebookYoutubePattern.exec(unescape(url));
    if (null === match) {
        return false;
    }

    var message = match[match.length - 1];

    chrome.runtime.sendMessage(message, callback);
}


var youtubeHintUrl = chrome.extension.getURL("images/youtube_fb.png");
var youtubeHintImg = $(document.createElement('img'))
    .attr('src', youtubeHintUrl)
    .css('margin-right', '4px')
    .css('margin-bottom', '-2px');

function modifyLink(link, title) {
    if (!addIcon) {
        $(link).text(title);
    } else {
        if ($(link).css('direction') === 'rtl') {
            $(link).empty().append(title).append(youtubeHintImg.clone());
        } else {
            $(link).empty().append(youtubeHintImg.clone()).append(title);
        }
    }
}

function setYoutubeLinkTitles() {
    $("a").each(function (index, value) {
        if (this.title === "") {
            getYoutubeTitle(this.href, function (title) {
                // Set the title.
                value.title = title;

                if (changeText) {
                    // If the link displays a youtube link, replace it with the title.
                    var text = $(value).text();
                    var match = text.match(facebookYoutubePattern);
                    if ((match !== null) && (match[0] === text)) {
                        modifyLink(value, title);
                    }
                }
            });
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