import { Divider, Typography } from "antd";

import TransactionOrderTable from "../../../components/Staff/transaction/TransactionOrderTable";
import { useStoreState } from "../../../store/hook";
import GatheringOrderTable from "../../../components/Staff/gathering/GatheringOrderTable";

const ManageOrderPage = () => {
  const currentUser = useStoreState((state) => state.currentUser);

  return (
    <div className="w-full h-full">
      <Typography.Title className="mb-0" level={1}>
        {`Quản lý đơn hàng`}
      </Typography.Title>
      <Divider />
      <div className="w-full">
        {currentUser?.role === "transactionStaff" ? (
          <TransactionOrderTable />
        ) : (
          <GatheringOrderTable />
        )}
      </div>
    </div>
  );
};

export default ManageOrderPage;
