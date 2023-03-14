window.onload = () => {
    console.log("hello");
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.bookmarkUrl) {
        console.log({ bookmarkUrl: request.bookmarkUrl });
        sendResponse({ fromContentScript: "content script got url" });
    }
    console.log(request);
});
