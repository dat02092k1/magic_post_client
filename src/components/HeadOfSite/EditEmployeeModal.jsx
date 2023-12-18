import { EditOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Button, Cascader, Form, Input, Modal, Select, message } from "antd";
import { treeSelectData } from "../../shared/commonData";
import { useEffect, useRef, useState } from "react";
import { useStoreActions, useStoreState } from "../../store/hook";
import { updateEmployee } from "../../repository/employee/employee";

const EditEmployeeModal = ({
  setIsOpenEditEmployeeModal,
  isOpenEditEmployeeModal,
  currentEmployee,
  setIsEmployeeChanged,
}) => {
  
  const [form] = Form.useForm();
  // Handle form logic
  const employeeForm = Form.useWatch("employeeForm", {
    form,
    preserve: true,
  });
  
  const inputRef = useRef(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [isDataChanged, setIsDataChanged] = useState(false);

  // Handle submit form
  const onHandleFinish = async (values) => {
    console.log(values);
    setIsLoading(true);
    const data = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      role: values.role === "Nhân viên tập kết" ? "gatheringStaff" : "transactionStaff",
      gender: values.employeeGender === 'Nam' ? 'male' : 'female',
    };
    try {
      const res = await updateEmployee(currentEmployee._id, data);
      if (res.status === 200) {
        messageApi.success("Cập nhật thành công");
        setIsLoading(false);
        setIsDataChanged(false);
        setIsEmployeeChanged(true);
        setIsOpenEditEmployeeModal(false);
      }
    } catch (error) {
      console.log(error);
      messageApi.error("Đã có lỗi xảy ra");
      setIsLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        onCancel={() => setIsOpenEditEmployeeModal(false)}
        open={isOpenEditEmployeeModal}
        title={
          <h2 className="font-semibold">
            <EditOutlined className="p-2 text-white rounded-full bg-[#f15757]" />{" "}
            Chỉnh sửa thông tin nhân viên
          </h2>
        }
        footer={null}
      >
        <div className="grid w-full col-span-8 gap-x-6">
          <Form form={form} onFinish={onHandleFinish}>
            <div className="flex flex-col w-full mt-5">
              <div className="flex items-center gap-x-3">
                <Form.Item
                  onChange={() => setIsDataChanged(true)}
                  initialValue={currentEmployee.name}
                  name="name"
                  className="grow"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên nhân viên",
                    },
                  ]}
                >
                  <Input size="large" placeholder="Tên nhân viên" type="text" />
                </Form.Item>
                <Form.Item
                  initialValue={currentEmployee.role === "gatheringStaff" ? "Nhân viên tập kết" : "Nhân viên giao dịch"}
                  name="role"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn chức vụ",
                    },
                  ]}
                >
                  <Select
                    size="large"
                    placeholder="Chức vụ"
                    allowClear
                    options={[
                      {
                        value: "gatheringStaff",
                        label: "Nhân viên tập kết",
                      },
                      {
                        value: "transactionStaff",
                        label: "Nhân viên giao dịch",
                      },
                    ]}
                  />
                </Form.Item>
              </div>
              <div className="flex items-center gap-x-3">
              <Form.Item name="employeeAddress" className="grow" initialValue={currentEmployee.address}>
                <Input size="large" placeholder="Địa chỉ nơi cư trú" type="text" />
              </Form.Item>
              <Form.Item name="employeeGender" rules={[{ required: true }]} 
                initialValue={currentEmployee.gender === 'male' ? "Nam" : "Nữ"}>
                <Select
                  size="large"
                  placeholder="Chọn giới tính"
                  options={[
                    {
                      value: "male",
                      label: "Nam",
                    },
                    {
                      value: "female",
                      label: "Nữ",
                    },
                    {
                      value: "other",
                      label: "Khác",
                    },
                  ]}
                />
              </Form.Item>
              </div>
              <div className="flex items-center gap-x-3">
                <Form.Item
                  initialValue={currentEmployee.phone}
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số điện thoại",
                    },
                  ]}
                >
                  <Input size="large" placeholder="Nhập số điện thoại" />
                </Form.Item>
                <Form.Item
                  initialValue={currentEmployee.email}
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập email",
                    },
                  ]}
                >
                  <Input size="large" placeholder="Nhập email" type="email" />
                </Form.Item>
              </div>
              <div className="flex items-center gap-x-3">
                <Form.Item
                  initialValue={currentEmployee.departmentId.address}
                  name="nơi làm việc"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn nơi làm việc",
                    },
                  ]}
                >
                  <Input size="large" placeholder="Nơi làm" type="text" />
                </Form.Item>  
              </div>
            </div>

            <Form.Item noStyle>
              <Button
                Button type="primary" htmlType="submit" loading={isLoading} className="float-right"
                disabled={!isDataChanged}
              >
                Xác nhận
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default EditEmployeeModal;