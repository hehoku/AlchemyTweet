if (typeof window !== "undefined") {

  console.log("Hello from background script!")

  let tabId
  let authorization
  let csrfToken

  const webRequestOptions = ["requestHeaders", "blocking"]

  if (typeof window.chrome === "undefined") {
    // For Chrome only
    webRequestOptions.push("extraHeaders")
  }

  chrome.webRequest.onBeforeSendHeaders.addListener(
    details => {
      const requestHeaders = details.requestHeaders
      // This is required for our fetch requests to succeed in Chromes
      if (!requestHeaders.find(h => h.name.toLowerCase() === "origin")) {
        requestHeaders.push({ name: "Origin", value: "https://twitter.com" })
      }
      return {
        requestHeaders,
      }
    },
    { urls: ["*://*.twitter.com/*Bookmarks*"] },
    webRequestOptions
  )

  chrome.webRequest.onSendHeaders.addListener(
    async details => {
      tabId = details.tabId
      authorization = details.requestHeaders.find(h => h.name.toLowerCase() === "authorization").value
      csrfToken = details.requestHeaders.find(h => h.name.toLowerCase() === "x-csrf-token").value
      sendCredentials()
    },
    { urls: ["*://*.twitter.com/*Bookmarks*"] },
    ["requestHeaders"]
  )

  async function sendCredentials() {
    let messageSent = false
    let tries = 0
    while (!messageSent && tries < 100) {
      try {
        tries++
        console.log("Trying message...")
        const res = await chrome.tabs.sendMessage(tabId, {
          name: "credentials",
          authorization,
          csrfToken,
        })
        messageSent = true
        console.log("Sent message")
      } catch (err) {
        console.log("error", err)
        await delay(50)
      }
    }
  }

  // end of script
}
