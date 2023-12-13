import { EditOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Button, Cascader, Form, Input, Modal, Select, message } from "antd";
import { treeSelectData } from "../../shared/commonData";
import { useEffect, useRef, useState } from "react";
import { useStoreActions, useStoreState } from "../../store/hook";
import { updateDepartment } from "../../repository/department/department";

const EditSiteModal = ({
  // eslint-disable-next-line react/prop-types
  setIsOpenEditSiteModal,
  // eslint-disable-next-line react/prop-types
  isOpenEditSiteModal,
  // eslint-disable-next-line react/prop-types
  currentDepartment,
  // eslint-disable-next-line react/prop-types
  setIsDepChanged,
}) => {
  const { name, address, type, linkDepartments } = currentDepartment;
  const [currentLocation, setCurrentLocation] = useState(address);
  const [form] = Form.useForm();
  // Handle form logic
  const siteLocation = Form.useWatch("siteLocation", {
    form,
    preserve: true,
  });

  useEffect(() => {
    setCurrentLocation(siteLocation?.slice().reverse().join(", "));
  }, [siteLocation]);

  // useEffect(() => {
  //   form.setFieldValue(
  //     "detailSiteLocation",
  //     siteLocation?.reverse().join(", ")
  //   );
  // }, [siteLocation, form, address]);
  useEffect(() => {
    form.setFieldValue("detailSiteLocation", currentLocation);
  }, [currentLocation, form]);

  const inputRef = useRef(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [isLinkDepChanged, setIsLinkDepChanged] = useState(false);

  // Get all departments from API
  const fetchDepartments = useStoreActions(
    (actions) => actions.fetchDepartments
  );
  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);
  let departments = useStoreState((state) => state.departments);

  // Format departments to options for Select input
  let formattedDepOptions = [];
  if (type === "Gathering") {
    formattedDepOptions = departments
      .filter(
        (item) =>
          (item._id !== currentDepartment._id &&
            item.linkDepartments.length === 0 &&
            item.type === "Transaction") ||
          (item.type === "Gathering" && item._id !== currentDepartment._id)
      )
      .map((item) => {
        return {
          label: item.name,
          value: item._id,
          type: item.type,
        };
      });
  } else if (type === "Transaction") {
    console.log("chece");
    console.log("all deps: ", departments);
    formattedDepOptions = departments
      .filter(
        (item) =>
          item.type === "Gathering" && item._id !== currentDepartment._id
      )
      .map((item) => {
        return {
          label: item.name,
          value: item._id,
          type: item.type,
        };
      });
  }
  // Create a lookup object that maps department IDs to types
  const departmentTypeLookup = formattedDepOptions.reduce((lookup, item) => {
    lookup[item.value] = item.type;

    return lookup;
  }, {});

  // Handle submit form
  const onHandleFinish = async (values) => {
    console.log(values);
    let formattedLinkDepValues = [];
    if (Array.isArray(values.linkDepartments)) {
      formattedLinkDepValues = values.linkDepartments.map((item) => {
        return {
          departmentId: item,
          type: departmentTypeLookup[item],
        };
      });
    }
    let data = {};
    if (isLinkDepChanged) {
      data = {
        name: values.siteName,
        address: values.detailSiteLocation,
        region: values.siteLocation?.[0],
        linkDepartments:
          type === "Gathering"
            ? formattedLinkDepValues
            : [
                {
                  departmentId: values.linkDepartments,
                  type: "Gathering",
                },
              ],
      };
    } else {
      data = {
        name: values.siteName,
        address: values.detailSiteLocation,
        region: values.siteLocation?.[0],
      };
    }

    console.log(data);
    try {
      const res = await updateDepartment(currentDepartment._id, data);
      if (res.status === 200) {
        messageApi.success("Cập nhật thành công");
        setIsLoading(false);
        setIsDataChanged(false);
        setIsDepChanged(true);
        setIsOpenEditSiteModal(false);
      }
    } catch (error) {
      console.log(error);
      messageApi.error("Đã có lỗi xảy ra");
    }
  };
  // eslint-disable-next-line react/prop-types

  // Map linkDepartments to department names
  const linkDepartmentNames = linkDepartments.map((linkDepartment) => {
    const department = departments.find(
      (dept) => dept._id === linkDepartment.departmentId
    );
    console.log(department);
    return department
      ? {
          label: department.name,
          value: department._id,
        }
      : null;
  });

  // Filter departments based on site type
  let customSelectProps = {};
  if (type === "Transaction") {
    departments = departments.filter((item) => item.type === "Gathering");
    customSelectProps = {};
  } else if (type === "Gathering") {
    customSelectProps = {
      mode: "multiple",
    };
  }
  const filterOption = (input, option) => {
    return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  };
  return (
    <>
      {contextHolder}
      <Modal
        onCancel={() => setIsOpenEditSiteModal(false)}
        open={isOpenEditSiteModal}
        title={
          <h2 className="font-semibold">
            <EditOutlined className="p-2 text-white rounded-full bg-[#266191]" />{" "}
            Chỉnh sửa thông tin điểm
          </h2>
        }
        footer={null}
      >
        <div className="w-full h-full pb-6">
          <Form
            form={form}
            onFinish={onHandleFinish}
            initialValues={{
              siteLocation: address?.split(", ").reverse(),
              linkDepartments: linkDepartmentNames,
            }}
          >
            <div className="flex flex-col w-full mt-5">
              <div className="flex items-center gap-x-3">
                <Form.Item
                  onChange={() => setIsDataChanged(true)}
                  initialValue={name}
                  name="siteName"
                  className="grow"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên điểm",
                    },
                  ]}
                >
                  <Input size="large" placeholder="Tên điểm" type="text" />
                </Form.Item>

                <Form.Item
                  initialValue={type === "Gathering" ? "Tập kết" : "Giao dịch"}
                  name="siteType"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn loại điểm",
                    },
                  ]}
                >
                  <Select
                    disabled
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
                    onChange={() => setIsDataChanged(true)}
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
                          onChange={() => setIsDataChanged(true)}
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
                  onChange={() => setIsLinkDepChanged(true)}
                  {...customSelectProps}
                  size="large"
                  showSearch
                  placeholder={"Chọn điểm liên kết"}
                  optionFilterProp="children"
                  filterOption={filterOption}
                  options={formattedDepOptions}
                />
              </Form.Item>
            </div>

            <Form.Item noStyle>
              <Button
                disabled={!isDataChanged && !isLinkDepChanged}
                loading={isLoading}
                type="primary"
                htmlType="submit"
                className="float-right"
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

export default EditSiteModal;
