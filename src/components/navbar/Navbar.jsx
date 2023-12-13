import { Avatar, Button, Dropdown, Image, Modal } from "antd";
import Container from "../Container";
import { useEffect, useState } from "react";
import { LogoutOutlined } from "@ant-design/icons";

import logo from "../../assets/logo.svg";
import { useStoreActions, useStoreState } from "../../store/hook";
import { useNavigate } from "react-router";

import defaultAvatar from "../../assets/placeholder.jpg";
// eslint-disable-next-line react/prop-types
const Navbar = ({ handleClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleName, setRoleName] = useState("");
  const removeState = useStoreActions((actions) => actions.removeState);
  const navigate = useNavigate();

  // Check if user is logged in
  const currentUser = useStoreState((state) => state.currentUser);
  console.log(currentUser);
  useEffect(() => {
    if (currentUser?.loggedIn) {
      if (currentUser?.role === "admin") {
        setRoleName("Lãnh đạo công ty");
      } else if (currentUser?.role === "headGathering") {
        setRoleName("Trưởng điểm Tập kết");
      } else if (currentUser?.role === "headTransaction") {
        setRoleName("Trưởng điểm Giao dịch");
      } else if (currentUser?.role === "transactionStaff") {
        setRoleName("Nhân viên Giao dịch");
      } else if (currentUser?.role === "gatheringStaff") {
        setRoleName("Nhân viên Tập kết");
      }
    }
  }, [currentUser?.role, currentUser?.loggedIn]);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    removeState();
    navigate("/home");
  };
  const items = [
    {
      key: "1",
      label: <span onClick={showModal}>Thông tin cá nhân</span>,
    },
    {
      key: "2",
      label: (
        <span className="flex items-center w-full text-red-500">
          <span onClick={handleLogout} className="w-full text-center">
            Đăng xuất <LogoutOutlined />
          </span>
        </span>
      ),
    },
  ];
  const test = "headGathering";
  return (
    <div className="w-full h-[64px] bg-white fixed top-0 right-0 left-0 z-50 mb-[64px] shadow-md">
      <Container>
        <div className="flex items-center justify-between w-full h-full">
          <Image
            className="cursor-pointer"
            onClick={() => navigate("/home")}
            src={logo}
            preview={false}
          />
          {currentUser?.loggedIn ? (
            <>
              <Dropdown
                menu={{ items }}
                placement="bottom"
                arrow={{ pointAtCenter: true }}
              >
                <Avatar
                  className="cursor-pointer border-neutral-300"
                  size={50}
                  src={defaultAvatar}
                />
              </Dropdown>
              <Modal
                title={<h1 className="w-full text-2xl">Thông tin cá nhân</h1>}
                footer={null}
                onCancel={handleCancel}
                open={isModalOpen}
              >
                <ul className="font-semibold list-none">
                  <li>
                    Họ và tên: <span>{currentUser.name}</span>
                  </li>
                  <li>
                    Email: <span>{currentUser.email}</span>
                  </li>
                  <li>
                    Ngày sinh: <span>25/11/1969</span>
                  </li>
                  <li>
                    Số điện thoại <span>0989989989</span>
                  </li>
                </ul>
                <h3 className="text-lg">Chức vụ</h3>
                <p>{roleName}</p>
                {!currentUser?.role.includes("admin") && (
                  <>
                    <h3 className="text-lg">
                      {currentUser?.role.includes("transaction") ||
                      currentUser?.role.includes("Transaction")
                        ? "Điểm giao dịch"
                        : "Điểm tập kết"}
                    </h3>
                    <p>{currentUser?.workDepartment?.address}</p>
                  </>
                )}
              </Modal>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Button onClick={handleClick} type="ghost" size="large">
                <span className="hover:underline">Tra cứu trạng thái</span>
              </Button>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
