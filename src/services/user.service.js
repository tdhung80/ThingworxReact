import apiURI, * as server from "./backend-fake";

export function login(username, password) {
  return server.post(apiURI.login, { username, password }).then(user => {
    // login successful if there's a user in the response
    user = user || { username: username };
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  });
}

export function logout() {
  localStorage.removeItem("user");
  return server.post(apiURI.logout);
}
