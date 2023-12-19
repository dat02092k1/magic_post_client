import { PlusCircleTwoTone } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Modal, Select, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { getDepartmentByCondition } from "../../../repository/department/department";
import { useStoreState } from "../../../store/hook";
import { createOrder } from "../../../repository/order/order";

const CreateOrderModal = ({
  isModalOpen,
  setIsModalOpen,
  setIsNewOrderCreated,
  isNewOrderCreated,
}) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [transactionDep, setTransactionDep] = useState([]);
  const currentUser = useStoreState((state) => state.currentUser);
  const [messageApi, contextHolder] = message.useMessage();
  // Handle modal
  const handleOk = () => {
    console.log("ok");
    setIsModalOpen(false);
    onHandleFinish();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // Handle call api create order
  const onHandleFinish = async (values) => {
    setIsLoading(true);
    console.log(values);
    const data = {
      sender: values.senderName,
      senderPhone: values.senderPhone,
      receiver: values.receiverName,
      receiverPhone: values.receiverPhone,
      send_department: currentUser.workDepartment._id,
      receive_department: values.receiverDep,
      current_department: currentUser.workDepartment._id,
      next_department:
        currentUser.workDepartment.linkDepartments[0].departmentId,
      price: Number(values.orderPrice),
      weight: Number(values.orderWeight),
      type: values.orderType,
      description: "Đơn hàng đã được tạo",
      COD: Number(values.COD),
    };
    console.log("data:", data);
    const res = await createOrder(data);
    console.log("create order:", res);
    if (res?.status === 201) {
      messageApi.success("Tạo đơn hàng thành công");
      setIsNewOrderCreated(!isNewOrderCreated);
      setIsModalOpen(false);
      form.resetFields();
      setIsLoading(false);
    } else {
      setIsLoading(false);
      messageApi.error("Tạo đơn hàng thất bại");
    }
  };
  const typeOptions = [
    {
      label: "Tài liệu",
      value: "document",
    },
    {
      label: "Hàng hóa",
      value: "goods",
    },
  ];
  useEffect(() => {
    const getTransactionDep = async () => {
      const condition = {
        type: "Transaction",
      };
      const stringifiedCondition = JSON.stringify(condition);
      const res = await getDepartmentByCondition(stringifiedCondition);
      if (res.status === 200) {
        setTransactionDep(res.data.departments);
      }
    };
    getTransactionDep();
  }, []);

  // Format options for selecting receiver's department
  const transactionDepOptions = transactionDep
    .filter((item) => item._id !== currentUser.workDepartment._id)
    .map((dep) => {
      return {
        label: dep.name,
        value: dep._id,
      };
    });
  return (
    <>
      {contextHolder}
      <Modal
        footer={null}
        open={isModalOpen}
        title={
          <>
            <h1 className="mb-[16px] text-3xl font-semibold">
              <PlusCircleTwoTone twoToneColor="#266191" />
              <span className="ml-[10px]">Tạo đơn hàng gửi</span>
            </h1>
          </>
        }
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <div className="w-full h-full pb-6">
          <Form form={form} onFinish={onHandleFinish}>
            <div className="flex flex-col w-full">
              <div className="flex items-center gap-x-[10px]">
                <Form.Item
                  className="grow"
                  name="senderName"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên người gửi",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Họ và tên người gửi"
                    type="text"
                  />
                </Form.Item>

                <Form.Item
                  className="grow"
                  name="senderPhone"
                  rules={[
                    {
                      // required: true,
                      message: "Vui lòng nhập số điện thoại người gửi",
                    },
                    {
                      pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                      message: "Số điện thoại không hợp lệ",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Số điện thoại người gửi"
                    type="text"
                  />
                </Form.Item>
              </div>

              <div className="flex items-center gap-x-[10px]">
                <Form.Item
                  className="grow"
                  name="receiverName"
                  rules={[
                    {
                      // required: true,
                      message: "Vui lòng nhập tên người nhận",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Họ và tên người nhận"
                    type="text"
                  />
                </Form.Item>

                <Form.Item
                  className="grow"
                  name="receiverPhone"
                  rules={[
                    {
                      // required: true,
                      message: "Vui lòng nhập số điện thoại người nhận",
                    },
                    {
                      pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                      message: "Số điện thoại không hợp lệ",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Số điện thoại người nhận"
                    type="text"
                  />
                </Form.Item>
              </div>
              <h2 className="py-2 text-xl font-semibold">Thông tin hàng hóa</h2>
              <div className="flex items-center gap-x-[10px]">
                <Form.Item
                  className="grow"
                  name="orderPrice"
                  rules={[
                    {
                      // required: true,
                      message: "Vui lòng nhập giá trị đơn hàng",
                    },
                  ]}
                >
                  <InputNumber
                    className="w-full"
                    addonAfter="VND"
                    size="large"
                    placeholder="Giá trị đơn hàng"
                    min="0"
                    step="0.0"
                    stringMode
                  />
                </Form.Item>

                <Form.Item
                  className="grow"
                  name="orderWeight"
                  rules={[
                    {
                      // required: true,
                      message: "Vui lòng nhập khối lượng đơn hàng",
                    },
                  ]}
                >
                  <InputNumber
                    className="w-full"
                    addonAfter="KG"
                    size="large"
                    placeholder="Khối lượng"
                    min="0"
                    step="0.0"
                    stringMode
                  />
                </Form.Item>
                <Form.Item name="COD" className="grow-0">
                  <InputNumber
                    size="large"
                    placeholder="COD"
                    min="0"
                    step="0.0"
                    stringMode
                  />
                </Form.Item>
              </div>

              <div className="flex items-center gap-x-[10px]">
                <Form.Item
                  className="grow"
                  name="receiverDep"
                  rules={[
                    {
                      // required: true,
                      message: "Vui lòng chọn Điểm giao dịch đích",
                    },
                  ]}
                >
                  <Select
                    size="large"
                    placeholder="Chọn Điểm giao dịch đích"
                    allowClear
                    options={transactionDepOptions}
                  />
                </Form.Item>

                <Form.Item
                  name="orderType"
                  rules={[
                    {
                      // required: true,
                      message: "Vui lòng chọn loại hàng hóa",
                    },
                  ]}
                >
                  <Select
                    size="large"
                    placeholder="Chọn loại hàng hóa"
                    allowClear
                    options={typeOptions}
                  />
                </Form.Item>
              </div>
            </div>

            <Form.Item noStyle>
              <Button
                loading={isLoading}
                type="primary"
                htmlType="submit"
                className="float-right"
              >
                Tạo
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default CreateOrderModal;
