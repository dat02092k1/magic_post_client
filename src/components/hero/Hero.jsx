import Container from "../Container";
import HeroCarousel from "./HeroCarousel";
import HeroInfo from "./HeroInfo";

const Hero = () => {
  return (
    <Container>
      <div className="mt-[100px] z-0 w-full grid md:grid-cols-8 grid-cols-1 overflow-hidden">
        <div className="w-full overflow-hidden rounded-lg md:col-span-5">
          <HeroCarousel />
        </div>
        <div className="w-full col-span-3">
          <HeroInfo />
        </div>
      </div>
    </Container>
  );
};

export default Hero;
