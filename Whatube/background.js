function getPageTitle(videoId, callback) {
    var apiUrl = "http://gdata.youtube.com/feeds/api/videos/" + videoId + "?v=2&alt=json";
    $.getJSON(apiUrl, function(data) {
        var title = data.entry.title.$t;
        callback(title);
    });
}


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        getPageTitle(request, sendResponse);
        return true;
    });