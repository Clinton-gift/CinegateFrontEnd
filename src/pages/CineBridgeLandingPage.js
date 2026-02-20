import React, { useState } from "react";
import HeroSection from "../components/cinebridge/HeroSection";
import FilmLibrarySection from "../components/cinebridge/FilmLibrarySection";
import WhySection from "../components/cinebridge/WhySection";
import DemoLicenseModal from "../components/cinebridge/DemoLicenseModal";

export default function CineBridgeLandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openDemo = () => setIsModalOpen(true);
  const closeDemo = () => setIsModalOpen(false);

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#000" }}>
      <HeroSection onOpenDemo={openDemo} />
      <FilmLibrarySection onOpenDemo={openDemo} />
      <WhySection onOpenDemo={openDemo} />
      <DemoLicenseModal open={isModalOpen} onClose={closeDemo} />
    </div>
  );
}
