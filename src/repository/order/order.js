import UtilConstants from "../../shared/constants";
import api from '../index'

export const createOrder = async (order) => {
    return api.post(UtilConstants.baseUrl + '/order', order)
}
export const getOrderByDepartmentId = async (departmentId) => {
    return api.get(`${UtilConstants.baseUrl}/orders/department/${departmentId}`)
}
export const deleteOrder = async (orderId) => {
    return api.delete(`${UtilConstants.baseUrl}/orders/${orderId}`)
}
export const getOrderById = async (orderId) => {
    return api.get(`${UtilConstants.baseUrl}/orders/${orderId}`)
}