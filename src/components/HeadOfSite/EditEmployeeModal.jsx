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
  const [messageApi, contextHolder] = message.useMessage();
  const [departmentLocation, setDepartmentLocation] = useState(currentEmployee.departmentId.address);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataChanged, setIsDataChanged] = useState(false);
  // Get all departments from API
  const fetchDepartments = useStoreActions(
    (actions) => actions.fetchDepartments
  );
  useEffect(() => {
    fetchDepartments();
  }, []);
  const departments = useStoreState((state) => state.departments);
  // Format departments to options for Select input
  let formattedDepOptions = [];
    formattedDepOptions = departments
      .map((item) => {
        return {
          label: item.name,
          value: item._id,
          type: item.type,
        };
      });
  // Handle 
  const handleDepartmentChange = (value) => {
    let depart = departments.filter((item) => {
      return item._id === value
    })
    setIsDataChanged(true);
    setDepartmentLocation(depart[0].address);
  };
  // Handle submit form
  const onHandleFinish = async (values) => {
    //validation info here

    let depart = formattedDepOptions.filter(o => {
      return o.value === values.departmentId
    })
    setIsLoading(true);
    const data = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      departmentId: values.departmentId,
      role: depart[0].type === "Gathering" ? "gatheringStaff" : "transactionStaff",
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
                <Form.Item onChange={() => setIsDataChanged(true)} name="employeeGender" rules={[{ required: true }]} 
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
                onChange={() => setIsDataChanged(true)} 
                name="employeeAddress" 
                className="grow" 
                initialValue={currentEmployee.address}>
                <Input size="large" placeholder="Địa chỉ nơi cư trú" type="text" />
              </Form.Item>
              </div>
              <div className="flex items-center gap-x-3">
                <Form.Item
                  onChange={() => setIsDataChanged(true)}
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
                  onChange={() => setIsDataChanged(true)}
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
                  onChange={() => setIsDataChanged(true)}
                  initialValue={currentEmployee.departmentId.name}
                  name="departmentId"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn nơi làm việc",
                    },
                  ]}
                >
                  <Select
                  onChange={handleDepartmentChange}
                  size="large"
                  placeholder={"Chọn điểm làm việc"}
                  optionFilterProp="children"
                  options={formattedDepOptions}
                />
                </Form.Item>  
                <Form.Item
                  name="departmentLocation"
                  className="grow"
                >
                  {departmentLocation}
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
