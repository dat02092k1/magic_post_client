import axios from "axios";
import UtilConstants from "../../shared/constants";
export const getUserById = async (userId) => {
    try {
        return await axios.get(`${UtilConstants.baseUrl}/user/${userId}`);
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}
export const deleteUserById = async (userId) => {
    try {
        return await axios.delete(`${UtilConstants.baseUrl}/user/${userId}`);
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }
}