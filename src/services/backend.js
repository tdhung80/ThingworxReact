import TWServerURI from "./backend.settings";
import * as userService from "./user.service";

const apiURI = {
  getCurrentUser: `Resources/CurrentSessionInfo/Services/GetCurrentUser`,
  login: `Resources/CurrentSessionInfo/Services/GetCurrentUserGroups`,
  logout: `Server/*/Services/Logout`

  // GET: /Properties, /PropertyDefinitions, /ServiceDefinitions, /EventDefinitions
};

export default apiURI;
export * from "./backend.settings";

//
// TODO: use axios "cross browser" instead of fetch API
//
let isLoginProcessing = false; // NTLM login

export async function post(url, data) {
  await send(url, data);
}

export async function send(url, data) {
  const requestOptions = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8"
      // 'X-Requested-With': 'XMLHttpRequest'
    },
    //mode: "no-cors", // MUST run in cors mode
    cache: "no-cache"
  };

  // URL decorator
  if (url === apiURI.login && data && data.username) {
    url = `Users/${data.username}/Properties`;
    requestOptions.headers["Authorization"] = "Basic " + btoa(data.username + ":" + data.password);
  }

  // TW REST API rules
  const method = (requestOptions.method = /\/[Ss]ervices\//.test(url) ? "POST" : "GET");
  if (method === "POST") {
    requestOptions.body = data ? (data instanceof Object ? JSON.stringify(data) : data) : "{}";
  } else if (method === "GET" && data) {
    requestOptions.body = null;
    const keys = Object.keys(data);
    if (keys.length > 0) {
      url +=
        (url.lastIndexOf("?") === -1 ? "?" : "&") +
        keys.map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key])).join("&");
    }
  }

  if (!/^http(s?):\/\//i.test(url)) {
    url = TWServerURI + url;
  }

  console.debug(`${method} ${url}`);

  const res = await fetch(url, requestOptions);
  const text = await res.text();
  //const res = await makeRequest(url, requestOptions);
  //const text = res.text();

  // text should be formated like a INFOTABLE { dataShape: {}, rows: [] }
  // or Entity Not Found : [{EntityName}}]
  // or Not authorized for ServiceInvoke on GetServiceDefinition in {CollectionName}
  data = text && (/^{.*}$/.test(text) ? JSON.parse(text) : text);
  if (!res.ok) {
    throw (data && data.message) || res.statusText;
  }

  if (!isLoginProcessing) {
    await handleNTLM();
  }

  return data;
}

async function handleNTLM() {
  // the current session is already authenticaetd by NTLM login browser dialog
  if (!userService.isAuthenticated() || userService.isAnonymous()) {
    console.debug("NTLM: get login information");
    try {
      isLoginProcessing = true;
      let res = await send(apiURI.getCurrentUser);
      console.debug(res);
      let username = res.rows[0].result;
      res = await send(`Users/${username}/Properties`);
      console.debug(res);
      let user = res.rows[0];
      userService.setUser({ ...user, username });
    } finally {
      isLoginProcessing = false;
    }
  }
}

function makeRequest(url, requestOptions) {
  // Native Fetch failed with CORS mode while XMLHttpRequest is working correctly
  return new Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open(requestOptions.method, url);
    xhr.withCredentials = true;

    const headers = requestOptions.headers;
    if (headers) Object.keys(headers).forEach(header => xhr.setRequestHeader(header, headers[header]));
    if (requestOptions.cache) xhr.setRequestHeader("Cache-Control", requestOptions.cache);

    xhr.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        resolve({
          ok: true,
          status: this.status,
          statusText: xhr.statusText,
          text: () => xhr.response
        });
      } else {
        reject({
          ok: false,
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function() {
      reject({
        ok: false,
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send(requestOptions.body);
  });
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
