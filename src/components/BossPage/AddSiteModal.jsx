import {
  InfoCircleOutlined,
  PlusCircleTwoTone,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Cascader,
  Form,
  Input,
  Modal,
  Select,
  Upload,
  message,
} from "antd";
import { useForm } from "antd/es/form/Form";

import { useEffect, useRef, useState } from "react";

import { createDepartment } from "../../repository/department/department";
import { useStoreActions, useStoreState } from "../../store/hook";
const AddSiteModal = ({ isModalOpen, setIsModalOpen }) => {
  const inputRef = useRef(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);

  // Handle form logic
  const [form] = useForm();
  const siteLocation = Form.useWatch("siteLocation", {
    form,
    preserve: true,
  });
  const siteType = Form.useWatch("siteType", {
    form,
    preserve: true,
  });

  useEffect(() => {
    form.setFieldValue(
      "detailSiteLocation",
      `${siteLocation?.reverse().join(", ")}`
    );
  }, [siteLocation, form]);

  // Get all departments from API
  const fetchDepartments = useStoreActions(
    (actions) => actions.fetchDepartments
  );
  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);
  let departments = useStoreState((state) => state.departments);
  let customSelectProps = {};
  // Filter departments based on site type
  if (siteType === "Transaction") {
    departments = departments.filter((item) => item.type === "Gathering");
    customSelectProps = {};
  } else if (siteType === "Gathering") {
    customSelectProps = {
      mode: "multiple",
    };
  }

  const formattedDepOptions = departments.map((item) => {
    return {
      label: item.name,
      value: item._id,
      type: item.type,
    };
  });
  console.log(formattedDepOptions);

  // Create a lookup object that maps department IDs to types
  const departmentTypeLookup = formattedDepOptions.reduce((lookup, item) => {
    lookup[item.value] = item.type;
    return lookup;
  }, {});

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
    console.log(values);
    values.siteType === "Transaction"
      ? (values.role = "headTransaction")
      : (values.role = "headGathering");
    let formattedLinkDepValues = [];
    if (values.linkDepartments?.length > 0 && siteType === "Gathering") {
      formattedLinkDepValues = values.linkDepartments.map((item) => {
        return {
          _id: item,
          type: departmentTypeLookup[item],
        };
      });
    } else if (siteType === "Transaction") {
      formattedLinkDepValues.push({
        _id: values.linkDepartments,
        type: departmentTypeLookup[values.linkDepartments],
      });
    }
    console.log(formattedLinkDepValues);
    const data = {
      department: {
        name: values.siteName,
        address: values.detailSiteLocation,
        region: values.siteLocation?.[1],
        type: values.siteType,
        linkDepartments: formattedLinkDepValues,
      },
      user: {
        name: values.headOfSiteName,
        email: values.headOfSiteEmail,
        password: values.headOfSitePassword,
        role: values.role,
      },
    };
    console.log(data);

    try {
      const res = await createDepartment(data);
      if (res.status === 201) {
        fetchDepartments();

        messageApi.success("Tạo điểm thành công");
        setIsLoading(false);
        setIsModalOpen(false);
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

  // Tree data for selection input
  const treeSelectData = [
    {
      value: "Hà Nội",
      label: "Hà Nội",
      children: [
        {
          value: "Bắc Từ Liêm",
          label: "Bắc Từ Liêm",
        },
        {
          value: "Nam Từ Liêm",
          label: "Nam Từ Liêm",
        },
        {
          value: "Cầu Giấy",
          label: "Cầu Giấy",
        },
        {
          value: "Hoàng Mai",
          label: "Hoàng Mai",
        },
      ],
    },
    {
      value: "Hồ Chí Minh",
      label: "Hồ Chí Minh",
      children: [
        {
          value: "Quận 1",
          label: "Quận 1",
        },
        {
          value: "Quận 2",
          label: "Quận 2",
        },
        {
          value: "Quận Thủ Đức",
          label: "Quận Thủ Đức",
        },
        {
          value: "Quận Thủ Dầu Một",
          label: "Quận Thủ Dầu Một",
        },
      ],
    },
  ];

  const filterOption = (input, option) => {
    return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  };
  return (
    <>
      {contextHolder}
      <Modal
        title={
          <>
            <h1 className="mb-[10px] text-3xl font-semibold">
              <PlusCircleTwoTone twoToneColor="#f15757" />
              <span className="ml-[10px]">Thêm điểm</span>
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
            <h2 className="py-3 text-xl font-semibold">Thông tin Điểm</h2>
            <div className="flex flex-col w-full">
              <div className="flex items-center gap-x-3">
                <Form.Item name="siteName" className="grow">
                  <Input size="large" placeholder="Tên điểm" type="text" />
                </Form.Item>

                <Form.Item name="siteType">
                  <Select
                    size="large"
                    placeholder="Chọn loại điểm"
                    allowClear
                    options={[
                      {
                        value: "Gathering",
                        label: "Tập kết",
                      },
                      {
                        value: "Transaction",
                        label: "Giao dịch",
                      },
                    ]}
                  />
                </Form.Item>
              </div>

              <div>
                <Form.Item name="siteLocation">
                  <Cascader
                    size="large"
                    placeholder="Chọn TP/Tỉnh, quận/huyện"
                    options={treeSelectData}
                  />
                </Form.Item>
                <Form.Item dependencies={["siteLocation"]} noStyle>
                  {({ getFieldValue }) =>
                    getFieldValue("siteLocation") !== undefined ? (
                      <Form.Item
                        name="detailSiteLocation"
                        help={
                          <p className="flex items-center">
                            <InfoCircleOutlined />
                            <span className="ml-2 font-semibold">
                              Nhập địa chỉ chi tiết
                            </span>
                          </p>
                        }
                      >
                        <Input
                          onClick={() => {
                            inputRef?.current?.focus({
                              cursor: "start",
                            });
                          }}
                          ref={inputRef}
                          size="large"
                          placeholder="Địa chỉ chi tiết"
                        />
                      </Form.Item>
                    ) : null
                  }
                </Form.Item>
              </div>
              <Form.Item name="linkDepartments">
                <Select
                  {...customSelectProps}
                  size="large"
                  showSearch
                  placeholder={
                    siteType === "Transaction"
                      ? "Chọn điểm tập kết liên kết"
                      : "Chọn các điểm liên kết"
                  }
                  optionFilterProp="children"
                  filterOption={filterOption}
                  options={formattedDepOptions}
                />
              </Form.Item>
            </div>
            <h2 className="py-3 text-xl font-semibold">
              Thông tin Trưởng điểm
            </h2>
            <div className="flex flex-col w-full">
              <div className="flex items-center gap-x-3">
                <Form.Item name="headOfSiteName" className="grow">
                  <Input size="large" placeholder="Họ và tên" type="text" />
                </Form.Item>
              </div>
              <div className="flex items-center gap-x-3">
                <Form.Item name="headOfSiteEmail" className="grow">
                  <Input
                    size="large"
                    placeholder="Email tài khoản"
                    type="email"
                  />
                </Form.Item>
                <Form.Item name="headOfSitePassword">
                  <Input
                    size="large"
                    placeholder="Mật khẩu tài khoản"
                    type="text"
                  />
                </Form.Item>
              </div>

              <Upload
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                listType="picture"
              >
                <Button size="large" icon={<UploadOutlined />}>
                  Tải lên ảnh đại diện
                </Button>
              </Upload>
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

export default AddSiteModal;
