import {
  Button,
  Input,
  Popconfirm,
  Space,
  Table,
  Typography,
  message,
} from "antd";

import { useEffect, useRef, useState } from "react";

import {
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import AddSiteModal from "./AddSiteModal";
import { NavLink } from "react-router-dom";
import { useStoreActions, useStoreState } from "../../store/hook";
import { deleteDepartment } from "../../repository/department/department";
import { deleteUserById } from "../../repository/user/user";

const CollectionPointTable = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const searchInput = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get all departments from API
  const fetchDepartments = useStoreActions(
    (actions) => actions.fetchDepartments
  );
  useEffect(() => {
    fetchDepartments();
  }, []);
  const departments = useStoreState((state) => state.departments);

  // Handle search in table
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  // Handle delete department
  const handleDelete = async (departmentId) => {
    setIsLoading(true);
    try {
      const deleteDepRes = await deleteDepartment(departmentId);
      // const deleteUserRes = await deleteUserById(departmentId);
      // console.log(res);
      if (deleteDepRes.status === 200) {
        messageApi.success("Xóa thành công");
        setIsLoading(false);
        fetchDepartments();
      }
    } catch (error) {
      // console.log(error);
      messageApi.error("Đã có lỗi xảy ra");
    }
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Đặt lại
          </Button>

          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Hủy
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        className="text-lg"
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      width: "3%",
      className: "font-bold",
    },
    {
      title: "Tên điểm",
      dataIndex: "name",
      width: "3%",
      render: (value, record) => {
        return (
          <NavLink to={`/boss/manage-sites/${record._id}`}>{value}</NavLink>
        );
      },
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",

      width: "3%",
    },
    {
      title: "Phân loại",

      dataIndex: "type",
      render: (value) => {
        return <span>{value === "Gathering" ? "Tập kết" : "Giao dịch"}</span>;
      },
      filters: [
        {
          text: "Giao dịch",
          value: "Transaction",
        },
        {
          text: "Tập kết",
          value: "Gathering",
        },
      ],
      onFilter: (value, record) => record.type.startsWith(value),
      // filterSearch: true,
      width: "2%",
    },
    // {
    //   title: "Trưởng điểm",
    //   dataIndex: "head_of_site",
    //   width: "15%",
    //   ...getColumnSearchProps("head_of_site"),
    // },
    // {
    //   title: "Số lượng",
    //   className: "text-center",

    //   children: [
    //     {
    //       title: "Nhân viên",
    //       dataIndex: "number_of_staff",
    //       key: "building",
    //       width: "10%",
    //       className: "text-center",
    //     },
    //     {
    //       title: "Đơn hàng",
    //       dataIndex: "number_of_goods",
    //       key: "number",
    //       width: "10%",
    //       className: "text-center",
    //     },
    //   ],
    // },
    // {
    //   title: "Tình trạng",
    //   render: (_, record) => {
    //     if (record.number_of_goods > 1000)
    //       return <p className="font-semibold text-red-500">Quá tải</p>;
    //     else return <p className="font-semibold text-green-500">Bình thường</p>;
    //   },
    //   width: "10%",
    // },
    {
      className: "text-center",
      render: (_, record) => {
        return (
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
        );
      },
      width: "1%",
      fixed: "right",
    },
  ];
  return (
    <>
      {contextHolder}
      <div className="w-full h-full py-4">
        <Table
          rowKey={(row) => row._id}
          columns={columns}
          dataSource={departments}
          bordered
          scroll={{ x: 1200 }}
          pagination={{ pageSize: 10 }}
          title={() => (
            <div className="flex items-center justify-between">
              <Typography.Title className="mb-0" level={3}>
                Điểm Giao dịch và Tập kết
              </Typography.Title>
              <AddSiteModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
              />
              <Button
                onClick={() => setIsModalOpen(true)}
                icon={<PlusOutlined />}
                type="primary"
                size="large"
              >
                Thêm điểm
              </Button>
            </div>
          )}
        />
      </div>
    </>
  );
};

export default CollectionPointTable;
