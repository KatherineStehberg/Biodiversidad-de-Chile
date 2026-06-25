import MainSection from "@/components/MainSection";
import Slider from "../components/slider/Slider";
import FeaturedContent from "@/components/FeaturedContent";
import NewsSection from "@/components/NewsSection";
import DiagnosticoStrip from "@/components/DiagnosticoStrip";
import ClimateSection from "@/components/ClimateSection";
import SeismicSection from "@/components/SeismicSection";
import BiodiversityLiveSection from "@/components/BiodiversityLiveSection";

export default function Home() {
  return (
    <>
      <Slider/>
      <MainSection/>
      <ClimateSection/>
      <SeismicSection/>
      <BiodiversityLiveSection/>
      <DiagnosticoStrip/>
      <FeaturedContent/>
      <NewsSection/>
    </>
  );
}
