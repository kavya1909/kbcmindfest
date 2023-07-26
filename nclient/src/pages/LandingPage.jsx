import Header from "../components/Header";
import OurWork from "../components/OurWork";

import OurServices from "../components/OurServices";
import Footer from "../components/Footer";
import Intro from "../components/Intro";
const LandingPage = () => {
  return (
    <div >
      <Header />
      <div className="landing">
        
        <img
          src="https://media.themeslab.org/preview/html/edumark/img/banner/edu_ilastration.png"
          className="image"
        />

        <OurWork />
        <OurServices />
        <Intro />
      </div>
      <Footer />
    </div>
  );
};
export default LandingPage;
