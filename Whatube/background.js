function getVideoTitle(videoId, callback) {
    var apiUrl = "http://gdata.youtube.com/feeds/api/videos/" + videoId + "?v=2&alt=json";
    $.getJSON(apiUrl, function(data) {
        var title = data.entry.title.$t;
        callback(title);
    });
}

function getPlaylistTitle(playlistId, callback) {
    var apiUrl = "http://gdata.youtube.com/feeds/api/playlists/" + playlistId + "?v=2&alt=json";
    $.getJSON(apiUrl, function(data) {
        var title = data.feed.title.$t;
        callback(title);
    })
}


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch(request.type) {
            case "video":
                getVideoTitle(request.message, sendResponse);
                break;
            case "playlist":
                getPlaylistTitle(request.message, sendResponse);
                break;
        }
        return true;
    });