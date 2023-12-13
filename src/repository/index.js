import ApiClient from './api.client';

const END_POINT = `http://localhost:3000`;

const api = new ApiClient(END_POINT).getInstance();

export default api;