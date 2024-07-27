import Axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getLocalStorage, setLocalStorage } from "utils/local-storage";

const axiosInstance: AxiosInstance = Axios.create({
  baseURL: process.env.REACT_APP_API_SERVER,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const accessToken = getLocalStorage("access_token");
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${accessToken}`;
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axiosInstance.post("/auth/refresh-token");
        setLocalStorage("access_token", data?.access_token);

        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${data.access_token}`;

        return axiosInstance(originalRequest);
      } catch (err) {
        console.error("Failed to refresh access token", err);
        logout();
        return Promise.reject(err);
      }
    }

    if (error.response.status === 403) {
      console.error("Refresh token expired or invalid");
      logout();
    }

    return Promise.reject(error);
  }
);

export const logout = async (): Promise<void> => {
  try {
    await axiosInstance.post("/auth/logout");
  } catch (err) {
    console.error("Failed to logout", err);
  } finally {
    localStorage.clear();
    window.location.href = "/login";
  }
};

const axios = axiosInstance;
export default axios;
