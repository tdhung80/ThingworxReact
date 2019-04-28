import apiURI from "./backend";

import NProgress from "nprogress";
import texts from "./translator.service";

export default apiURI;
export * from "./backend";

//
// configureFakeBackend
//
console.log("configureFakeBackend()");

let urls = Object.keys(apiURI).map(key => apiURI[key]);
let users = [
  {
    id: 1,
    username: "test",
    password: "test",
    firstName: "Test",
    lastName: "User",
    role: "FSR"
  }
];
let requests = 0;
let realFetch = window.fetch;
window.fetch = function(url, opts) {
  // pass through any unmanaged requests
  if (urls.indexOf(url) === -1) {
    console.log("fetch/1: " + url);
    return realFetch(url, opts);
  }

  if (requests++ === 0) NProgress.start(); // count request

  return new Promise((resolve, reject) => {
    // TODO Nprogress
    console.log("AJAX started");
    NProgress.inc();

    // wrap in timeout to simulate server api call
    setTimeout(() => {
      // authenticate

      if (url === apiURI.login && opts.method === "POST") {
        // Basic Authentication
        const authToken = opts.headers.Authorization;
        if (authToken) {
          const tokens = atob(authToken.split(" ")[1]).split(":");
          opts.body = JSON.stringify({
            username: tokens[0],
            password: tokens[1]
          });
        }

        // get parameters from post request
        let params = JSON.parse(opts.body);

        // Authorization: "Basic dGVzdDp0ZXN0"

        // find if any user matches login credentials
        let filteredUsers = users.filter(
          user => user.username === params.username && user.password === params.password
        );

        if (filteredUsers.length) {
          // if login details are valid return user details
          let user = filteredUsers[0];
          let responseJson = {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName
          };
          resolve({
            ok: true,
            text: () => Promise.resolve(JSON.stringify(responseJson))
          });
        } else {
          // else return error
          reject(texts.LOGIN_FAILED);
        }

        return;
      }

      if (url === apiURI.logout && opts.method === "POST") {
        resolve({ ok: true, text: () => Promise.resolve() });
        return;
      }

      // pass through any requests not handled above
      console.log("fetch/2: " + url);
      realFetch(url, opts).then(response => resolve(response));
    }, 500);
  }).finally(() => {
    // stop animation
    console.log("AJAX done");
    if (--requests === 0) NProgress.done();
  });
};
