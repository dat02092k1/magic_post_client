import { CheckCircleOutlined } from "@ant-design/icons";
import { Image, Timeline } from "antd";

const OrderStatus = () => {
  const items = [
    {
      label: <p>08:00 2023-11-20</p>,
      color: "green",
      children: (
        <>
          <h2 className="text-lg font-semibold">Đơn hàng được xác nhận</h2>
          <p>Điểm Giao dịch A đã tiếp nhận đơn hàng</p>
        </>
      ),
    },
    {
      label: <p>08:00 2023-11-20</p>,
      color: "green",
      children: "Đơn vị vận chuyển đã lấy hàng",
    },

    {
      label: <p>08:00 2023-11-20</p>,
      color: "green",
      children: (
        <>
          <h2 className="text-lg font-semibold">
            Đơn hàng đã đến Điểm Tập kết 69
          </h2>
        </>
      ),
    },
    {
      label: <p>08:00 2023-11-20</p>,
      color: "green",
      children: (
        <>
          <h2 className="text-lg font-semibold">
            Đơn hàng đã đến Điểm Giao dịch 21
          </h2>
        </>
      ),
    },

    {
      color: "gray",
      children: (
        <>
          <p>Technical testing 1</p>
          <p>Technical testing 2</p>
          <p>Technical testing 3 2015-09-01</p>
        </>
      ),
    },
    {
      color: "#00CCFF",
      dot: <CheckCircleOutlined className="text-2xl text-green-500" />,
      children: <p>Custom color testing</p>,
    },
  ];
  return (
    <div className="w-full">
      <div className="mt-[26px] mb-5">
        <div>
          <h1 className="text-2xl font-semibold">Trạng thái vận chuyển</h1>
          <p className="text-sm text-gray-500">
            Xem thông tin hành trình đơn hàng của bạn
          </p>
        </div>
      </div>
      <div className="flex flex-col-reverse items-center justify-start gap-x-4 md:p-4 lg:p-8 md:flex-row">
        <Image
          preview={false}
          src="https://cdn.shopify.com/s/files/1/0386/0971/5244/files/track-order_480x480.png?v=1631886893"
        />
        <div className="grow">
          <Timeline items={items} mode="left" />
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;
