import {
  DeleteOutlined,
  PlusOutlined,
  SendOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Popconfirm,
  Select,
  Table,
  Tooltip,
  Typography,
  message,
} from "antd";
import { useEffect, useState } from "react";
import CreateOrderModal from "./CreateOrderModal";
import { NavLink } from "react-router-dom";
import StatusLabel from "../../statusLabel";

import {
  deleteOrder,
  getOrderByCondition,
  getOrderByDepartmentId,
  updateOrder,
} from "../../../repository/order/order";
import { useStoreState } from "../../../store/hook";
import { getDepartmentById } from "../../../repository/department/department";

const TransactionOrderTable = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useStoreState((state) => state.currentUser);
  const [allOrders, setAllOrders] = useState([]);
  const [isNewOrderCreated, setIsNewOrderCreated] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("outgoing orders");
  const [currentDepInfo, setCurrentDepInfo] = useState(null);
  const [ordersData, setOrdersData] = useState([]);
  const [isOrderUpdated, setIsOrderUpdated] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  useEffect(() => {
    const fetchCurrentDepInfo = async () => {
      const res = await getDepartmentById(currentUser.workDepartment._id);
      if (res?.status === 200) {
        setCurrentDepInfo(res.data.data.gatherPoint);
      }
    };
    fetchCurrentDepInfo();
  }, []);
  console.log(currentDepInfo);

  // Fetch all orders by department id that have current department as this department
  useEffect(() => {
    const fetchOrderByDepId = async (depId) => {
      setIsLoading(true);
      const res = await getOrderByDepartmentId(depId);
      console.log(res);
      if (res?.status === 200) {
        setAllOrders(res.data.orders);
        setIsLoading(false);
        setIsReloading(false);
      }
    };
    if (filterValue === "outgoing orders") {
      fetchOrderByDepId(currentUser.workDepartment._id);
    }
  }, [
    filterValue,
    currentUser.workDepartment._id,
    isNewOrderCreated,
    isOrderUpdated,
    isReloading,
  ]);

  console.log(allOrders);

  // Fetch orders based on filter value
  useEffect(() => {
    const fetchOrderByTransactionDep = async (data) => {
      setIsLoading(true);
      const res = await getOrderByCondition(data);
      console.log(res);
      if (res?.status === 200) {
        setAllOrders(res.data.orders);
        setIsLoading(false);
        setIsReloading(false);
      }
    };
    if (filterValue === "incoming orders") {
      const data = {
        condition: {
          next_department: currentUser.workDepartment._id,
          status: "processing",
        },
      };
      fetchOrderByTransactionDep(data);
    }
  }, [filterValue, currentUser.workDepartment._id, isReloading]);

  // Handle format selected orders to send to server
  const handleFormatResendOrder = () => {
    const formattedOrders = selectedRows.map((order) => {
      if (
        order.status === "rejected" &&
        order.next_department._id ===
          currentDepInfo?.linkDepartments[0].departmentId
      ) {
        return {
          orderId: order._id,
          description: `Đơn hàng đang đến ${currentDepInfo?.linkDepartments[0]?.name}`,
        };
      }
    });
    return {
      type: "resend",
      orders: [...formattedOrders],
    };
  };

  const handleOnConfirm = async () => {
    setIsLoading(true);
    console.log("order data", ordersData);
    if (filterValue === "outgoing orders") {
      const ordersData = handleFormatResendOrder();
      setOrdersData(ordersData.orders);
      if (ordersData.orders.length > 0 && ordersData.type === "resend") {
        const res = await updateOrder(ordersData);
        console.log("update order: ", res);
        if (res?.status === 200) {
          messageApi.success("Xác nhận đơn hàng thành công");
          setIsLoading(false);
          setIsOrderUpdated((prevState) => !prevState);
        } else {
          messageApi.error("Xác nhận đơn hàng thất bại");
          setIsLoading(false);
        }
      }
    }
  };

  // Handle delete order
  const handleDelete = async (orderId) => {
    setIsLoading(true);
    const res = await deleteOrder(orderId);
    if (res.status === 200) {
      messageApi.success("Xóa đơn hàng thành công");
      setIsLoading(false);
      const fetchOrderByDepId = async (depId) => {
        const res = await getOrderByDepartmentId(depId);

        console.log(res);
        if (res?.status === 200) {
          setAllOrders(res.data.orders);
        }
      };
      fetchOrderByDepId(currentUser.workDepartment._id);
    } else {
      setIsLoading(false);
      messageApi.error("Xóa đơn hàng thất bại");
    }
    console.log(orderId);
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "_id",
      key: "orderCode",
      render: (value, record) => {
        return (
          <Tooltip
            title={
              // Check if order is rejected and is in transit to linked department
              record.status === "rejected" &&
              record.next_department._id ===
                currentDepInfo?.linkDepartments[0]?.departmentId &&
              "Chọn đơn để giao lại!"
            }
          >
            <NavLink to={`/employee/order-detail/${record._id}`}>
              {value}
            </NavLink>
          </Tooltip>
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
      width: "20%",
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
        <div className="flex items-center justify-center">
          <Popconfirm
            title="Xác nhận"
            description="Bạn chắc chắn muốn xóa dữ liệu này?"
            okType="danger"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record._id)}
            okButtonProps={{
              loading: isLoading,
            }}
          >
            <span className="text-lg cursor-pointer hover:text-red-600">
              <DeleteOutlined />
            </span>
          </Popconfirm>
        </div>
      ),
      width: "6%",
      fixed: "right",
    },
  ];

  // Handle select rows of orders in table
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      if (selectedRows.length > 0) {
        setIsRowSelected(true);
        setSelectedRows(selectedRows);
      } else {
        setIsRowSelected(false);
        setSelectedRows([]);
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
        record.status === "processing" ||
        record.status === "delivered" ||
        record.status === "accepted",
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
                filterValue: "outgoing orders",
              }}
            >
              <Form.Item noStyle className="w-full" name="filterValue">
                <Select
                  onChange={(value) => setFilterValue(value)}
                  placeholder="Chọn trạng thái"
                  size="large"
                  options={[
                    {
                      value: "outgoing orders",
                      label: "Đơn gốc từ điểm",
                    },
                    {
                      value: "incoming orders",
                      label: "Đơn hàng đến",
                    },
                    {
                      value: "tom",
                      label: "Giao đơn thất bại",
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
          }}
          rowKey={(row) => row._id}
          columns={columns}
          dataSource={allOrders}
          bordered
          scroll={{ x: 1000 }}
          pagination={{ pageSize: 10, position: ["bottomCenter"] }}
          title={() => (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span
                  onClick={() => setIsReloading(!isReloading)}
                  className="mr-3 cursor-pointer p-2 hover:bg-neutral-200 rounded-full flex items-center"
                >
                  <SyncOutlined spin={isReloading} className="text-[18px]" />
                </span>
                <h2 className="font-semibold h-full">Danh sách đơn hàng</h2>
              </div>
              <CreateOrderModal
                isNewOrderCreated={isNewOrderCreated}
                setIsNewOrderCreated={setIsNewOrderCreated}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
              />
              <Button
                onClick={() => setIsModalOpen(true)}
                icon={<PlusOutlined />}
                type="primary"
                size="large"
              >
                Tạo đơn
              </Button>
            </div>
          )}
        />
        {/* <TrackingOrderInfo /> */}
        <div className="w-full flex items-center justify-between my-2">
          <p className="font-semibold text-xl text-[#266191] bg-neutral-300 p-2 rounded-lg">
            Đã chọn:{" "}
            <span className="text-orange-600">
              {selectedRows.length}/{allOrders.length}
            </span>
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

export default TransactionOrderTable;
