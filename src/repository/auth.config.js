import ApiClient from './api.client';
const AUTH_API = `http://localhost:3000/auth`;
const api = new ApiClient(AUTH_API).getInstance();

export const getRefreshToken = async () => {
    const refresh_token = localStorage.getItem('refresh_token');
    const res = await api.post('/refresh-token', { refresh_token });
    if (res.error) {
        console.log(res.error);
        return '';
    }
    localStorage.setItem('token', res.data?.token);
    localStorage.setItem('refresh_token', res.data?.refreshToken);
    return res.data?.token;
};