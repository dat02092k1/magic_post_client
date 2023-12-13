import { ShoppingCartOutlined } from "@ant-design/icons";
import { Card, Divider, Statistic, Typography } from "antd";

const GoodsStatsPage = () => {
  return (
    <div className="w-full h-full">
      <Typography.Title className="mb-0" level={1}>
        Thống kê hàng hóa
      </Typography.Title>
      <Divider />
      <div className="w-full">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <Card>
            <Statistic
              prefix={<ShoppingCartOutlined size={20} />}
              title="Điểm tập kết"
              value={112893}
            />
          </Card>
          <Card>
            <Statistic
              prefix={<ShoppingCartOutlined size={20} />}
              title="Điểm giao dịch"
              value={112893}
            />
          </Card>
          <Card>
            <Statistic
              prefix={<ShoppingCartOutlined size={20} />}
              title="Đơn hàng"
              value={112893}
            />
          </Card>
          <Card>
            <Statistic
              prefix={<ShoppingCartOutlined size={20} />}
              title="Nhân viên"
              value={112893}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GoodsStatsPage;
