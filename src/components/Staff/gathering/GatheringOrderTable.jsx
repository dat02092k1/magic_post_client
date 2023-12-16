import { SendOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Select,
  Table,
  Tooltip,
  Typography,
  message,
} from "antd";
import { useEffect, useState } from "react";

import { NavLink } from "react-router-dom";
import StatusLabel from "../../statusLabel";

import {
  getOrderByGatheringDep,
  updateOrder,
} from "../../../repository/order/order";
import { useStoreState } from "../../../store/hook";

const GatheringOrderTable = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useStoreState((state) => state.currentUser);
  const [allOrders, setAllOrders] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("incoming orders");
  const [ordersData, setOrdersData] = useState([]);
  const [isOrderUpdated, setIsOrderUpdated] = useState(false);

  console.log("selectedRows: ", selectedRows);
  // Handle format selected orders to send to server
  const handleFormatConfirmOrders = (selectedRows) => {
    const formattedOrders = selectedRows.map((order) => {
      if (
        order.status === "processing" &&
        order.next_department === currentUser.workDepartment._id
      ) {
        return {
          orderId: order._id,
          current_department: currentUser.workDepartment._id,
          description: `Đơn hàng đã đến ${currentUser.workDepartment.name}`,
        };
      }
    });
    return {
      type: "confirm",
      orders: [...formattedOrders],
    };
  };
  const handleFormatTransferOrders = (selectedRows) => {
    const formattedOrders = selectedRows.map((order) => {
      if (
        order.status === "accepted" &&
        order.current_department === currentUser.workDepartment._id
      ) {
        return {
          orderId: order._id,
          next_department: null,
          description: `Đơn hàng đang đến chua biet :(`,
        };
      }
    });
    return {
      type: "transfer",
      orders: [...formattedOrders],
    };
  };
  useEffect(() => {
    if (ordersData.length === 0 && ordersData.type !== "transfer") {
      const ordersData = handleFormatTransferOrders(selectedRows);
      setOrdersData(ordersData.orders);
    }
  }, [selectedRows]);
  // Handle when user clicks confirm button
  const handleOnConfirm = async () => {
    // setIsLoading(true);
    if (filterValue === "incoming orders") {
      const ordersData = handleFormatConfirmOrders(selectedRows);
      setOrdersData(ordersData.orders);
      console.log(ordersData);
      if (ordersData.orders.length > 0 && ordersData.type === "confirm") {
        const res = await updateOrder(ordersData);
        console.log("update order: ", res);
        if (res.status === 200) {
          messageApi.success("Xác nhận đơn hàng thành công");
          setIsLoading(false);
          setIsOrderUpdated(!isOrderUpdated);
        } else {
          messageApi.error("Xác nhận đơn hàng thất bại");
          setIsLoading(false);
        }
      }
    } else if (filterValue === "outgoing orders") {
      console.log(ordersData);
    }
  };
  // Fetch all orders by department id that have current department as this department
  useEffect(() => {
    const fetchOrderByGatheringDep = async (data) => {
      setIsLoading(true);
      const res = await getOrderByGatheringDep(data);

      if (res?.status === 200) {
        setIsLoading(false);
        setAllOrders(res.data.orders);
        setIsRowSelected(false);
        setSelectedRows([]);
        setSelectedRowKeys([]);
      } else {
        setIsLoading(false);
        messageApi.error("Lấy danh sách đơn hàng thất bại");
      }
    };

    if (filterValue === "incoming orders") {
      const data = {
        condition: {
          next_department: currentUser.workDepartment._id,
          status: "processing",
        },
      };
      fetchOrderByGatheringDep(data);
    } else if (filterValue === "outgoing orders") {
      const data = {
        condition: {
          current_department: currentUser.workDepartment._id,
        },
      };
      fetchOrderByGatheringDep(data);
    }
  }, [currentUser.workDepartment._id, messageApi, isOrderUpdated, filterValue]);

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "_id",
      key: "orderCode",
      render: (value, record) => {
        return (
          <NavLink to={`/employee/order-detail/${record._id}`}>{value}</NavLink>
        );
      },
    },
    {
      title: "Người gửi",
      dataIndex: "sender",
      key: "senderName",
      width: "14%",
      filteredValue: [searchValue],
      onFilter: (value, record) =>
        String(record.sender).toLowerCase().includes(value.toLowerCase()) ||
        String(record.receiver).toLowerCase().includes(value.toLowerCase()) ||
        String(record._id).toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Người nhận",
      dataIndex: "receiver",
      key: "receiverName",
      width: "14%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value) => {
        return <StatusLabel status={value} />;
      },
      width: "14%",
    },
    {
      title: "Ngày gửi hàng",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => {
        return <div>{new Date(value).toLocaleDateString("vi-VN")}</div>;
      },
      width: "16%",
    },
    {
      key: "action",
      render: (value, record) => (
        <div
          className={`flex items-center ${
            record.status === "rejected" ? "justify-between" : "justify-center"
          }`}
        >
          {record?.status === "rejected" && (
            <Tooltip
              title={<span className="text-lg text-black">Gửi lại</span>}
              color="white"
            >
              <span className="text-lg cursor-pointer hover:text-[#1e91cf]">
                <SendOutlined />
              </span>
            </Tooltip>
          )}
        </div>
      ),
      width: "3%",
      fixed: "right",
    },
  ];
  const linkedDepOptions = currentUser?.workDepartment.linkDepartments?.map(
    (dep) => {
      return {
        value: dep.departmentId,
        label: "random",
      };
    }
  );
  console.log(linkedDepOptions);
  if (filterValue === "outgoing orders") {
    columns.splice(1, 0, {
      title: "Điểm đến tiếp theo",
      dataIndex: "newData",
      key: "nextDepartment",
      width: "16%",
      render: (value, record) => {
        return (
          <Form>
            <Form.Item>
              <Select
                onSelect={(selectedNextDep) => {
                  console.log(ordersData);
                  // Add next department to each order when user selects from input
                  ordersData.map((order) => {
                    if (order.orderId === record._id) {
                      order.next_department = selectedNextDep;
                    }
                  });
                }}
                size="large"
                options={linkedDepOptions}
                placeholder="Chọn điểm chuyển tiếp"
              />
            </Form.Item>
          </Form>
        );
      },
    });
  }

  // Handle select rows of orders in table
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      if (selectedRows.length > 0) {
        setIsRowSelected(true);
        setSelectedRows(selectedRows);
        setSelectedRowKeys(selectedRowKeys);
      } else {
        setIsRowSelected(false);
        setSelectedRows([]);
        setSelectedRowKeys([]);
      }
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      // Disable check box when order is processing and being transported to another department
      disabled:
        record.status === "processing" &&
        record.next_department !== currentUser.workDepartment._id,
      // || record.next_department === null,
      // &&
      // record.next_department !== currentUser.workDepartment._id,
      // Column configuration not to be checked
      status: record.status,
    }),
  };
  return (
    <>
      {contextHolder}
      <div className="w-full h-full">
        <div className="w-full p-3 flex items-center">
          <div className="w-full flex items-center gap-x-3">
            <p className="font-semibold text-xl text-[#266191]">Bộ lọc</p>
            <Form
              form={form}
              initialValues={{
                filterValue: "incoming orders",
              }}
            >
              <Form.Item noStyle className="w-full" name="filterValue">
                <Select
                  onChange={(value) => setFilterValue(value)}
                  placeholder="Chọn trạng thái"
                  size="large"
                  options={[
                    {
                      value: "incoming orders",
                      label: "Chờ xác nhận",
                    },
                    {
                      value: "outgoing orders",
                      label: "Đơn chuyển tiếp",
                    },
                  ]}
                />
              </Form.Item>
            </Form>
          </div>
          <Input.Search
            className="max-w-[42%] w-full"
            size="large"
            placeholder="Nhập mã đơn hàng, tên người gửi, người nhận"
            onSearch={(value) => setSearchValue(value)}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <Table
          loading={isLoading}
          rowSelection={{
            ...rowSelection,
            selectedRowKeys,
          }}
          rowKey={(row) => row._id}
          columns={columns}
          dataSource={allOrders}
          bordered
          scroll={{ x: 1600 }}
          pagination={{ pageSize: 10, position: ["bottomCenter"] }}
          title={() => (
            <div className="flex items-center justify-between">
              <Typography.Title className="mb-0" level={3}>
                Danh sách đơn hàng
              </Typography.Title>
            </div>
          )}
        />

        <div className="w-full flex items-center justify-between my-10">
          <p className="font-semibold text-xl text-[#266191] bg-neutral-300 p-2 rounded-lg">
            Đã chọn:{" "}
            <span className="text-orange-600">{selectedRows.length}</span>
          </p>
          <Button
            loading={isLoading}
            onClick={handleOnConfirm}
            htmlType="submit"
            className="float-right"
            type="primary"
            disabled={!isRowSelected}
            size="large"
          >
            Xác nhận
          </Button>
        </div>
      </div>
    </>
  );
};

export default GatheringOrderTable;
