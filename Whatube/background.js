

function getPageTitle(pageUrl, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      callback(this.responseXML.title);
    };
    xhr.open("GET", pageUrl);
    xhr.responseType = "document";
    xhr.send();
}


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        getPageTitle(request, sendResponse);
        return true;
    });