import { Divider, Typography } from "antd";
import EmployeeAccountTable from "../../../components/HeadOfSite/EmployeeAccountTable";

const ManageAccountPage = () => {
  return (
    <div className="w-full h-full">
      <Typography.Title className="mb-0" level={1}>
        Quản lý tài khoản
      </Typography.Title>

      <Divider />
      <div className="w-full">
        <EmployeeAccountTable />
      </div>
    </div>
  );
};

export default ManageAccountPage;
