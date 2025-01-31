
export const request = (url, method, body) => {
  return fetch(url, {
    headers: { "content-type": "application/json" },
    method: method || "GET",
    body: body ? JSON.stringify(body) : undefined,
  }).then((res) => res.json());
};
