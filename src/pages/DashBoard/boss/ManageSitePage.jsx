import { Divider, Typography } from "antd";
import CollectionPointTable from "../../../components/BossPage/CollectionPointTable";

const ManageSitePage = () => {
  return (
    <div className="w-full h-full">
      <Typography.Title className="mb-0" level={1}>
        Quản lý điểm kho
      </Typography.Title>
      <Divider />
      <div className="w-full">
        <CollectionPointTable />
      </div>
    </div>
  );
};

export default ManageSitePage;
