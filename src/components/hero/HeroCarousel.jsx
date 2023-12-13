import { Carousel } from "antd";

const HeroCarousel = () => {
  return (
    <>
      <Carousel autoplay>
        <div>
          <img
            src={
              "https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            alt="carousel1"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
        <div>
          <img
            src={
              "https://vinh-cat.com.vn/wp-content/uploads/2021/01/DSC07176.jpg"
            }
            alt="carousel2"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
        <div>
          <img
            src={
              "https://vcdn-kinhdoanh.vnecdn.net/2023/08/31/image2-2439-1693476735.jpg"
            }
            alt="carousel3"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
      </Carousel>
    </>
  );
};

export default HeroCarousel;
