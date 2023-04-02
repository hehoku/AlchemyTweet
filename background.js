chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    if (details.url.includes("Bookmarks")) {
      const url = encodeURIComponent(details.url);
      const authorizationHeader = details.requestHeaders.find(
        (header) => header.name.toLowerCase() === "authorization"
      );
      const csrfTokenHeader = details.requestHeaders.find(
        (header) => header.name.toLowerCase() === "x-csrf-token"
      );

      if (authorizationHeader && csrfTokenHeader) {
        const authorization = encodeURIComponent(authorizationHeader.value);
        const csrfToken = encodeURIComponent(csrfTokenHeader.value);
        const newUrl = `https://twitter.com/i/bookmarks?url=${url}&authorization=${authorization}&csrfToken=${csrfToken}`;

        chrome.tabs.update(details.tabId, { url: newUrl });
      }
    }
  },
  { urls: ["*://*.twitter.com/*"] },
  ["requestHeaders", "blocking"]
);
