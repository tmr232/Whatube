function getPageTitle(videoId, callback) {
    var apiUrl = "http://gdata.youtube.com/feeds/api/videos/" + videoId + "?v=2&alt=json";
    $.getJSON(apiUrl, function (data) {
        var title = data.entry.title.$t;
        callback(title);
    });
}

function getVimeoPageTitle(videoId, callback) {
    var apiUrl = "http://vimeo.com/api/v2/video/" + videoId + ".json";
    $.getJSON(apiUrl, function (data) {
        var title = data[0].title;
        callback(title);
    });
}


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        getPageTitle(request, sendResponse);
        return true;
    });