import {
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Input, Popconfirm, Space, Table, Typography } from "antd";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";

import { NavLink } from "react-router-dom";
import { employees as data } from "../../mockData/employees.json";
import CreateEmployeeModal from "./CreateEmployeeModal";
const EmployeeAccountTable = () => {
  const searchInput = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
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
      title: "STT",
      dataIndex: "id",
      width: "6%",
      className: "text-center font-bold",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Tên nhân viên",
      dataIndex: "name",
      width: "20%",
      render: (value, record) => {
        console.log(record.id);
        return (
          <NavLink to={`/head/collection-point/manage-account/${record.id}`}>
            {value}
          </NavLink>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "20%",
    },
    {
      title: "Mật khẩu",
      dataIndex: "password",
      width: "15%",
    },

    {
      title: "Địa chỉ nơi làm việc",
      dataIndex: "site_address",
      filters: [
        {
          text: "Hồ Chí Minh",
          value: "Thành phố Hồ Chí Minh",
          children: [
            {
              text: "Quận 1",
              value: "Quận 1",
            },
          ],
        },
        {
          text: "Hà Nội",
          value: "Thành phố Hà Nội",
        },
      ],

      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => {
        const address = record.address;
        console.log(value, address.split(", "));
        return address.includes(value);
      },

      width: "30%",
    },
    {
      title: "Phân loại",
      dataIndex: "employee_type",
      filters: [
        {
          text: "Giao dịch",
          value: "giao dịch",
        },
        {
          text: "Tập kết",
          value: "tập kết",
        },
      ],
      onFilter: (value, record) => record.employee_type.includes(value),
      filterSearch: true,
      width: "10%",
    },

    {
      title: "Hành động",
      className: "text-center",
      render: (_, record) => {
        return (
          <Popconfirm
            title="Xác nhận"
            description="Bạn chắc chắn muốn xóa dữ liệu này?"
            okType="danger"
            okText="Xóa"
            cancelText="Hủy"
          >
            <span
              onClick={() => console.log(record.id)}
              className="text-lg cursor-pointer hover:text-red-600"
            >
              <DeleteOutlined />
            </span>
          </Popconfirm>
        );
      },
      width: "10%",
    },
  ];
  return (
    <div className="w-full h-full py-4">
      <Table
        rowKey={(row) => row.id}
        columns={columns}
        dataSource={data}
        bordered
        scroll={{
          x: "calc(700px + 50%)",
        }}
        pagination={{ pageSize: 3 }}
        title={() => (
          <div className="flex items-center justify-between">
            <Typography.Title className="mb-0" level={3}>
              Danh sách nhân viên
            </Typography.Title>
            <CreateEmployeeModal
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />
            <Button
              onClick={() => setIsModalOpen(true)}
              icon={<PlusOutlined />}
              type="primary"
              size="large"
            >
              Thêm nhân viên
            </Button>
          </div>
        )}
      />
    </div>
  );
};

export default EmployeeAccountTable;
