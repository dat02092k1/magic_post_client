import { Button, Image, Layout, Menu, Modal, theme } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";

import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

import logo from "../../assets/logo.svg";
import {
  AppleOutlined,
  DashboardOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Navbar from "../../components/navbar/Navbar";

import { useStoreState } from "../../store/hook";
function DashBoard() {
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const currentUser = useStoreState((state) => state.currentUser);

  const [selectedKey, setSelectedKey] = useState(
    localStorage.getItem("selectedKey") || "1"
  );

  const handleClick = (e) => {
    localStorage.setItem("selectedKey", e.key);
    setSelectedKey(e.key);
  };

  function getItem(label, key, icon, children, disabled = false) {
    return {
      key,
      icon,
      children,
      label,
      disabled,
    };
  }
  const items = [
    getItem(
      <NavLink to="/">{"Dashboard"}</NavLink>,
      "1",
      <DashboardOutlined />
    ),
    getItem(
      <NavLink to="/inventory">{"Inventory"}</NavLink>,
      "2",
      <AppleOutlined />
    ),
    getItem(
      "Nhân viên",
      "sub1",
      <AppleOutlined />,
      [getItem(<NavLink to="/employee/manage-orders">Đơn hàng</NavLink>, "3")],
      currentUser?.role !== "transactionStaff" &&
        currentUser?.role !== "gatheringStaff"
    ),

    getItem(
      "Trưởng điểm",
      "sub2",
      <AppleOutlined />,
      [
        getItem(
          <NavLink to="/head/manage-accounts">Quản lý tài khoản</NavLink>,
          "6"
        ),
        getItem(
          <NavLink to="/head/goods-inventory">Thống kê hàng hóa</NavLink>,
          "7"
        ),
      ],
      currentUser?.role !== "headTransaction" &&
        currentUser?.role !== "headGathering"
    ),
    getItem(
      "Lãnh đạo",
      "sub3",
      <UserOutlined />,
      [
        getItem(<NavLink to="/boss/manage-sites">Quản lý điểm</NavLink>, "8"),
        getItem(
          <NavLink to="/boss/goods-stats">Thống kê hàng hóa</NavLink>,
          "9"
        ),
      ],
      currentUser?.role !== "admin"
    ),
  ];
  return (
    <Layout>
      <Navbar />
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Sider
          style={{
            overflowX: "hidden",
            height: "100vh",
            position: "sticky",
            left: 0,
            top: 64,
            padding: "8px 0",
            background: "#f2f3f5",
          }}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          breakpoint="md"
          collapsedWidth="60"
        >
          <Header style={{ background: "#f6f8fc" }}>
            <Image src={logo} preview={false} />
          </Header>
          <Menu
            className="overflow-y-auto bg-[#f6f8fc]"
            theme="light"
            defaultSelectedKeys={selectedKey}
            mode="inline"
            items={items}
            onClick={handleClick}
          />
        </Sider>
        <Layout
          style={{
            minHeight: "100vh",
            padding: "12px 10px",
            display: "flex",
          }}
        >
          <Content
            style={{
              flexGrow: 1,
              minHeight: "100vh",
              marginTop: "64px",
            }}
          >
            <div
              className="no-scrollbar shadow-[0px_6px_10px_3px_#00000024]"
              style={{
                overflowY: "auto",
                borderRadius: "10px",
                minHeight: "100vh",
                padding: 20,
                background: colorBgContainer,
              }}
            >
              <Outlet />
            </div>
          </Content>
          {/* <Footer /> */}
        </Layout>
      </Layout>
    </Layout>
  );
}

export default DashBoard;
