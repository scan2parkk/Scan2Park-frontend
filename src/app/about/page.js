import AwardsAccoladesSection from "@/components/AwardsAccoladesSection/AwardsAccoladesSection";
import CoreValuesSection from "@/components/CoreValuesSection/CoreValuesSection";
import MissionPeopleSection from "@/components/MissionPeopleSection/MissionPeopleSection";
import NewsBlogSection from "@/components/NewsBlogSection/NewsBlogSection";
import ParkingStartingPointSection from "@/components/ParkingStartingPointSection/ParkingStartingPointSection";
import WhatIsScan2ParkSection from "@/components/WhatIsScan2ParkSection/WhatIsScan2ParkSection";
import React from "react";

const AboutPage = () => {
  return (
    <>
      <ParkingStartingPointSection />
      <WhatIsScan2ParkSection />
      <MissionPeopleSection />
      <CoreValuesSection />
      <AwardsAccoladesSection />
      <WhatIsScan2ParkSection />
      <NewsBlogSection />
    </>
  );
};

export default AboutPage;
