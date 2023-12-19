import { PlusCircleTwoTone } from "@ant-design/icons";
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, Modal, Select, Typography, Upload, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";
import { useStoreActions, useStoreState } from "../../store/hook";
import { createEmployee, getEmployeeById } from "../../repository/employee/employee";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

const CreateEmployeeModal = ({ isModalOpen, setIsModalOpen }) => {
  const [form] = useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const currentUser = useStoreState((state) => state.currentUser);
  // Get all employees from API
  const fetchEmployees = useStoreActions((actions) => actions.fetchEmployeesByDepartment);

  // Handle modal
  const handleOk = () => {
    setIsModalOpen(false);
    onHandleFinish();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onHandleFinish = async (values) => {
    setIsLoading(true);
    currentUser.role === "headTransaction"
      ? (values.role = "transactionStaff")
      : (values.role = "gatheringStaff");
    const data = {
      name: values.employeeName,
      departmentId: currentUser.workDepartment,
      email: values.employeeEmail,
      password: values.employeePassword,
      role: values.role,
      gender: values.employeeGender,
      phone: values.employeePhoneNumber,
    };
    try {
      const res = await createEmployee(data, image);
      if (res.status === 201) {
        fetchEmployees(currentUser.workDepartment);
        messageApi.success("Tạo nhân viên thành công");
        setIsLoading(false);
        setIsModalOpen(false);
        setImage(null);
        setPreviewImage('');
        form.resetFields();
      }
    } catch (error) {
      if (error.response.data.message === "this user existed") {
        messageApi.error("Email đã tồn tại");
      } else if (
        error.response.data.message === "this gathering point already exists"
      ) {
        messageApi.error("Điểm đã tồn tại");
      } else messageApi.error("Đã có lỗi xảy ra");
      setIsLoading(false);
      console.log(error.response.data.message);
    }
  };

  // Handle upload image
  const [previewImage, setPreviewImage] = useState('');
  const handlePreview = async (file) => {
    console.log(file);
  };
  const handleChange = (info) => {
    console.log(info);
    setImage(info.fileList[0].originFileObj);
    console.log(image);
    getBase64(info.fileList[0].originFileObj, (imageUrl) => {
      setPreviewImage(imageUrl);
    });
  }
  const uploadButton = (
    <div>
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  // return 
  return (
  <>
    {contextHolder}
    <Modal
      title={
        <>
          <h1 className="mb-[10px] text-3xl font-semibold">
            <PlusCircleTwoTone twoToneColor="#266191" />
            <span className="ml-[10px]">Tạo nhân viên</span>
          </h1>
        </>
      }
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okButtonProps={{ style: { display: "none" } }}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <div className="w-full h-full pb-6">
        <Form form={form} onFinish={onHandleFinish}>
          <h2 className="py-3 text-xl font-semibold">Thông tin nhân viên</h2>
          <Upload
          name="avatar"
          listType="picture-circle"
          className="avatar-uploader"
          showUploadList={false}
          onChange={handleChange}
          onPreview={handlePreview}>
          {previewImage ? (
          <img
            src={previewImage}
            alt="avatar"
            style={{
              width: '100%',
            }}
          />) : (uploadButton)}
          </Upload>
          <h3 className="py-3 text-xl font-semibold">Nơi làm việc: {currentUser.workDepartment.address}</h3>
          <div className="grid w-full col-span-8 gap-x-6">
            <div className="col-span-4">
              <Form.Item name="employeeName">
                <Input size="large" placeholder="Tên nhân viên" type="text" />
              </Form.Item>
              <Form.Item name="employeeEmail">
                <Input size="large" placeholder="Nhập email" type="email" />
              </Form.Item>
              <Form.Item name="employeePassword">
                <Input size="large" placeholder="Nhập mật khẩu" type="text" />
              </Form.Item>
              <Form.Item name="employeeRePassword">
                <Input
                  size="large"
                  placeholder="Nhập lại mật khẩu"
                  type="text"
                />
              </Form.Item>
            </div>
            <div className="col-span-4 col-start-5">
              <Form.Item name="employeeAddress">
                <Input size="large" placeholder="Địa chỉ nơi cư trú" type="text" />
              </Form.Item>
              <Form.Item
                name="employeePhoneNumber"
                rules={[
                  { max: 10, min: 10, message: "Sai định dạng số điện thoại" },
                ]}
              >
                <Input size="large" placeholder="Nhập số điện thoại" />
              </Form.Item>
              <Form.Item name="employeeGender" rules={[{ required: true }]}>
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
          </div>

          <Form.Item noStyle>
            <Button type="primary" htmlType="submit" loading={isLoading} className="float-right">
              Tạo
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  </>
  );
};

export default CreateEmployeeModal;
