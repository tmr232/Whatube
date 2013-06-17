//function getPageTitle(pageUrl, callback) {
//    var xhr = new XMLHttpRequest();
//    xhr.onload = function () {
//        console.log(this.responseXML.title);
//        callback(this.responseXML.title);
//    };
//    xhr.open("GET", pageUrl);
//    xhr.responseType = "document";
//    xhr.send();
//}

function getPageTitle(videoId, callback) {
    var apiUrl = "http://gdata.youtube.com/feeds/api/videos/" + videoId + "?v=2&alt=json";
    $.getJSON(apiUrl, function(data) {
        var title = data.entry.title.$t;
        callback(title);
    });
}


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(request);
//        var url = "https://www.youtube.com/watch?v=" + request;
//        getPageTitle(url, sendResponse);
        getPageTitle(request, sendResponse);
        return true;
    });