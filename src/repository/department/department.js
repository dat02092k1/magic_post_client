import axios from "axios";
import UtilConstants from "../../shared/constants";
import api from '../index'

export const createDepartment = async (department) => {
    try {
        return await axios.post(UtilConstants.baseUrl + '/department', department);
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}
export const getDepartments = async () => {
    try {
        return await axios.get(UtilConstants.baseUrl + '/department');
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}
export const getDepartmentById = async (departmentId) => {
    try {
        return await axios.get(`${UtilConstants.baseUrl}/department/${departmentId}`);
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}
export const deleteDepartment = async (departmentId) => {
    try {
        return await axios.delete(`${UtilConstants.baseUrl}/department/${departmentId}`);
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}
export const updateDepartment = async (departmentId, departmentData) => {
    try {
        return await axios.put(`${UtilConstants.baseUrl}/department/${departmentId}`, departmentData);
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }

}
export const getDepartmentByCondition = async (condition) => {
    return api.get(UtilConstants.baseUrl + '/department', { params: { condition } });
}