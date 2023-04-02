const waitForElement = async (selector, maxAttempts = 10, interval = 300) => {
  let attempts = 0;
  while (attempts < maxAttempts) {
    const element = document.querySelector(selector);
    if (element) {
      return element;
    }
    attempts++;
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
  return null;
};

const fetchBookmarks = async (authorization, csrfToken) => {
  if (!authorization) {
    return console.log("authorization is blank");
  }
  if (!csrfToken) {
    return console.log("csrfToken is blank");
  }

  const res = await fetch(
    "https://api.twitter.com/2/timeline/bookmark.json?include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&skip_status=1&cards_platform=Web-12&include_cards=1&include_composer_source=true&include_ext_alt_text=true&include_reply_count=1&tweet_mode=extended&include_entities=true&include_user_entities=true&include_ext_media_color=true&include_ext_media_availability=true&send_error_codes=true&simple_quoted_tweets=true&count=10000&ext=mediaStats%2CcameraMoment",
    {
      credentials: "include",
      headers: {
        accept: "*/*",
        "x-twitter-active-user": "yes",
        "x-twitter-auth-type": "OAuth2Session",
        "x-csrf-token": csrfToken,
        authorization,
      },
      referrer: window.location.href,
      method: "GET",
    }
  );
  const json = await res.json();
  return json;
};

(async () => {
  const urlMatch = location.href.match(/url=(.*)/);
  const authorizationMatch = location.href.match(/authorization=(.*)/);
  const csrfTokenMatch = location.href.match(/csrfToken=(.*)/);

  if (urlMatch && authorizationMatch && csrfTokenMatch) {
    const url = decodeURIComponent(urlMatch[1]);
    const authorization = decodeURIComponent(authorizationMatch[1]);
    const csrfToken = decodeURIComponent(csrfTokenMatch[1]);

    if (url.includes("bookmarks")) {
      const json = await fetchBookmarks(authorization, csrfToken);
      console.log(json);
    }
  } else {
    console.log('no matches')
  }
})();
