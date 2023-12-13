import { Checkbox } from "antd";

const OrderInfoTable = () => {
  const options = [
    {
      label: "Tài liệu",
      value: "documents",
      checked: true,
    },
    {
      label: "Hàng hóa",
      value: "goods",
      disabled: true,
    },
  ];
  return (
    <div className="overflow-x-auto">
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
            <td className="px-6 py-3 border-b border-gray-200">
              Nguyễn Hải Nam
            </td>
            <td className="px-6 py-3 border-b border-r border-gray-200">
              Họ và tên:
            </td>
            <td className="px-6 py-3 border-b border-gray-200">Lê Lung Linh</td>
          </tr>
          <tr>
            <td className="px-6 py-3 border-b border-r border-gray-200">
              Điện thoại:
            </td>
            <td className="px-6 py-3 border-b border-gray-200">123-456-7890</td>
            <td className="px-6 py-3 border-b border-r border-gray-200">
              Điện thoại:
            </td>
            <td className="px-6 py-3 border-b border-gray-200">987-654-3210</td>
          </tr>
          <tr>
            <td className="px-6 py-3 border-b border-r border-gray-200">
              Địa chỉ:
            </td>
            <td className="px-6 py-3 border-b border-gray-200">
              Tăng Thiết Giáp, phường Cổ Nhuế, quận Bắc Từ Liêm, Hà Nội
            </td>
            <td className="px-6 py-3 border-b border-r border-gray-200">
              Địa chỉ:
            </td>
            <td className="px-6 py-3 border-b border-gray-200">
              Trần Hưng Đạo, quận Hà Đông, Hà Nội
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
              <Checkbox.Group options={options} defaultValue={["documents"]} />
            </td>
            <td className="px-6 py-3 border-b border-r border-gray-200">
              Phí giao hàng:
            </td>
            <td className="px-6 py-3 border-b border-gray-200">27.000đ</td>
          </tr>
          <tr>
            <td className="px-6 py-3 border-b border-r border-gray-200">
              Mã đơn hàng:
            </td>
            <td className="px-6 py-3 font-semibold border-b border-gray-200">
              SPXVN03668440929B
            </td>
            <td className="px-6 py-3 border-b border-r border-gray-200">
              Phí trả hàng:
            </td>
            <td className="px-6 py-3 border-b border-gray-200">20.000đ</td>
          </tr>
          <tr>
            <td className="px-6 py-3 border-b border-r border-gray-200">
              Trạng thái hiện tại:
            </td>
            <td className="px-6 py-3 border-b border-gray-200">
              <span className="px-4 py-2 text-white bg-sky-800 rounded-xl">
                Đang vận chuyển
              </span>
            </td>
            <td className="px-6 py-3 border-b border-r border-gray-200">
              Tổng thu:
            </td>
            <td className="px-6 py-3 border-b border-gray-200">47.000đ</td>
          </tr>
          <tr>
            <td className="px-6 py-3 border-b border-r border-gray-200">
              Thời gian gửi hàng:
            </td>
            <td className="px-6 py-3 border-b border-gray-200">
              08:45 25/11/2003
            </td>
          </tr>
          <tr>
            <td className="px-6 py-3 border-b border-r border-gray-200">
              Cân nặng:
            </td>
            <td className="px-6 py-3 border-b border-gray-200">10KG</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OrderInfoTable;
