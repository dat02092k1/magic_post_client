import { QRCode } from "antd";
import OrderInfoTable from "./OrderInfoTable";

const OrderInfo = (props) => {
  const { orderInfo } = props;
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
        <QRCode value={`localhost:5173/home/tracking/${orderInfo?._id}`} />
      </div>
      <OrderInfoTable orderInfo={orderInfo} />
    </div>
  );
};

export default OrderInfo;
