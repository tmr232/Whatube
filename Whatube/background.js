function getPageTitle(pageUrl, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        console.log(this.responseXML.title);
        callback(this.responseXML.title);
    };
    xhr.open("GET", pageUrl);
    xhr.responseType = "document";
    xhr.send();
}


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(request);
        var url = "https://www.youtube.com/watch?v=" + request;
        getPageTitle(url, sendResponse);
        return true;
    });