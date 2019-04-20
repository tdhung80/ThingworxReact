import { instanceOf } from "prop-types";

export const ThingworxServer = {
  post
};

// TODO: use axios instead of fetch API

function post(url, data, requestVisitor) {
  const requestOptions = {
    method: "POST",
    headers: Object.assign({
      Accept: "application/json",
      "Content-Type": "application/json",
      "Cache-Control": "no-cache"
    }),
    body: data ? JSON.stringify(data) : "{}",
    //mode: "no-cors",
    credentials: "include" // "same-origin"
  };

  requestVisitor &&
    typeof requestVisitor == "function" &&
    requestVisitor(requestOptions);

  return fetch(url, requestOptions).then(handleResponse);
}

function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        localStorage.removeItem("user");
        location.reload(true);
      }
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }
    return data;
  });
}
