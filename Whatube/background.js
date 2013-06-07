

function getPageTitle(pageUrl, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        console.log(this.responseXML.title);
      callback(this.responseXML.title);
    };
    xhr.open("GET", pageUrl);
    xhr.responseType = "document";
    xhr.send();
}


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request);
        // Here we use the pageUrl directly. We allow that because our permissions only allow youtube.com/watch pages.
        //TODO: add filterring. I don't like this loophole.
        var url = "https://www.youtube.com/watch?" + request;
        getPageTitle(url, sendResponse);
        return true;
    });