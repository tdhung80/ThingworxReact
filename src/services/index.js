export * from "./fake-backend";
export * from "./user.service";
export * from "./thingworx";

const serverURI = `https://dev-etools.ptc.com/Thingworx/`;
// https://community.ptc.com/t5/IoT-Tech-Tips/Make-a-REST-call-from-a-website-to-Thingworx-platform/m-p/534384

export const serviceUrls = {
  login: `${serverURI}Resources/CurrentSessionInfo/Services/GetCurrentUserGroups`,
  logout: `${serverURI}Server/*/Services/Logout`
};

export const fakeAPI = (result, error = false, timeout = 1000) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (error) reject(result);
      else resolve(result);
    }, timeout);
  });
};

// async function fetchMyAPI() {
//     await fakeAPI(3000);
//     ...
// }

/*
 * FetchAPI { cache: default, no-stare, reload, no-cache, force-cache }
 *

const cachedFetch = (url, options) => {
  // Use the URL as the cache key to sessionStorage
  let cacheKey = url

  // START new cache HIT code
  let cached = sessionStorage.getItem(cacheKey)
  if (cached !== null) {
    // it was in sessionStorage! Yay!
    let response = new Response(new Blob([cached]))
    return Promise.resolve(response)
  }
  // END new cache HIT code

  return fetch(url, options).then(response => {
    // let's only store in cache if the content-type is
    // JSON or something non-binary
    if (response.status === 200) {
      let ct = response.headers.get('Content-Type')
      if (ct && (ct.match(/application\/json/i) || ct.match(/text\//i))) {
        // There is a .json() instead of .text() but
        // we're going to store it in sessionStorage as
        // string anyway.
        // If we don't clone the response, it will be
        // consumed by the time it's returned. This
        // way we're being un-intrusive.
        response.clone().text().then(content => {
          sessionStorage.setItem(cacheKey, content)
        })
      }
    }
    return response
  })
}
*/
