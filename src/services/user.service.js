import apiURI, * as server from "./backend";

const USER_KEY = "user";
const ANONYMOUS_KEY = "Anonymous";

export function isAuthenticated() {
  return localStorage.getItem(USER_KEY);
}

export function isAnonymous() {
  return isAuthenticated() === ANONYMOUS_KEY;
}

export function getUser() {
  const userData = localStorage.getItem(USER_KEY);
  return userData && (userData === ANONYMOUS_KEY ? { username: ANONYMOUS_KEY } : JSON.parse(userData));
}

export function setUser(user) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

export async function login(username, password, remember) {
  let user = await server.post(apiURI.login, { username, password });
  // login successful if there's a user in the response
  user = user || { username: username };
  setUser(user);
  return user;
}

export async function loginAsAnonymous() {
  localStorage.setItem(USER_KEY, ANONYMOUS_KEY);
  return { username: ANONYMOUS_KEY };
}

export function logout(notify = true, func) {
  if (isAuthenticated()) {
    if (typeof func === "function") {
      func();
    } else {
      setUser();
      location.reload(true);
    }
    notify && server.post(apiURI.logout);
  }
}
