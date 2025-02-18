import axios from "axios";

const http = axios.create({
  // TODO： 配置baseURL
  baseURL: "",
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
});

export { http };
