import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_HOST,
});
export default instance;
