import {
  EditOutlined,
  LeftOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, Card, Descriptions, Divider, Spin, Statistic } from "antd";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import EditSiteModal from "../../../components/BossPage/EditSiteModal";
import { useStoreActions, useStoreState } from "../../../store/hook";

const SingleSitePage = () => {
  const { id: departmentId } = useParams();
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const [currentHead, setCurrentHead] = useState(null);
  const [isOpenEditSiteModal, setIsOpenEditSiteModal] = useState(false);
  const [isDepChanged, setIsDepChanged] = useState(false);
  console.log("dep changed: ", isDepChanged);

  // Get department by id
  const fetchDepartmentById = useStoreActions(
    (actions) => actions.fetchDepartmentById
  );
  useEffect(() => {
    async function fetchData() {
      const res = await fetchDepartmentById(departmentId);
      setCurrentDepartment(res.gatherPoint);
      setCurrentHead(res.user);
    }
    fetchData();
    setIsDepChanged(false);
  }, [departmentId, isDepChanged, fetchDepartmentById]);

  // Get all departments from API
  const fetchDepartments = useStoreActions(
    (actions) => actions.fetchDepartments
  );
  useEffect(() => {
    fetchDepartments();
  }, []);
  const departments = useStoreState((state) => state.departments);

  if (!currentDepartment || !currentHead)
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Spin />
      </div>
    );
  const { name: nameOfHead, email } = currentHead;
  const { name, address, region, type, linkDepartments } = currentDepartment;
  const linkDepartmentNames = linkDepartments.map((linkDepartment) => {
    const department = departments.find(
      (dept) => dept._id === linkDepartment.departmentId
    );
    return department
      ? {
          label: department.name,
          value: department.departmentId,
        }
      : null;
  });
  // console.log(linkDepartmentNames);
  // console.log(linkDepartments);
  const siteInfo = [
    {
      key: "1",
      label: "Tên điểm",
      children: name,
    },
    {
      key: "2",
      label: "Loại điểm",
      children: type === "Gathering" ? "Tập kết" : "Giao dịch",
    },
    {
      key: "3",
      label: "Địa chỉ",
      children: address,
    },

    {
      key: "4",
      label: "Các điểm liên kết",
      children: (
        <>
          {linkDepartments.length > 0 ? (
            linkDepartmentNames?.map((item) => {
              return <div key={item?.value}>{item?.label}</div>;
            })
          ) : (
            <p>Không có điểm liên kết</p>
          )}
        </>
      ),
    },
  ];
  const headOfSiteInfo = [
    {
      key: "5",
      label: "Họ và tên",
      children: nameOfHead,
    },
    {
      key: "6",
      label: "Email",
      children: email,
    },
  ];

  return (
    <div className="w-full h-full">
      <div className="flex items-center w-full">
        <Link
          to="/boss/manage-sites"
          className="p-2 text-black hover:text-black"
        >
          <LeftOutlined className="text-md hover:text-neutral-500" />
        </Link>
        <Divider type="vertical" />
        <div className="flex items-center justify-between w-full">
          <h1 className="font-semibold text-md">
            {name} - {region}
          </h1>
          <Button
            type="primary"
            size="large"
            icon={<EditOutlined />}
            onClick={() => setIsOpenEditSiteModal(true)}
          >
            Chỉnh sửa
          </Button>
        </div>
      </div>
      <Divider />
      <div className="w-full">
        <div>
          <div className="w-full">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              <Card>
                <Statistic
                  prefix={
                    <TeamOutlined
                      size={20}
                      className="p-2 text-white bg-green-500 rounded-full"
                    />
                  }
                  title={
                    <p className="text-lg font-medium text-neutral-600">
                      Nhân viên
                    </p>
                  }
                  value={112893}
                />
              </Card>
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
                      Đơn hàng
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
              items={siteInfo}
            />
            <Descriptions
              title={<h2 className="mt-2 font-semibold">Trưởng điểm</h2>}
              layout="vertical"
              bordered
              items={headOfSiteInfo}
            />
          </div>

          <EditSiteModal
            setIsDepChanged={setIsDepChanged}
            currentDepartment={currentDepartment}
            isOpenEditSiteModal={isOpenEditSiteModal}
            setIsOpenEditSiteModal={setIsOpenEditSiteModal}
          />
        </div>
      </div>
    </div>
  );
};

export default SingleSitePage;
