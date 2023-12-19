import axios from "axios";
import UtilConstants from "../../shared/constants";
import { utilFuncs } from "../../utils/utils";
import { useStoreActions, useStoreState } from "../../store/hook";

export const createEmployee = async (user, image) => {
    try {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('name', user.name);
        formData.append('email', user.email);
        formData.append('phone', user.phone);
        formData.append('role', user.role);
        formData.append('departmentId', user.departmentId._id);
        formData.append('password', user.password);
        formData.append('gender', user.gender);

        const header = {
            authorization: `Bearer ${utilFuncs.getStorage('token')}`,
            'Content-Type': 'multipart/form-data'
        }
        
        const res = await axios.post(UtilConstants.baseUrl + '/user', formData, { headers: header });

        return res;
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}
export const createEmployeeFromFile = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const header = {
            authorization: `Bearer ${utilFuncs.getStorage('token')}`,
            'Content-Type': 'multipart/form-data'
        }
        const res = await axios.post(UtilConstants.baseUrl + '/users/import', formData, { headers: header });

        return res;
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}
export const getEmployees = async () => {
    try {
        return await axios.get(UtilConstants.baseUrl + '/users');
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}
export const getEmployeeByDepartmentId = async (department) => {
    try {
        const condition = {
           departmentId : department._id
        };
        return await axios.get(UtilConstants.baseUrl + `/users?condition=${JSON.stringify(condition)}`);
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}
export const getEmployeeById = async (userId) => {
    try {
        return await axios.get(`${UtilConstants.baseUrl}/user/${userId}`);
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}
export const deleteEmployee = async (userId) => {
    try {
        return await axios.delete(`${UtilConstants.baseUrl}/user/${userId}`);
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}
export const updateEmployee = async (userId, user, image) => {
    try {
        const formData = new FormData();
        if(image){
            formData.append('image', image);
        }
        formData.append('name', user.name);
        formData.append('email', user.email);
        formData.append('phone', user.phone);
        formData.append('role', user.role);
        formData.append('departmentId', user.departmentId._id);
        formData.append('password', user.password);
        formData.append('gender', user.gender);
        return await axios.put(`${UtilConstants.baseUrl}/user/${userId}`, formData);
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}
