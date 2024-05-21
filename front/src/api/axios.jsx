import axios from "axios";

const BASE_URL = "http://localhost:5000";
// const BASE_URL = 'https://awsmdb7.smartmgts.com'; // LIVE server
// const BASE_URL = 'https://smart-sales-test.onrender.com'; // TEST server

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common["Cross-Origin-Resource-Policy"] = "cross-origin";

export default axios.create();

export const axiosPrivate = axios.create({
  withCredentials: true,
});
