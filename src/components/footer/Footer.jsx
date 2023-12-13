import {
  HomeOutlined,
  InstagramOutlined,
  PhoneOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { Image } from "antd";

const Footer = () => {
  return (
    <div className="bg-[#212d33] w-full border-t-[6px] border-0 border-solid border-red-500">
      <div className="container px-4 mx-auto">
        <div className="flex flex-wrap justify-between py-6">
          <div className="w-full mb-4 lg:w-1/4 lg:mb-0">
            <h2 className="mb-2 text-xl font-bold text-white">Giới thiệu</h2>
            <Image
              width={150}
              preview={false}
              src="https://deo.shopeemobile.com/shopee/shopee-spx-live-vn/static/media/logoSaleNoti.520fec30.png"
            />
            <div className="leading-tight text-neutral-400">
              Magic Post là doanh nghiệp hàng đầu cung cấp dịch vụ chuyển phát
              nhanh hàng hoá tại Việt Nam.
            </div>
          </div>
          <div className="w-full mb-4 lg:w-1/4 lg:mb-0">
            <h2 className="mb-2 text-xl font-bold text-white">Liên hệ</h2>
            <div className="leading-tight text-neutral-400">
              <p>
                <HomeOutlined />
                <span className="ml-[4px]">
                  Số 120, đường Hoàng Quốc Việt, quận Cầu Giấy, Hà Nội
                </span>
              </p>
              <p>
                <PhoneOutlined />
                <span className="ml-[4px]">0989987637</span>
              </p>
            </div>
          </div>
          <div className="w-full mb-4 lg:w-1/4 lg:mb-0">
            <h2 className="mb-2 text-xl font-bold text-white">Mạng xã hội</h2>
            <div className="leading-tight text-neutral-400">
              <p>
                <InstagramOutlined />
                <span className="ml-[4px]">MagicPost</span>
              </p>
              <p>
                <YoutubeOutlined />
                <span className="ml-[4px]">MagicPost Services</span>
              </p>
            </div>
          </div>
        </div>
        <p className="text-center text-neutral-400 mb-[10px]">
          @2023 Magic Post All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
