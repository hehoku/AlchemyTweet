import browser from "webextension-polyfill";

// Listen for messages sent from other parts of the extension
browser.runtime.onMessage.addListener((request: { popupMounted: boolean }) => {
    // Log statement if request.popupMounted is true
    // NOTE: this request is sent in `popup/component.tsx`
    if (request.popupMounted) {
        console.log("backgroundPage notified that Popup.tsx has mounted.");
    }
});

chrome.webRequest.onCompleted.addListener(
    function (details) {
        if (details.method == "GET" && details.url.includes("Bookmarks")) {
            console.log(details.url);
            chrome.tabs.query(
                { active: true, currentWindow: true },
                function (tabs: any) {
                    return chrome.tabs.sendMessage(tabs[0].id, {
                        bookmarkUrl: details.url,
                    });
                },
            );
        }
    },
    { urls: ["<all_urls>"] },
);
