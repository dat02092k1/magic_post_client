import { QRCode } from "antd";
import OrderInfoTable from "./OrderInfoTable";

const OrderInfo = () => {
  return (
    <div className="w-full">
      <div className="mt-[26px] flex justify-between items-center mb-5">
        <div>
          <h1 className="text-2xl font-semibold">
            Đơn hàng đã được tiếp nhận bởi Magic Post
          </h1>
          <p className="text-sm text-gray-500">
            Đơn hàng của bạn đang được xử lý, vui lòng đợi đơn vị vận chuyển
          </p>
        </div>
        <QRCode value="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
      </div>
      <OrderInfoTable />
    </div>
  );
};

export default OrderInfo;
