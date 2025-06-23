import axios from "axios";  

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REST_API_ENDPOINT, // TODO: take this api URL from env
  timeout: 120000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Change request data/error here
http.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Change response data/error here
http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default http;
