import { Button, Form, Image, Input, Spin, Steps, message } from "antd";

import trackOrderImg from "../../assets/track-order.jpg";
import { SearchOutlined } from "@ant-design/icons";

import { useEffect, useState } from "react";
import OrderInfo from "./orderInfo/OrderInfo";
import OrderStatus from "./orderStatus/OrderStatus";
import { useNavigate, useParams } from "react-router";
import { getOrderById } from "../../repository/order/order";

const SearchOrder = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [orderInfo, setOrderInfo] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUrlChanged, setIsUrlChanged] = useState(false);
  const navigate = useNavigate();
  const { id: orderId } = useParams();
  console.log(orderId);
  useEffect(() => {
    if (orderId) {
      const fetchOrderById = async (orderId) => {
        setIsLoading(true);
        const res = await getOrderById(orderId);
        console.log(res);
        if (res?.status === 200) {
          setOrderInfo(res.data.order);
          setIsLoading(false);
          setIsUrlChanged(false);
        } else {
          setOrderInfo(null);
          setIsLoading(false);
          setIsUrlChanged(false);
          messageApi.error("Không tìm thấy đơn hàng");
          navigate("/home");
        }
      };
      fetchOrderById(orderId);
    }
  }, [isUrlChanged, orderId, messageApi, navigate]);

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    const { orderCode } = values;

    if (!orderCode || orderCode.trim() === "") {
      messageApi.error("Vui lòng nhập mã đơn hàng");
      return;
    } else {
      navigate(`/home/tracking/${orderCode}`);
      setIsUrlChanged(true);
    }
  };
  console.log(orderInfo);
  const [current, setCurrent] = useState(0);
  const steps = [
    {
      title: (
        <p onClick={() => setCurrent(0)} className="cursor-pointer">
          Đã xác nhận đơn hàng
        </p>
      ),
      content: <OrderInfo orderInfo={orderInfo} />,
    },
    {
      title: (
        <p onClick={() => setCurrent(1)} className="cursor-pointer">
          Đang vận chuyển
        </p>
      ),
      content: <OrderStatus orderInfo={orderInfo} />,
    },
    {
      title: "Giao hàng thành công",
    },
  ];

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  return (
    <>
      {contextHolder}
      <Form
        onFinish={onFinish}
        name="track-order-form"
        className="flex items-center justify-center gap-3 mb-[20px]"
      >
        <Form.Item noStyle name="orderCode">
          <Input
            className="w-[60%] md:w-[50%]"
            placeholder="Nhập mã đơn hàng của bạn"
            prefix={<SearchOutlined />}
            allowClear
            size="large"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
          />
        </Form.Item>
        <Button htmlType="submit" size="large" type="primary">
          Tra cứu
        </Button>
      </Form>
      {orderInfo && !isUrlChanged ? (
        <div className="w-full min-h-[480px] shadow-[0px_3px_20px_0px_#00000024] rounded-xl py-6 px-4">
          <Steps current={current} items={items} />
          <div>{steps[current].content}</div>
        </div>
      ) : isLoading ? (
        <div className="w-full h-screen relative flex items-center justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <Image
          height={460}
          width="100%"
          className="object-contain"
          preview={false}
          src={trackOrderImg}
        />
      )}
    </>
  );
};

export default SearchOrder;
