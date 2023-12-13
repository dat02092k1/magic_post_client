import axios from 'axios';

let isRefreshing = false;
let failedQueue = [];

const errorCallback = (status, error) => {
    return { status, error };
};


class ApiClient {
    baseURL;
    tokenType;

    constructor(baseURL, tokenType) {
        this.baseURL = baseURL;
        this.tokenType = tokenType || 'Authorization';
    }

    getInstance() {
        const api = axios.create({
            baseURL: this.baseURL,
            timeout: 30000,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });

        api.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token') ?? '';
                if (config.headers) {
                    config.headers['authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        api.interceptors.response.use(
            (response) => {
                const data = response.data;
                if (data.success === false) {
                    const message = typeof data?.message === 'string' ? data?.message : '';
                    return { ...response.data, status: 400, error: message || 'Có lỗi trong quá trình thực thi' };
                }

                return response.data;
            },
            async (error) => {
                const config = error.config;
                const resError = error.response;
                const dataError = resError && resError.data;
                // const Auth = await import('./auth.config');

                switch (resError?.status) {
                    case 500:
                        return errorCallback(500, dataError?.message || 'Có lỗi trong quá trình thực thi');
                    case 401:
                        // Handle if token is refreshing
                        if (isRefreshing) {
                            return new Promise((resolve, reject) => {
                                failedQueue.push({ resolve, reject });
                            })
                                .then(() => {
                                    if (config) return api(config);
                                })
                                .catch((err) => {
                                    return Promise.reject(err);
                                });
                        }
                        isRefreshing = true;

                        // const accessToken = await Auth.getRefreshToken();
                        // if (accessToken) {
                        //     isRefreshing = false;
                        //     processQueue(null, accessToken);
                        //     if (config) return api(config);
                        // }

                        return Promise.reject(error);
                    default:
                        return errorCallback(500, (resError && dataError?.message) || 'Có lỗi trong quá trình thực thi');
                }
            }
        );
        return api;
    }
}

export default ApiClient;