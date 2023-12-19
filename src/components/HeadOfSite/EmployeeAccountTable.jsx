import {
  DeleteOutlined,
  LoadingOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Input, Popconfirm, Space, Table, Typography, Upload, message } from "antd";
import { useRef, useState, useEffect } from "react";
import Highlighter from "react-highlight-words";
import { NavLink } from "react-router-dom";
import { useStoreActions, useStoreState } from "../../store/hook";
import CreateEmployeeModal from "./CreateEmployeeModal";
import { deleteEmployee, createEmployeeFromFile } from "../../repository/employee/employee";

const EmployeeAccountTable = () => {
  const currentUser = useStoreState((state) => state.currentUser);
  const [messageApi, contextHolder] = message.useMessage();
  const searchInput = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get all employees from API
  const fetchEmployees = useStoreActions((actions) => actions.fetchEmployeesByDepartment);

  useEffect(() => {
    fetchEmployees(currentUser.workDepartment);
  }, []);
  const employees = useStoreState((state) => state.employees);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const handleUpload = async (file) => {
    setIsLoading(true);
    console.log(file);
    try {
      const res = await createEmployeeFromFile(file);
      if (res.status === 201) {
        messageApi.success("Thêm nhân viên thành công");
        setIsLoading(false);
        fetchEmployees(currentUser.departmentId);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      messageApi.error("Đã có lỗi xảy ra");
    }
  }

  // Handle delete employee
  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      const res = await deleteEmployee(id);
      if (res.status === 200) {
        messageApi.success("Xóa thành công");
        setIsLoading(false);
        fetchEmployees(currentUser.workDepartment);
      }
    } catch (error) {
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
      title: "Tên nhân viên",
      dataIndex: "name",
      width: "15%",
      render: (value, record) => {
        return (
          <NavLink to={`/head/manage-account/${record._id}`}>
            {value}
          </NavLink>
        );
      },
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      render: (value) => {
        return <p>{value === 'male' ? 'Nam' : 'Nữ'}</p>;
      },
      width: "8%",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      width: "10%",
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "15%",
    },
    {
      fixed: "right",
      className: "text-center",
      render: (_, record) => {
        return (
          <Popconfirm
            title="Xác nhận"
            onConfirm={() => handleDelete(record._id)}
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
      width: "4%",
    },
  ];
  return (
    <div className="w-full h-full py-4">
      <Table
        dataSource={employees}
        rowKey={(row) => row.id}
        columns={columns}
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
            <div className="flex items-center gap-x-3">
              <Upload action={handleUpload} fileList={null}>
                <Button
                icon={isLoading ? <LoadingOutlined/> : <PlusOutlined />}
                type="primary"
                size="large">
                Import file
                </Button>
              </Upload>
            
              <Button
                onClick={() => setIsModalOpen(true)}
                icon={<PlusOutlined />}
                type="primary"
                size="large">
                Thêm nhân viên
              </Button>
            </div>
          </div>
        )}
      />
      
      <span className="text-2xl font-semibold">Điểm {currentUser.role === 'headTransaction' ? 'Giao Dịch' : 'Tập Kết'} {currentUser.workDepartment.address} </span>
    </div>
  );
};

export default EmployeeAccountTable;
