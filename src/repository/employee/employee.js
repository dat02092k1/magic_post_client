import axios from "axios";
import UtilConstants from "../../shared/constants";
import { utilFuncs } from "../../utils/utils";
import { useStoreActions, useStoreState } from "../../store/hook";

export const createEmployee = async (user) => {
    try {
        const header = {
            authorization: `Bearer ${utilFuncs.getStorage('token')}`
        }
        const res = await axios.post(UtilConstants.baseUrl + '/user', user, { headers: header });

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
export const getEmployeeByDepartmentId = async (departmentId) => {
    try {
        const query = {
            condition: {
                departmentId: departmentId 
            }
        };
        
        return await axios.get(UtilConstants.baseUrl + `/users`, { params: query });
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
export const updateEmployee = async (userId, userData) => {
    try {
        return await axios.put(`${UtilConstants.baseUrl}/user/${userId}`, userData);
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}