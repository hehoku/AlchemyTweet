console.log("Hello from nextjs content script!")

let authorization
let csrfToken

async function messageListener(message) {
  // console.log("Received message", message)
  if (message.name === "credentials") {
    authorization = message.authorization
    csrfToken = message.csrfToken
    console.log("Received credentials", authorization, csrfToken)
  }
}

chrome.runtime.onMessage.addListener(messageListener)
