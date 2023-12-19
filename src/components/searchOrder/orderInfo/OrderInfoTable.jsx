/* eslint-disable react/prop-types */
import { Checkbox } from "antd";
import StatusLabel from "../../statusLabel";

const OrderInfoTable = ({ orderInfo }) => {
  const options = [
    {
      label: "Tài liệu",
      value: "document",
      checked: true,
      disabled: true,
    },
    {
      label: "Hàng hóa",
      value: "goods",
      disabled: true,
    },
  ];
  const {
    sender,
    receiver,
    senderPhone,
    receiverPhone,
    send_department,
    receive_department,
    status,
    createdAt,
    expectedDate,
    weight,
    COD,
    price,
    type,
  } = orderInfo;
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };
  const formatTime = (value) => {
    const date = new Date(value);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full overflow-hidden bg-white rounded-lg shadow-md table-auto">
        <thead className="bg-[#f5f6f9]">
          <tr>
            <th
              className="px-6 py-3 text-sm font-semibold text-left uppercase"
              colSpan="2"
            >
              Người gửi
            </th>
            <th
              className="px-6 py-3 text-sm font-semibold text-left uppercase"
              colSpan="2"
            >
              Người nhận
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          <tr>
            <td className="px-6 py-3 border-gray-200">Họ và tên:</td>
            <td className="px-6 py-3 border-b border-gray-200">{sender}</td>
            <td className="px-6 py-3 border-b border-r border-gray-200">
              Họ và tên:
            </td>
            <td className="px-6 py-3 border-b border-gray-200">{receiver}</td>
          </tr>
          <tr>
            <td className="px-6 py-3 border-b border-r border-gray-200">
              Điện thoại:
            </td>
            <td className="px-6 py-3 border-b border-gray-200">
              {senderPhone}
            </td>
            <td className="px-6 py-3 border-b border-r border-gray-200">
              Điện thoại:
            </td>
            <td className="px-6 py-3 border-b border-gray-200">
              {receiverPhone}
            </td>
          </tr>
          <tr>
            <td className="px-6 py-3 border-b border-r border-gray-200">
              Địa chỉ:
            </td>
            <td className="px-6 py-3 border-b border-gray-200">
              {send_department?.address}
            </td>
            <td className="px-6 py-3 border-b border-r border-gray-200">
              Địa chỉ:
            </td>
            <td className="px-6 py-3 border-b border-gray-200">
              {receive_department?.address}
            </td>
          </tr>
        </tbody>
      </table>
      <table className="w-full overflow-hidden bg-white rounded-lg shadow-md table-auto">
        <thead className="bg-[#f5f6f9]">
          <tr>
            <th
              className="px-6 py-3 text-sm font-semibold text-left uppercase"
              colSpan="2"
            >
              Thông tin đơn hàng
            </th>
            <th
              className="px-6 py-3 text-sm font-semibold text-left uppercase"
              colSpan="2"
            >
              Chi phí
            </th>
          </tr>
        </thead>

        <tbody className="text-gray-700">
          <tr>
            <td className="px-6 py-3 border-gray-200">Loại hàng gửi:</td>
            <td className="px-6 py-3 border-b border-gray-200">
              <Checkbox.Group options={options} defaultValue={[type]} />
            </td>
            <td className="px-6 py-3 border-b border-r border-gray-200">
              Giá trị hàng hóa:
            </td>
            <td className="px-6 py-3 border-b border-gray-200">
              {formatCurrency(price)}
            </td>
          </tr>
          <tr>
            <td className="px-6 py-3 border-b border-r border-gray-200">
              Mã đơn hàng:
            </td>
            <td className="px-6 py-3 font-semibold border-b border-gray-200">
              {orderInfo?._id}
            </td>
            <td className="px-6 py-3 border-b border-r border-gray-200">
              Cước:
            </td>
            <td className="px-6 py-3 border-b border-gray-200">
              {formatCurrency(COD)}
            </td>
          </tr>
          <tr>
            <td className="px-6 py-3 border-b border-r border-gray-200">
              Trạng thái hiện tại:
            </td>
            <td className="px-6 py-3 border-b border-gray-200">
              <StatusLabel status={status} />
            </td>
            <td className="px-6 py-3 border-b border-r border-gray-200">
              Tổng thu:
            </td>
            <td className="px-6 py-3 border-b border-gray-200">
              {formatCurrency(price + COD)}
            </td>
          </tr>
          <tr>
            <td className="px-6 py-3 border-b border-r border-gray-200">
              Ngày gửi hàng:
            </td>
            <td className="px-6 py-3 border-b border-gray-200">
              {formatTime(createdAt)}
            </td>
          </tr>
          <tr>
            <td className="px-6 py-3 border-b border-r border-gray-200">
              Ngày giao hàng dự kiến:
            </td>
            <td className="px-6 py-3 border-b border-gray-200">
              {formatTime(expectedDate)}
            </td>
          </tr>
          <tr>
            <td className="px-6 py-3 border-b border-r border-gray-200">
              Cân nặng:
            </td>
            <td className="px-6 py-3 border-b border-gray-200">{weight} kg</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OrderInfoTable;
