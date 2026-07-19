import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import AITopPicks from "../components/AITopPicks/AITopPicks";
import TripPlanner from "../components/TripPlanner/TripPlanner";
import PopularDestinations from "../components/PopularDestinations/PopularDestinations";
import WhyChoose from "../components/WhyChoose/WhyChoose";
import Footer from "../components/Footer/Footer";

function Home() {
  return (
    <>
      <Navbar />

      <Hero />

      <div id="ai-top-picks">
        <AITopPicks />
      </div>

      <div id="trip-planner">
        <TripPlanner />
      </div>

      <PopularDestinations />

      <WhyChoose />

      <Footer />
    </>
  );
}

export default Home;