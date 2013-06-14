

var facebookYoutubePattern = /((https?:\/\/)?(www\.)facebook.com\/l\.php\?u=)?(https?:\/\/)?(www\.)?youtube\.com\/watch\?(.*)/i;
var youtubeLinkPattern = /(https?:\/\/)?(www\.)?youtube\.com\/watch\?.*/i;

function getYoutubeTitle(url, callback) {
    var match = facebookYoutubePattern.exec(unescape(url));
    if (null === match) {
        return false;
    }

    var message = match[match.length - 1];

    chrome.runtime.sendMessage(message, callback);
}

function setYoutubeLinkTitles() {
    $("a").each(function (index, value) {
        if (this.title === "") {
            getYoutubeTitle(this.href, function (title) {
                value.title = title;
            });
        }
    });
}


setYoutubeLinkTitles();
//window.setInterval(setYoutubeLinkTitles, 1000);

//$("a").each(function(index, value) {
//    getYoutubeTitle(this.href, function(title) {
//        value.title = title;
//        console.log(title);
////        console.log(value);
//    });
//});

var observer = new MutationSummary({
  callback: setYoutubeLinkTitles,
  queries: [{ attribute: 'href' }]
});

function handleChanges(summaries) {
    $("a").each(function (index, value) {
        getYoutubeTitle(this.href, function (title) {
            value.title = title;
            console.log(title);
            console.log(value);
        })
    });
}


function setLinkTitles() {

    // Get all links in the page
    var links = document.querySelectorAll("a");

    // Take only youtube links
    var youtubeLinks = [];
    for (var i = 0; i < links.length; ++i) {
        var link = links[i];
//        if (null !== youtubeLinkPattern.exec(link.href)) {
//        console.log(facebookYoutubePattern.exec(unescape(link.href)));
        if (null !== facebookYoutubePattern.exec(unescape(link.href))) {
//            console.log("yay");
            youtubeLinks.push(link);
        }
    }

    // Get titles and add as titles for the links
    for (var i = 0; i < youtubeLinks.length; ++i) {
        var link = youtubeLinks[i];
        var match = facebookYoutubePattern.exec(unescape(link.href));
        if (null === match) {return};
        var message = match[match.length - 1];
        console.log(message);
        chrome.runtime.sendMessage(message, function(response) {
            console.log(response);
            link.title = response;
            link.innerHTML = response;
        });
    }
}


//setLinkTitles();
//
//var observer = new MutationSummary({
//  callback: handleChanges,
//  queries: [{ attribute: 'href' }]
//});
//
//function handleChanges(summaries) {
//    setLinkTitles();
//    console.log("yay");
//}