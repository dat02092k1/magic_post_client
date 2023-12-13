import axios from "axios";
import UtilConstants from "../../shared/constants";
import api from '../index'

export const signin = async (email, password) => {
    return api.post(UtilConstants.baseUrl + '/auth/login', { email, password });
}

export const forgetPassword = async (email) => {
    try {
        const data = {
            email: email,
        }

        return await axios.post(UtilConstants.baseUrl + '/auth/forget-password', data);
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}

export const checkVerifyCode = async (information) => {
    try {

        return await axios.post(UtilConstants.baseUrl + '/auth/reset-password', information);
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}

export const sigout = async () => {
    return api.post(UtilConstants.baseUrl + '/auth/logout');
}