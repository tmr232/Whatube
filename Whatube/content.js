var changeText = true;


var facebookYoutubePattern = /((https?:\/\/)?(www\.)facebook.com\/l\.php\?u=)?(https?:\/\/)?(www\.)?(youtube\.com\/watch\?.*v=|youtu\.be\/)([^%^=^&]*)&?.*/i;


var youtubeHintUrl = chrome.extension.getURL("images/youtube.png");

function getYoutubeTitle(url, callback) {
    var match = facebookYoutubePattern.exec(unescape(url));
    if (null === match) {
        return false;
    }

    var message = match[match.length - 1];

    chrome.runtime.sendMessage(message, callback);
}


var youtubeHintImg = $(document.createElement('img'))
    .attr('src', youtubeHintUrl)
    .css('margin-right', '4px');

function makeTitle(titleText) {
    return $(document.createElement('span')).text(titleText);
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
                        console.log($(value).css('direction'));
                        if ($(value).css('direction') === 'rtl') {
                            console.log("A");
                            $(value).empty().append(title).append(youtubeHintImg.clone());
                        } else {
                            console.log("B");
                            $(value).empty().append(youtubeHintImg.clone()).append(title);
                        }
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