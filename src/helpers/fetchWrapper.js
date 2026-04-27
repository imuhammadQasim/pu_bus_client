const handleResponse = async (response) => {
  const text = await response.text();
  const data = text && JSON.parse(text);

  if (!response.ok) {
    const error = (data && data.message) || response.statusText;
    return Promise.reject(error);
  }

  return data;
};

const request = (method) => {
  return (url, body, options = {}) => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      "X-path": window.location.pathname,
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    return fetch(url, config).then(handleResponse);
  };
};

const upload = (url, method, body) => {
  const requestOptions = {
    method: method === "POST" ? "POST" : "PUT",
    body,
  };

  return fetch(url, requestOptions).then(handleResponse);
};

export const Fetch = {
  get: request('GET'),
  post: request('POST'),
  put: request('PUT'),
  delete: request('DELETE'),
  patch: request('PATCH'),
  upload,
};
