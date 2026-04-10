import axios from "axios";
import {env} from "./env"

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "production"
      ? env.BASE_URL_PRODUCTION
      : env.BASE_URL_DEV,
  withCredentials: true,
});