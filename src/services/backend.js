const serverURI = `https://domain.com/Thingworx/`;
// https://community.ptc.com/t5/IoT-Tech-Tips/Make-a-REST-call-from-a-website-to-Thingworx-platform/m-p/534384

const apiURI = {
  login: `${serverURI}Resources/CurrentSessionInfo/Services/GetCurrentUserGroups`,
  logout: `${serverURI}Server/*/Services/Logout`
};

export default apiURI;

//
// TODO: use axios instead of fetch API
//

export function post(url, data) {
  const requestOptions = {
    method: "POST",
    headers: Object.assign({
      Accept: "application/json",
      "Content-Type": "application/json"
    }),
    mode: "no-cors",
    cache: "no-cache"
  };

  if (url === apiURI.login) {
    requestOptions.headers["Authorization"] = "Basic " + btoa(data.username + ":" + data.password);
  } else {
    requestOptions.body = data ? JSON.stringify(data) : "{}";
  }

  return fetch(url, requestOptions).then(res =>
    res.text().then(text => {
      const data = text && JSON.parse(text);
      if (!res.ok) {
        if (res.status === 401) {
          // auto logout if 401 response returned from api
          localStorage.removeItem("user");
          location.reload(true);
        }
        const error = (data && data.message) || res.statusText;
        return Promise.reject(error);
      }
      return data;
    })
  );
}

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
