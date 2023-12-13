import { Outlet } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import { Divider, FloatButton } from "antd";
import Container from "../../components/Container";

import Footer from "../../components/footer/Footer";
import SearchOrder from "../../components/searchOrder/searchOrder";
import { ArrowUpOutlined } from "@ant-design/icons";
import { useRef } from "react";

const Home = () => {
  const ref = useRef(null);
  const handleClick = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="flex flex-col w-full h-screen">
      <Navbar handleClick={handleClick} />
      <div className="md:mb-[46px] mb-[20px] w-full rounded-lg">
        <Outlet />
      </div>
      <div className="grow mb-[30px]" ref={ref}>
        <Container>
          <Divider>
            <h2 className="text-3xl font-semibold sm:text-4xl">
              Theo dõi đơn hàng
            </h2>
          </Divider>
          <SearchOrder />
        </Container>
      </div>

      <Footer />
      <FloatButton.BackTop icon={<ArrowUpOutlined />} />
    </div>
  );
};

export default Home;
