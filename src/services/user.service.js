import { serviceUrls, ThingworxServer } from "./index";

export const userService = {
  login,
  logout
};

function login(username, password) {
  return ThingworxServer.post(
    serviceUrls.login,
    null,
    options =>
      (options.headers["Authorization"] =
        "Basic " + btoa(username + ":" + password))
  ).then(user => {
    // login successful if there's a user in the response
    // thingworx will use JSessionID as AuthToken for next requests
    user = user || { username: username };
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  });
}

function logout() {
  localStorage.removeItem("user");
  return ThingworxServer.post(serviceUrls.logout);
}
