import { DeleteOutlined, PlusOutlined, SendOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
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
import TrackingOrderInfo from "../../trackingOrderInfo/TrackingOrderInfo";
import {
  deleteOrder,
  getOrderByDepartmentId,
} from "../../../repository/order/order";
import { useStoreState } from "../../../store/hook";

const TransactionOrderTable = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useStoreState((state) => state.currentUser);
  const [allOrders, setAllOrders] = useState([]);
  const [isNewOrderCreated, setIsNewOrderCreated] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
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

  // Fetch all orders by department id that have current department as this department
  useEffect(() => {
    const fetchOrderByDepId = async (depId) => {
      const res = await getOrderByDepartmentId(depId);
      console.log(res);
      if (res?.status === 200) {
        setAllOrders(res.data.orders);
      }
    };
    fetchOrderByDepId(currentUser.workDepartment._id);
  }, [currentUser.workDepartment._id, isNewOrderCreated]);

  console.log(allOrders);

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
      width: "20%",
    },
    {
      title: "Người nhận",
      dataIndex: "receiver",
      key: "receiverName",
      width: "20%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value, record) => {
        console.log(record);
        return <StatusLabel status={value} />;
      },
      width: "20%",
    },

    {
      title: "Điểm đến tiếp theo",
      dataIndex: "targetPoint",
      key: "targetPoint",
      render: () => {
        return <div>Điểm Tập kết đã liên kết</div>;
      },
      width: "16%",
    },
    {
      key: "action",
      render: (value, record) => (
        console.log(record),
        (
          <div
            className={`flex items-center ${
              record.status === "rejected"
                ? "justify-between"
                : "justify-center"
            }`}
          >
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
        )
      ),
      width: "8%",
      fixed: "right",
    },
  ];

  // Handle select rows of orders in table
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      if (selectedRows.length > 0) {
        setIsRowSelected(true);
      } else setIsRowSelected(false);
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      // Disable check box when order is processing and being transported to another department
      disabled: record.status === "processing",
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
        <div className="w-full p-3 flex items-center gap-x-3">
          <p className="font-semibold text-xl text-[#266191]">Bộ lọc</p>
          <Form.Item noStyle className="w-full">
            <Select />
          </Form.Item>
        </div>
        <Table
          loading={false}
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
              <Typography.Title className="mb-0" level={3}>
                Danh sách đơn hàng
              </Typography.Title>

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
        <div className="w-full">
          <p className="font-semibold text-xl text-[#266191]">Đã chọn: </p>
          <Button
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
