/**
 * Get video title using Youtube API
 * @param videoId the id of the video (youtube.com/watch?v=videoId)
 * @param callback to be called with the resulting title
 */
function getVideoTitle(videoId, callback) {
    var apiUrl = "http://gdata.youtube.com/feeds/api/videos/" + videoId + "?v=2&alt=json";
    $.getJSON(apiUrl, function (data) {
        var title = data.entry.title.$t;
        callback(title);
    });
}

/**
 * Get playlist title using Youtube API
 * @param playlistId the id of the video (youtube.com/playlist?list=playlistId)
 * @param callback to be called with the resulting title
 */
function getPlaylistTitle(playlistId, callback) {
    var apiUrl = "http://gdata.youtube.com/feeds/api/playlists/" + playlistId + "?v=2&alt=json";
    $.getJSON(apiUrl, function (data) {
        var title = data.feed.title.$t;
        callback(title);
    })
}


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.type) {
            case "video":
                getVideoTitle(request.message, sendResponse);
                break;
            case "playlist":
                getPlaylistTitle(request.message, sendResponse);
                break;
        }
        return true;
    });