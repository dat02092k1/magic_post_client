import {
    EditOutlined,
    LeftOutlined,
    ShoppingCartOutlined,
    TeamOutlined,
  } from "@ant-design/icons";
  import { Button, Card, Descriptions, Divider, Spin, Statistic, Avatar, Upload } from "antd";
  import { useEffect, useState } from "react";
  import { Link, useParams } from "react-router-dom";
  import EditEmployeeModal from "../../../components/HeadOfSite/EditEmployeeModal";
  import { useStoreActions, useStoreState } from "../../../store/hook";
  import { updateEmployee } from "../../../repository/employee/employee";
  
  const SingleEmployeePage = () => {
    const { id: employeeId } = useParams();
    const [isOpenEditEmployeeModal, setIsOpenEditEmployeeModal] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [isEmployeeChanged, setIsEmployeeChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const currentUser = useStoreState((state) => state.currentUser);
    // Get department by id
    const fetchUserById = useStoreActions(
      (actions) => actions.fetchUserById
    );
    useEffect(() => {
      async function fetchData() {
        const res = await fetchUserById(employeeId);
        setCurrentEmployee(res.user);
        setIsEmployeeChanged(false);
      }
      fetchData();
    }, [employeeId, fetchUserById, isEmployeeChanged]);
  
    const changeAvatar = async (file) => {
      setIsLoading(true);
      try {
        const res = await updateEmployee(currentEmployee._id, currentEmployee, file);
        if (res.status === 200) {
          setIsLoading(false);
          console.log(res);
          setIsEmployeeChanged(true);
        }
      } catch (error) {
        setIsLoading(false);
        console.log('co loi', error);
      }
    };
    if (!currentEmployee)
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Spin />
      </div>
    );
    const employeeInfo = [
      {
        key: "1",
        label: "Tên",
        children: currentEmployee.name,
      },
      {
        key: "2",
        label: "Chức vụ",
        children: currentEmployee.role === "gatheringStaff" ? "Nhân viên tập kết" : "Nhân viên giao dịch",
      },
      {
        key: "3",
        label: "Giới tính",
        children: currentEmployee.gender === 'male' ? "Nam" : "Nữ",
      },
      {
        key: "4",
        label: "Số điện thoại",
        children: currentEmployee.phone,
      },
      {
        key: "5",
        label: "Email",
        children: currentEmployee.email,
      },
      {
        key: "6",
        label: "Phòng ban",
        children: currentEmployee.department,
      }
    ];
    return (
      <div className="w-full h-full">
        <div className="flex items-center w-full">
          <Link
            to="/head/manage-accounts"
            className="p-2 text-black hover:text-black"
          >
            <LeftOutlined className="text-md hover:text-neutral-500" />
          </Link>
          <Divider type="vertical" />
          <div className="flex items-center justify-between w-full">
            <h1 className="font-semibold text-md">
              
            </h1>
            <Button
              disabled={currentUser.workDepartment._id !== currentEmployee.departmentId._id}
              type="primary"
              size="large"
              icon={<EditOutlined />}
              onClick={() => setIsOpenEditEmployeeModal(true)}
            >
              Chỉnh sửa
            </Button>
          </div>
        </div>
        <Divider />
        <Upload action={changeAvatar} fileList={null}>
          <Avatar
          size={{ xs: 24, sm: 48, md: 60, lg: 80, xl: 120, xxl: 300 }}
          src={!isLoading? currentEmployee.avatarUrl : "https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca.gif"}/>
        </Upload>
        
        <div className="w-full">
          <div>
            <div className="w-full">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                <Card>
                  <Statistic
                    prefix={
                      <ShoppingCartOutlined
                        size={20}
                        className="p-2 text-white bg-orange-500 rounded-full"
                      />
                    }
                    title={
                      <p className="text-lg font-medium text-neutral-600">
                        Đơn hàng đã hoàn thành
                      </p>
                    }
                    value={112893}
                  />
                </Card>
              </div>
            </div>
            <div className="mt-[12px]">
              <Descriptions
                title={<h2 className="font-semibold">Thông tin chi tiết</h2>}
                layout="vertical"
                bordered
                items={employeeInfo}
              />
            </div>
  
            <EditEmployeeModal
              currentEmployee={currentEmployee}
              isOpenEditEmployeeModal={isOpenEditEmployeeModal}
              setIsOpenEditEmployeeModal={setIsOpenEditEmployeeModal}
              setIsEmployeeChanged={setIsEmployeeChanged}
            />
          </div>
        </div>
      </div>
    );
  };
  
  export default SingleEmployeePage;
  